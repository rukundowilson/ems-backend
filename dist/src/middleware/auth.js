import jwt from 'jsonwebtoken';
export function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    if (!token) {
        return res.status(401).json({ success: false, error: 'Authorization required' });
    }
    try {
        const secret = process.env.JWT_SECRET || 'dev_secret_change_me';
        const decoded = jwt.verify(token, secret);
        req.user = { id: decoded.sub, email: decoded.email, role: decoded.role };
        next();
    }
    catch (err) {
        return res.status(401).json({ success: false, error: 'Invalid token' });
    }
}
export function requireAdmin(req, res, next) {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ success: false, error: 'Admin access required' });
    }
    next();
}
//# sourceMappingURL=auth.js.map