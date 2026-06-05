import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireUser } from "@/lib/api-auth";
import { apiHandler } from "@/lib/errors";
import {
  getUserNotifications,
  getUnreadCount,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/services/notification.service";

export const GET = apiHandler(async () => {
  await connectDB();
  const user = await requireUser();
  const userId = user._id.toString();

  const [notifications, unreadCount] = await Promise.all([
    getUserNotifications(userId),
    getUnreadCount(userId),
  ]);

  return NextResponse.json({
    notifications: notifications.map((n) => ({
      id: n._id.toString(),
      type: n.type,
      title: n.title,
      message: n.message,
      link: n.link,
      read: n.read,
      createdAt: n.createdAt,
    })),
    unreadCount,
  });
});

export const PATCH = apiHandler(async (req) => {
  await connectDB();
  const user = await requireUser();
  const userId = user._id.toString();
  const body = await req.json();

  if (body.all === true) {
    await markAllNotificationsRead(userId);
    return NextResponse.json({ success: true });
  }

  if (body.id) {
    const updated = await markNotificationRead(userId, body.id);
    return NextResponse.json({ notification: updated });
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
});
