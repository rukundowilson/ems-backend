import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.js';
export declare function getAllPatients(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getPatientById(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function updatePatient(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function deletePatient(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getAllDoctors(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function createDoctor(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getAllServices(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getServiceById(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function createService(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function updateService(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function deleteService(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getAllBookings(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=adminController.d.ts.map