import type { Request, Response } from 'express';
import type { AuthRequest } from '../middleware/auth.js';
export declare function createDoctor(req: Request | AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getAllDoctors(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getDoctorById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function updateDoctor(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function deleteDoctor(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=doctorController.d.ts.map