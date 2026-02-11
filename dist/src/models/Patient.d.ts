import { ObjectId } from 'mongodb';
export interface Patient {
    _id?: ObjectId;
    email?: string | undefined;
    name?: string | undefined;
    phone?: string | undefined;
    firebaseUid?: string | undefined;
    passwordHash?: string | undefined;
    role?: 'patient' | 'doctor' | 'admin';
    services?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}
export declare function getPatientsCollection(): Promise<import("mongodb").Collection<Patient>>;
export declare function createPatient(payload: {
    firebaseUid?: string | undefined;
    email?: string | undefined;
    name?: string | undefined;
    phone?: string | undefined;
    passwordHash?: string | undefined;
    role?: 'patient' | 'doctor' | 'admin';
    services?: string[];
}): Promise<{
    _id: ObjectId;
    email?: string | undefined;
    name?: string | undefined;
    phone?: string | undefined;
    firebaseUid?: string | undefined;
    passwordHash?: string | undefined;
    role?: "patient" | "doctor" | "admin";
    services?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}>;
export declare function getPatientByFirebaseUid(uid: string): Promise<import("mongodb").WithId<Patient> | null>;
export declare function getPatientByEmail(email: string): Promise<import("mongodb").WithId<Patient> | null>;
export declare function getPatientById(id: string): Promise<import("mongodb").WithId<Patient> | null>;
export declare function getAllPatients(): Promise<import("mongodb").WithId<Patient>[]>;
export declare function getPatientsByRole(role: 'patient' | 'doctor' | 'admin'): Promise<import("mongodb").WithId<Patient>[]>;
export declare function updatePatient(id: string, updates: Partial<Patient>): Promise<import("mongodb").WithId<Patient> | null>;
export declare function deletePatient(id: string): Promise<boolean>;
//# sourceMappingURL=Patient.d.ts.map