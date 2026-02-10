import { ObjectId } from 'mongodb';
export interface Booking {
    _id?: ObjectId;
    doctorId: string;
    patientId?: string;
    service: string;
    date: string;
    time: string;
    patientEmail?: string;
    patientName?: string;
    patientPhone?: string;
    paymentMethod?: string;
    amount?: number;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    createdAt?: Date;
    updatedAt?: Date;
}
export declare function getBookingsCollection(): Promise<import("mongodb").Collection<Booking>>;
export declare function createBooking(payload: {
    doctorId: string;
    patientId?: string;
    service: string;
    date: string;
    time: string;
    patientEmail?: string;
    patientName?: string;
    patientPhone?: string;
    paymentMethod?: string;
    amount?: number;
}): Promise<any>;
export declare function getBookingById(id: string): Promise<import("mongodb").WithId<Booking> | null>;
export declare function getBookingsByPatientId(patientId: string): Promise<import("mongodb").WithId<Booking>[]>;
export declare function getBookingsByDoctorId(doctorId: string): Promise<import("mongodb").WithId<Booking>[]>;
export declare function updateBooking(id: string, payload: Partial<Booking>): Promise<any>;
export declare function deleteBooking(id: string): Promise<boolean>;
//# sourceMappingURL=Booking.d.ts.map