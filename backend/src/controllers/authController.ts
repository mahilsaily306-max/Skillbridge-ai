import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config';
import { db } from '../utils/database';
import { AuthRequest } from '../middleware/auth';

function generateToken(userId: string): string {
  return jwt.sign({ userId }, config.jwtSecret, { expiresIn: config.jwtExpiresIn as any });
}

export async function register(req: Request, res: Response) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    const existing = db.users.findByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = {
      id: uuidv4(),
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role: 'user' as const,
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.users.create(user);
    const token = generateToken(user.id);

    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, isVerified: user.isVerified },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.users.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id);
    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, isVerified: user.isVerified },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function getProfile(req: AuthRequest, res: Response) {
  try {
    const user = db.users.findById(req.userId!);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const profile = db.profiles.findByUserId(req.userId!) || { userId: req.userId };
    res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role, isVerified: user.isVerified }, profile });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateProfile(req: AuthRequest, res: Response) {
  try {
    const updates = req.body;
    let profile = db.profiles.findByUserId(req.userId!);
    if (profile) {
      profile = db.profiles.update(req.userId!, updates);
    } else {
      profile = db.profiles.create({
        id: uuidv4(),
        userId: req.userId!,
        ...updates,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    if (updates.name) {
      db.users.update(req.userId!, { name: updates.name });
    }
    res.json(profile);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function googleAuth(req: Request, res: Response) {
  try {
    const { email, name, googleId } = req.body;
    if (!email || !googleId) {
      return res.status(400).json({ error: 'Email and googleId are required' });
    }

    let user = db.users.findByEmail(email);
    if (!user) {
      user = {
        id: uuidv4(),
        email: email.toLowerCase(),
        password: '',
        name: name || email.split('@')[0],
        role: 'user',
        isVerified: true,
        googleId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.users.create(user);
    } else if (!user.googleId) {
      user = db.users.update(user.id, { googleId, isVerified: true })!;
    }

    const token = generateToken(user.id);
    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, isVerified: user.isVerified },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;
    const user = db.users.findByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const resetToken = jwt.sign({ userId: user.id, type: 'reset' }, config.jwtSecret, { expiresIn: '1h' });
    res.json({ message: 'Password reset link sent to your email', resetToken });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }
    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string; type: string };
    if (decoded.type !== 'reset') {
      return res.status(400).json({ error: 'Invalid reset token' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    db.users.update(decoded.userId, { password: hashedPassword });
    res.json({ message: 'Password reset successful' });
  } catch {
    res.status(400).json({ error: 'Invalid or expired token' });
  }
}
