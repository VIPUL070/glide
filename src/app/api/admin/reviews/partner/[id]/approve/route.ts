import { auth } from "@/auth";
import connectDB from "@/lib/db";
import BankDetail from "@/models/BankDetail.model";
import Document from "@/models/Document.model";
import User from "@/models/User.model";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
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

        if (partner.partnerStatus === "approved") {
            return NextResponse.json(
                { message: "Partner already approved" },
                { status: 400 }
            );
        }

        const [partnerDocs, partnerBank] = await Promise.all([
            Document.findOne({ owner: partner._id }),
            BankDetail.findOne({ owner: partner._id })
        ]);

        if (!partnerDocs || !partnerBank) {
            return NextResponse.json(
                { message: "Partner documents or bank details are missing" },
                { status: 400 }
            );
        }

        partner.partnerStatus = "approved";
        partner.steps = 4;
        partnerDocs.status = "approved";
        partnerBank.status = "verified";

        await Promise.all([
            partner.save(),
            partnerDocs.save(),
            partnerBank.save()
        ]);

        return NextResponse.json(
            { message: "Partner approved successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Approve Partner Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}