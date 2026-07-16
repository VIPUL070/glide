import { auth } from "@/auth";
import connectDB from "@/lib/db";
import BankDetail from "@/models/BankDetail.model";
import Document from "@/models/Document.model";
import User from "@/models/User.model";
import Vehicle from "@/models/Vehicle.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.email || session.user.role !== "admin") {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();
        const { id: pId } = await context.params;

        const partner = await User.findById(pId);
        if (!partner || partner.role !== "partner") {
            return NextResponse.json(
                { message: "Partner not found or invalid role" },
                { status: 404 } 
            );
        }

        const [vehicle, docs, bankDetails] = await Promise.all([
            Vehicle.findOne({ owner: pId }),
            Document.findOne({ owner: pId }),
            BankDetail.findOne({ owner: pId })
        ]);

        return NextResponse.json(
            {
                message: "Partner details fetched successfully",
                partner: {
                    _id: partner._id,
                    name: partner.name,
                    email: partner.email,
                    partnerStatus: partner.partnerStatus
                },
                vehicle: vehicle || null,
                documents: docs || null,
                bank: bankDetails || null
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Fetching Partner Review Details Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}