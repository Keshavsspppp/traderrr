import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireUser } from "@/lib/api-auth";
import { apiHandler } from "@/lib/errors";
import { cancelOrder } from "@/services/order.service";

export const DELETE = apiHandler(async (_req, context) => {
    await connectDB();
    const user = await requireUser();
    const { id } = await (context?.params ?? Promise.resolve({ id: "" }));
    const order = await cancelOrder(user._id.toString(), id);
    return NextResponse.json({ order });
});
