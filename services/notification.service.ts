import Notification, { type NotificationType } from "@/models/Notification";
import { Types } from "mongoose";

export async function createNotification(input: {
  userId: Types.ObjectId | string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
}) {
  return Notification.create({
    userId: input.userId,
    type: input.type,
    title: input.title,
    message: input.message,
    link: input.link,
    read: false,
  });
}

export async function getUserNotifications(userId: string, limit = 20) {
  return Notification.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit);
}

export async function getUnreadCount(userId: string) {
  return Notification.countDocuments({ userId, read: false });
}

export async function markNotificationRead(userId: string, notificationId: string) {
  return Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { read: true },
    { new: true }
  );
}

export async function markAllNotificationsRead(userId: string) {
  await Notification.updateMany({ userId, read: false }, { read: true });
}
