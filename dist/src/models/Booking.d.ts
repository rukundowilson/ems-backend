import { ObjectId } from 'mongodb';
export interface Booking {
    _id?: ObjectId;
    doctorId: string;
    patientId?: string;
    serviceId: string;
    date: string;
    time: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    patientEmail?: string;
    patientName?: string;
    patientPhone?: string;
    paymentMethod?: string;
    amount?: number;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare function getBookingsCollection(): Promise<import("mongodb").Collection<Booking>>;
export declare function getAllBookings(): Promise<import("mongodb").WithId<Booking>[]>;
export declare function getBookingById(id: string): Promise<import("mongodb").WithId<Booking> | null>;
export declare function getBookingsByDoctor(doctorId: string): Promise<import("mongodb").WithId<Booking>[]>;
export declare function getBookingsByPatient(patientId: string): Promise<import("mongodb").WithId<Booking>[]>;
export declare function createBooking(booking: Omit<Booking, '_id'>): Promise<{
    _id: ObjectId;
    doctorId: string;
    patientId?: string;
    serviceId: string;
    date: string;
    time: string;
    status: "pending" | "confirmed" | "completed" | "cancelled";
    patientEmail?: string;
    patientName?: string;
    patientPhone?: string;
    paymentMethod?: string;
    amount?: number;
    createdAt?: Date;
    updatedAt?: Date;
}>;
export declare function updateBooking(id: string, updates: Partial<Booking>): Promise<import("mongodb").WithId<Booking> | null>;
export declare function deleteBooking(id: string): Promise<boolean>;
//# sourceMappingURL=Booking.d.ts.map