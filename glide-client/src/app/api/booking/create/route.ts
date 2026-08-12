import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Booking from "@/models/Booking.model";
import User from "@/models/User.model";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const LocationSchema = z.object({
    type: z.literal("Point"),
    coordinates: z.tuple([
        z.number(),
        z.number()
    ]),
});

const BookingSchema = z.object({
    driverId: z.string(),
    vehicleId: z.string(),
    pickupAddress: z.string().min(1, "Pickup address is required").max(500),
    dropoffAddress: z.string().min(1, "Drop address is required").max(500),
    fare: z.number().positive("Fare must be positive"),
    pickUpLocation: LocationSchema,
    dropoffLocation: LocationSchema,
    userMobile: z
        .string()
        .regex(/^\+?[1-9]\d{7,14}$/, "Invalid user mobile number"),
});

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const session = await auth();
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json(
                { message: "Unauthorized: Please log in first." },
                { status: 401 }
            );
        }

        const body = await req.json();
        if (body.userMobile) {
            body.userMobile = body.userMobile.replace(/\s+/g, "").trim();
        }

        const parsedBody = BookingSchema.safeParse(body);
        if (!parsedBody.success) {
            return NextResponse.json(
                { message: "Validation failed", errors: parsedBody.error },
                { status: 400 }
            );
        }

        const { driverId, vehicleId, pickupAddress, dropoffAddress, pickUpLocation, dropoffLocation, userMobile, fare } = parsedBody.data;

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json(
                { message: "User Not Found" },
                { status: 400 }
            )
        }

        const [driver, existing] = await Promise.all([
            User.findById(driverId),
            Booking.findOne({
                user: user._id,
                bookingStatus: {
                    $in: ["requested", "awaiting_payment", "confirmed", "started"]
                }
            }),

        ])
        if (!driver) {
            return NextResponse.json(
                { message: "Driver Not Found" },
                { status: 400 }
            )
        }
        if (existing) {
            return NextResponse.json(
                existing,
                { status: 400 }
            )
        }

        const booking = await Booking.create({
            user: user._id,
            driver: driver._id,
            vehicle: vehicleId,
            pickupAddress,
            dropoffAddress,
            pickUpLocation,
            dropoffLocation,
            userMobile,
            driverMobile: driver.mobileNumber,
            fare,
            bookingStatus: "requested"
        })

        return NextResponse.json(
            { message: "Booking Created Successfully!", booking },
            { status: 200 }
        )

    } catch (error) {
        console.error("Creating Bookings Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}