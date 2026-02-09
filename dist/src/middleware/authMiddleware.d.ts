import type { Request, Response, NextFunction } from 'express';
export declare function verifyToken(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
export default verifyToken;
//# sourceMappingURL=authMiddleware.d.ts.map