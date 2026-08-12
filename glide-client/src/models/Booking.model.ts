import mongoose from "mongoose";

export type BookingStatus = "idle" | "requested" | "awaiting_payment" | "confirmed" | "started" | "completed" | "cancelled" | "rejected" | "expired"

export type PaymentStatus = "pending" | "paid" | "cash" | "failed"

export interface IBooking {
    user: mongoose.Types.ObjectId;
    driver: mongoose.Types.ObjectId;
    vehicle: mongoose.Types.ObjectId;
    pickupAddress: string;
    dropoffAddress: string;
    pickUpLocation: {
        type: "Point",
        coordinates: [number, number]
    };
    dropoffLocation: {
        type: "Point",
        coordinates: [number, number]
    };
    fare: number;
    userMobile: string;
    driverMobile: string;
    bookingStatus: BookingStatus;
    paymentStatus: PaymentStatus;
    adminCommission: number;
    partnerAmount: number;
    pickupOtp: string;
    pickupOtpExpires: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const bookingSchema = new mongoose.Schema<IBooking>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        driver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        vehicle: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vehicle",
            required: true,
        },
        pickupAddress: {
            type: String,
            required: true,
        },
        dropoffAddress: {
            type: String,
            required: true,
        },
        pickUpLocation: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },
            coordinates: [Number]
        },
        dropoffLocation: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },
            coordinates: [Number]
        },
        fare: {
            type: Number,
            required: true,
        },
        userMobile: {
            type: String,
            required: true,
        },
        driverMobile: {
            type: String,
            required: true,
        },
        bookingStatus: {
            type: String,
            enum: ["requested", "awating_payment", "confirmed", "started", "completed", "cancelled", "rejected", "expired"],
            default: "idle",
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "cash", "failed"],
            default: "pending",
        },
        adminCommission: {
            type: Number,
            default: 0,
        },
        partnerAmount: {
            type: Number,
            deault: 0,
        },
        pickupOtp: {
            type: String,
        },
        pickupOtpExpires: {
            type: Date,
        },
    },
    { timestamps: true}
);

bookingSchema.index({ pickUpLocation: "2dsphere" });
bookingSchema.index({ dropoffLocation: "2dsphere" });

const Booking = mongoose.models.Booking || mongoose.model("Booking" , bookingSchema)
export default Booking;