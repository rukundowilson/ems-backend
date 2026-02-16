import type { Request, Response } from 'express';
export declare function createDoctor(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getAllDoctors(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getDoctorById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function updateDoctor(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function deleteDoctor(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function updateDoctorProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getDoctorBookings(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function markBookingCompleted(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=doctorController.d.ts.map