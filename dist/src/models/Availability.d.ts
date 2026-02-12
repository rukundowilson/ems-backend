import { ObjectId } from 'mongodb';
export interface Availability {
    _id?: ObjectId;
    doctorId: string;
    date: string;
    start: string;
    end: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare function getAvailabilityCollection(): Promise<import("mongodb").Collection<Availability>>;
export declare function getDoctorAvailability(doctorId: string): Promise<Availability[]>;
export declare function getAvailabilityByDate(doctorId: string, date: string): Promise<Availability[]>;
export declare function createAvailability(doctorId: string, availability: Omit<Availability, '_id' | 'doctorId'>): Promise<Availability>;
export declare function createBulkAvailability(doctorId: string, availabilities: Omit<Availability, '_id' | 'doctorId'>[]): Promise<Availability[]>;
export declare function updateAvailability(id: string, updates: Partial<Availability>): Promise<Availability | null>;
export declare function deleteAvailability(id: string): Promise<boolean>;
export declare function deleteAvailabilityByDate(doctorId: string, date: string): Promise<number>;
export declare function getAvailabilityByService(serviceSlug: string): Promise<Availability[]>;
export declare function getAvailabilityByServiceId(serviceId: string): Promise<Availability[]>;
//# sourceMappingURL=Availability.d.ts.map