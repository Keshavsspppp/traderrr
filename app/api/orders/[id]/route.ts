import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireUser } from "@/lib/api-auth";
import { apiHandler } from "@/lib/errors";
import { cancelOrder } from "@/services/order.service";

export const DELETE = apiHandler(async (req, context) => {
    await connectDB();
    const user = await requireUser();
    const { id } = await (context?.params ?? Promise.resolve({ id: "" }));
    const url = new URL(req.url);
    const contestId = url.searchParams.get("contestId");
    const order = await cancelOrder(user._id.toString(), id, contestId);
    return NextResponse.json({ order });
});
