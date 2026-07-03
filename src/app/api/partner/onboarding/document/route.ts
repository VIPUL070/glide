import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
import connectDB from "@/lib/db";
import Document from "@/models/Document.model";
import User from "@/models/User.model";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const uploadSchema = z.object({
    aadhar: z.custom<Blob>((val) => val instanceof Blob).optional(),
    license: z.custom<Blob>((val) => val instanceof Blob).optional(),
    rc: z.custom<Blob>((val) => val instanceof Blob).optional(),
});

interface DocumentUpdatePayload {
    status: "pending";
    aadharUrl?: string;
    licenseUrl?: string;
    rcUrl?: string;
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const session = await auth();
        if (!session?.user?.email) {
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

        const formData = await req.formData();
        const rawData = {
            aadhar: formData.get("aadhar") || formData.get("addhar"),
            license: formData.get("license"),
            rc: formData.get("rc"),
        };

        const validation = uploadSchema.safeParse(rawData);
        if (!validation.success) {
            return NextResponse.json(
                { message: "Invalid files provided.", errors: validation.error },
                { status: 400 }
            );
        }

        const { aadhar, license, rc } = validation.data;

        if (!aadhar && !license && !rc) {
            return NextResponse.json(
                { message: "No files provided for upload." },
                { status: 400 }
            );
        }

        const updatePayload: DocumentUpdatePayload = {
            status: "pending",
        };

        if (aadhar) {
            const url = await uploadOnCloudinary(aadhar);
            if (!url) return NextResponse.json({ message: "Aadhar upload failed." }, { status: 500 });
            updatePayload.aadharUrl = url;
        }

        if (license) {
            const url = await uploadOnCloudinary(license);
            if (!url) return NextResponse.json({ message: "License upload failed." }, { status: 500 });
            updatePayload.licenseUrl = url;
        }

        if (rc) {
            const url = await uploadOnCloudinary(rc);
            if (!url) return NextResponse.json({ message: "RC upload failed." }, { status: 500 });
            updatePayload.rcUrl = url;
        }

        const partnerDocs = await Document.findOneAndUpdate(
            { owner: user._id },
            { $set: updatePayload },
            { upsert: true, new: true }
        );

        if(user.steps < 2){
            user.steps = 2;
        } else {
            user.steps = 3
        }
        user.partnerStatus = "pending"
        await user.save();

        return NextResponse.json(
            { message: "Documents updated successfully.", partnerDocs },
            { status: 200 }
        );

    } catch (error) {
        console.error("Document Uploading Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}