import bcrypt from "bcryptjs";
import { Types } from "mongoose";
import Contest from "@/models/Contest";
import ContestAccount from "@/models/ContestAccount";
import User from "@/models/User";
import Holding from "@/models/Holding";
import PendingOrder from "@/models/PendingOrder";
import Transaction from "@/models/Transaction";
import PortfolioSnapshot from "@/models/PortfolioSnapshot";
import { AppError } from "@/lib/errors";
import { getRoiPercentForBalance } from "@/services/portfolio.service";
import type { ContestCreateInput, ContestJoinInput } from "@/lib/validations/contest";

export type ContestStatus = "UPCOMING" | "ACTIVE" | "ENDED";

export function getContestStatus(contest: {
  startDate?: Date;
  endDate?: Date;
}): ContestStatus {
  const now = Date.now();
  const start = contest.startDate ? new Date(contest.startDate).getTime() : 0;
  const end = contest.endDate ? new Date(contest.endDate).getTime() : 0;
  if (start && now < start) return "UPCOMING";
  if (end && now > end) return "ENDED";
  return "ACTIVE";
}

function generateInviteCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export async function createContest(userId: string, input: ContestCreateInput) {
  const creatorId = new Types.ObjectId(userId);
  const inviteCode = input.isInviteOnly ? (input.inviteCode ?? generateInviteCode()) : undefined;
  const inviteCodeHash = inviteCode ? await bcrypt.hash(inviteCode, 10) : undefined;

  const contest = await Contest.create({
    title: input.title,
    startingBalance: input.startingBalance,
    createdBy: creatorId,
    participants: [creatorId],
    startDate: new Date(input.startDate),
    endDate: new Date(input.endDate),
    isInviteOnly: input.isInviteOnly,
    inviteCodeHash,
    recurrence: input.recurrence ?? "NONE",
    maxParticipants: input.maxParticipants,
  });

  await ContestAccount.create({
    contestId: contest._id,
    userId: creatorId,
    startingBalance: contest.startingBalance,
  });

  return {
    contestId: contest._id.toString(),
    inviteCode: inviteCode ?? null,
  };
}

export async function listContests(userId: string) {
  const contests = await Contest.find().sort({ startDate: -1 }).limit(50);
  const joined = await ContestAccount.find({
    userId: new Types.ObjectId(userId),
    leftAt: null,
  }).select("contestId");
  const joinedSet = new Set(joined.map((a) => a.contestId.toString()));

  const counts = await ContestAccount.aggregate<{ _id: Types.ObjectId; count: number }>([
    { $match: { leftAt: null } },
    { $group: { _id: "$contestId", count: { $sum: 1 } } },
  ]);
  const countMap = new Map(counts.map((c) => [c._id.toString(), c.count]));

  return contests.map((c) => ({
    id: c._id.toString(),
    title: c.title,
    startingBalance: c.startingBalance,
    startDate: c.startDate,
    endDate: c.endDate,
    status: getContestStatus(c),
    isInviteOnly: Boolean(c.isInviteOnly),
    recurrence: c.recurrence ?? "NONE",
    participantsCount: countMap.get(c._id.toString()) ?? 0,
    joined: joinedSet.has(c._id.toString()),
  }));
}

export async function getContest(contestId: string, userId: string) {
  const contest = await Contest.findById(contestId);
  if (!contest) throw new AppError("Contest not found", 404, "CONTEST_NOT_FOUND");

  const account = await ContestAccount.findOne({
    contestId: contest._id,
    userId: new Types.ObjectId(userId),
    leftAt: null,
  });

  const participantsCount = await ContestAccount.countDocuments({
    contestId: contest._id,
    leftAt: null,
  });

  return {
    id: contest._id.toString(),
    title: contest.title,
    startingBalance: contest.startingBalance,
    startDate: contest.startDate,
    endDate: contest.endDate,
    status: getContestStatus(contest),
    isInviteOnly: Boolean(contest.isInviteOnly),
    recurrence: contest.recurrence ?? "NONE",
    participantsCount,
    joined: Boolean(account),
    myAccount: account
      ? {
          cashBalance: account.cashBalance,
          totalPortfolioValue: account.totalPortfolioValue,
          roi: getRoiPercentForBalance(account.totalPortfolioValue, account.startingBalance),
        }
      : null,
  };
}

export async function joinContest(userId: string, contestId: string, input: ContestJoinInput) {
  const contest = await Contest.findById(contestId);
  if (!contest) throw new AppError("Contest not found", 404, "CONTEST_NOT_FOUND");

  const status = getContestStatus(contest);
  if (status !== "UPCOMING") {
    throw new AppError("Contest already started", 400, "CONTEST_ALREADY_STARTED");
  }

  if (contest.maxParticipants != null) {
    const count = await ContestAccount.countDocuments({ contestId: contest._id, leftAt: null });
    if (count >= contest.maxParticipants) {
      throw new AppError("Contest is full", 400, "CONTEST_FULL");
    }
  }

  if (contest.isInviteOnly) {
    if (!contest.inviteCodeHash) {
      throw new AppError("Invite-only contest is misconfigured", 500, "CONTEST_INVITE_MISSING");
    }
    if (!input.inviteCode) {
      throw new AppError("Invite code required", 400, "INVITE_CODE_REQUIRED");
    }
    const ok = await bcrypt.compare(input.inviteCode, contest.inviteCodeHash);
    if (!ok) {
      throw new AppError("Invalid invite code", 400, "INVITE_CODE_INVALID");
    }
  }

  const uid = new Types.ObjectId(userId);
  const account = await ContestAccount.findOneAndUpdate(
    { contestId: contest._id, userId: uid },
    {
      $set: {
        leftAt: null,
      },
      $setOnInsert: {
        startingBalance: contest.startingBalance,
        cashBalance: contest.startingBalance,
        totalPortfolioValue: contest.startingBalance,
        joinedAt: new Date(),
      },
    },
    { upsert: true, new: true }
  );

  await Contest.updateOne(
    { _id: contest._id },
    { $addToSet: { participants: uid } }
  );

  return {
    contestId: contest._id.toString(),
    cashBalance: account.cashBalance,
    totalPortfolioValue: account.totalPortfolioValue,
  };
}

export async function leaveContest(userId: string, contestId: string) {
  const contest = await Contest.findById(contestId);
  if (!contest) throw new AppError("Contest not found", 404, "CONTEST_NOT_FOUND");

  const status = getContestStatus(contest);
  if (status !== "UPCOMING") {
    throw new AppError("Contest already started", 400, "CONTEST_ALREADY_STARTED");
  }

  const uid = new Types.ObjectId(userId);
  const cid = contest._id;

  await ContestAccount.deleteOne({ contestId: cid, userId: uid });
  await Holding.deleteMany({ userId: uid, contestId: cid });
  await PendingOrder.deleteMany({ userId: uid, contestId: cid });
  await Transaction.deleteMany({ userId: uid, contestId: cid });
  await PortfolioSnapshot.deleteMany({ userId: uid, contestId: cid });
  await Contest.updateOne({ _id: cid }, { $pull: { participants: uid } });

  return { ok: true };
}

export async function getContestLeaderboard(contestId: string, currentUserId?: string) {
  const accounts = await ContestAccount.find({ contestId: new Types.ObjectId(contestId), leftAt: null })
    .sort({ totalPortfolioValue: -1 })
    .limit(50)
    .populate("userId", "name");

  return accounts.map((a, index) => {
    const user = a.userId as unknown as { _id: Types.ObjectId; name: string };
    const roi = getRoiPercentForBalance(a.totalPortfolioValue, a.startingBalance);
    return {
      rank: index + 1,
      userId: user._id.toString(),
      name: user.name,
      portfolioValue: a.totalPortfolioValue,
      returns: roi,
      isCurrentUser: currentUserId ? user._id.toString() === currentUserId : false,
    };
  });
}

export async function getContestCreatorName(contestId: string) {
  const contest = await Contest.findById(contestId).select("createdBy");
  if (!contest) return null;
  const creator = await User.findById(contest.createdBy).select("name");
  return creator?.name ?? null;
}
