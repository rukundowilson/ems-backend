import { ObjectId } from 'mongodb';
export interface Service {
    _id?: ObjectId;
    title: string;
    slug: string;
    description: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare function getServicesCollection(): Promise<import("mongodb").Collection<Service>>;
export declare function createService(payload: {
    title: string;
    slug: string;
    description: string;
}): Promise<{
    _id: ObjectId;
    title: string;
    slug: string;
    description: string;
    createdAt?: Date;
    updatedAt?: Date;
}>;
export declare function getServiceById(id: string): Promise<import("mongodb").WithId<Service> | null>;
export declare function getServiceBySlug(slug: string): Promise<import("mongodb").WithId<Service> | null>;
export declare function getAllServices(): Promise<import("mongodb").WithId<Service>[]>;
export declare function updateService(id: string, payload: Partial<{
    title: string;
    slug: string;
    description: string;
}>): Promise<import("mongodb").WithId<Service> | null>;
export declare function deleteService(id: string): Promise<boolean>;
//# sourceMappingURL=Service.d.ts.map