import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/User.model";
import Vehicle from "@/models/Vehicle.model";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();
        const session = await auth();
        if (!session || !session?.user?.email || session.user.role !== "admin") {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const [
            totalPartners,
            approvedPartners,
            pendingPartners,
            rejectedPartners,
            pendingPartnerRequest
        ] = await Promise.all([
            User.countDocuments({ role: "partner" }),
            User.countDocuments({ role: "partner", partnerStatus: "approved" }),
            User.countDocuments({ role: "partner", partnerStatus: "pending", steps: 3 }),
            User.countDocuments({ role: "partner", partnerStatus: "rejected" }),
            User.find({
                role: "partner",
                partnerStatus: "pending",
                steps: {$gte : 3}
            }).lean()
        ]);

        const partnerIds = pendingPartnerRequest.map((p) => p._id);

        const partnerVehicles = await Vehicle.find({
            owner: { $in: partnerIds }
        }).lean();

        const partnerVehicleType = new Map(
            partnerVehicles.map((v) => [String(v.owner), v.type])
        );

        const pendingPartnerReview = pendingPartnerRequest.map((partner) => ({
            _id: partner._id,
            name: partner.name,
            email: partner.email,
            type: partnerVehicleType.get(String(partner._id)) || "N/A"
        }));

        return NextResponse.json(
            { message: "Request Details Fetched Successfully", totalPartners, approvedPartners, pendingPartners, rejectedPartners, pendingPartnerReview },
            { status: 200 }
        );

    } catch (error) {
        console.log("Fetching Admin Request Error", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}