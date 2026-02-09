import type { Request, Response } from 'express';
export declare function createService(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getServiceById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getServiceBySlug(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getAllServices(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function updateService(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function deleteService(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=serviceController.d.ts.map