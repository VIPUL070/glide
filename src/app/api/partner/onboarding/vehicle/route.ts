import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/User.model";
import Vehicle from "@/models/Vehicle.model";
import { NextRequest, NextResponse } from "next/server";
import z from 'zod';

// 1. Indian Vehicle Plate Regex 
const VEHICLE_REGEX = /^[A-Z]{2}[0-9]{2}[A-Z]{0,3}[0-9]{4}$/i;

const VehicleSchema = z.object({
    type: z.string().min(1),
    number: z.string().min(1),
    vehicleModel: z.string().min(1)
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
        const validationResponse = VehicleSchema.safeParse(body);

        if (!validationResponse.success) {
            return NextResponse.json(
                {
                    message: "Validation failed",
                    errors: validationResponse.error
                },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json(
                { message: "User not found in the database." },
                { status: 404 }
            );
        }

        const { type, number, vehicleModel } = validationResponse.data;
        if (!VEHICLE_REGEX.test(number)) {
            return NextResponse.json(
                { message: "Invalid vehicle registration number format (e.g., MH12AB1234)" },
                { status: 400 }
            );
        }

        const vehicleNumber = number.toUpperCase();

        const vehicle = await Vehicle.findOne({ owner: user._id });
        if (vehicle) {
            vehicle.type = type;
            vehicle.number = vehicleNumber;
            vehicle.vehicleModel = vehicleModel;
            vehicle.status = "pending";
            await vehicle.save();

            user.steps = user.steps < 2 ? 2 : 3;
            user.partnerStatus = "pending";
            user.partnerStatus = "pending";
            await user.save(); 

            return NextResponse.json(
                { message: "Vehicle details updated successfully!", vehicle },
                { status: 200 }
            );
        } else {
            const duplicate = await Vehicle.findOne({ number: vehicleNumber });
            if (duplicate) {
                return NextResponse.json(
                    { message: "This vehicle is already registered by another user." },
                    { status: 403 }
                );
            }

            const newVehicle = await Vehicle.create({
                owner: user._id,
                type,
                number: vehicleNumber,
                vehicleModel,
            });

            if (user.steps < 1) {
                user.steps = 1;
            }
            user.role = 'partner'
            user.partnerStatus = "pending"
            await user.save();

            return NextResponse.json(
                { message: "Vehicle registered successfully!", vehicle: newVehicle },
                { status: 201 }
            );
        }

    } catch (error) {
        console.error("Vehicle Registration Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {

        await connectDB();
        const session = await auth();
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json(
                { message: "Unauthorized: Please log in first." },
                { status: 401 }
            );
        }

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json(
                { message: "User not found in the database." },
                { status: 404 }
            );
        }

        const vehicle = await Vehicle.findOne({ owner: user._id });
        if (vehicle) {
            return NextResponse.json(
                { message: "Vehicle details fetched successfully!", vehicle },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { message: "No vehicle registered for this user.", vehicle: null },
                { status: 404 }
            );
        }

    } catch (error) {
        console.error("Vehicle Details Fetching Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}