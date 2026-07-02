import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { db } from '../utils/database';

export async function getNotifications(req: AuthRequest, res: Response) {
  try {
    const notifications = db.notifications.findByUserId(req.userId!);
    notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(notifications);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function markNotificationRead(req: AuthRequest, res: Response) {
  try {
    const notification = db.notifications.markRead(req.params.id);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    res.json(notification);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function markAllRead(req: AuthRequest, res: Response) {
  try {
    const notifications = db.notifications.findByUserId(req.userId!);
    notifications.forEach(n => db.notifications.markRead(n.id));
    res.json({ message: 'All notifications marked as read' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
