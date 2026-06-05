import { z } from "zod";

export const contestCreateSchema = z
  .object({
    title: z.string().min(1),
    startingBalance: z.number().positive(),
    startDate: z.string().min(1),
    endDate: z.string().min(1),
    recurrence: z.enum(["NONE", "WEEKLY", "MONTHLY"]).default("NONE"),
    isInviteOnly: z.boolean().default(false),
    inviteCode: z.string().min(4).optional(),
    maxParticipants: z.number().int().min(2).optional(),
  })
  .refine((data) => !Number.isNaN(new Date(data.startDate).getTime()), {
    message: "Invalid start date",
    path: ["startDate"],
  })
  .refine((data) => !Number.isNaN(new Date(data.endDate).getTime()), {
    message: "Invalid end date",
    path: ["endDate"],
  })
  .refine((data) => new Date(data.startDate) < new Date(data.endDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  })
  .refine((data) => !data.isInviteOnly || (data.inviteCode != null && data.inviteCode.length >= 4), {
    message: "Invite code is required",
    path: ["inviteCode"],
  });

export type ContestCreateInput = z.infer<typeof contestCreateSchema>;

export const contestJoinSchema = z.object({
  inviteCode: z.string().min(4).optional(),
});

export type ContestJoinInput = z.infer<typeof contestJoinSchema>;
