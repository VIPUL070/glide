import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
import connectDB from "@/lib/db";
import User from "@/models/User.model";
import Vehicle from "@/models/Vehicle.model";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const PricingSchema = z.object({
    baseFare: z.coerce.number().positive(),
    waitingCharge: z.coerce.number().nonnegative(),
    pricePerKM: z.coerce.number().positive(),
    image: z.instanceof(File).optional(),
});

export async function PATCH(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.email || session.user.role !== "partner") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const formData = await req.formData();

        const rawData = {
            baseFare: formData.get("baseFare"),
            waitingCharge: formData.get("waitingCharge"),
            pricePerKM: formData.get("pricePerKM"),
            image: formData.get("image") instanceof File ? formData.get("image") : undefined,
        };

        const validation = PricingSchema.safeParse(rawData);
        if (!validation.success) {
            return NextResponse.json(
                { message: "Validation failed", errors: validation.error.format() },
                { status: 400 }
            );
        }

        const { baseFare, waitingCharge, pricePerKM, image } = validation.data;

        const partner = await User.findOne({ email: session.user.email });
        if (!partner) {
            return NextResponse.json({ message: "Partner not found." }, { status: 404 });
        }

        const vehicle = await Vehicle.findOne({ owner: partner._id });
        if (!vehicle) {
            return NextResponse.json({ message: "Vehicle Not Found" }, { status: 404 });
        }

        if (image && image.size > 0) {
            const imageUrl = await uploadOnCloudinary(image);
            vehicle.imageUrl = imageUrl;
        }

        vehicle.baseFare = Number(baseFare);
        vehicle.waitingCharge = Number(waitingCharge);
        vehicle.pricePerKM = Number(pricePerKM);
        vehicle.status = "pending";
        vehicle.rejectionReason = "";
        partner.steps = 6;
        await vehicle.save();
        await partner.save()


        return NextResponse.json(
            { message: "Vehicle pricing updated successfully", vehicle },
            { status: 200 }
        );

    } catch (error) {
        console.error("Vehicle Pricing Setup Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.email || session.user.role !== "partner") {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();
        const partner = await User.findOne({ email: session.user.email });
        if (!partner) {
            return NextResponse.json(
                { message: "Partner not found in the database." },
                { status: 404 }
            );
        }

        const vehicle = await Vehicle.findOne({ owner: partner._id });
        if (!vehicle) {
            return NextResponse.json({ message: "Vehicle Not Found" }, { status: 404 });
        }

        return NextResponse.json(
            { message: "Pricing details fetched successfully." , vehicle},
            { status: 200 }
        );

    } catch (error) {
        console.error("Pricing Detail Fetching Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}