import type { Request, Response, NextFunction } from 'express';
import { auth } from '../firebaseAdmin.js';

export async function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = typeof req.headers.authorization === 'string' ? req.headers.authorization : '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : (req.body && req.body.idToken) || null;

  if (!token) {
    return res.status(401).json({ success: false, error: 'Authorization token required' });
  }

  try {
    const decoded = await auth.verifyIdToken(token);
    // attach minimal user info to the request for downstream handlers
    (req as any).firebase = { uid: decoded.uid, email: decoded.email, claims: decoded };
    return next();
  } catch (err) {
    console.error('Token verification failed', err);
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
}

export default verifyToken;
