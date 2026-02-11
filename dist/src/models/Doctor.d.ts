import { ObjectId } from 'mongodb';
export interface Doctor {
    _id?: ObjectId;
    email: string;
    name: string;
    phone: string;
    passwordHash?: string;
    specialization?: string;
    experience?: number;
    qualification?: string;
    services?: string[];
    role: 'doctor';
    createdAt?: Date;
    updatedAt?: Date;
}
export declare function getDoctorsCollection(): Promise<import("mongodb").Collection<Doctor>>;
export declare function getAllDoctors(): Promise<import("mongodb").WithId<Doctor>[]>;
export declare function getDoctorById(id: string): Promise<import("mongodb").WithId<Doctor> | null>;
export declare function getDoctorByEmail(email: string): Promise<import("mongodb").WithId<Doctor> | null>;
export declare function updateDoctor(id: string, updates: Partial<Doctor>): Promise<import("mongodb").WithId<Doctor> | null>;
export declare function deleteDoctor(id: string): Promise<boolean>;
//# sourceMappingURL=Doctor.d.ts.map