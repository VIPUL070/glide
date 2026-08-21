import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Booking from "@/models/Booking.model";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const paymentSchema = z.object({
    bookingId: z.string(),
    razorpay_payment_id: z.string(),
    razorpay_order_id: z.string(),
    razorpay_signature: z.string(),
})

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const session = await auth();
        if (!session?.user) {
            return NextResponse.json(
                { message: "Unauthorized: Please log in first." },
                { status: 401 }
            );
        }

        const body = await req.json();
        const parsedBody = paymentSchema.safeParse(body);
        if (!parsedBody.success) {
            return NextResponse.json(
                { message: "Invalid payment payload," },
                { status: 400 }
            );
        }

        const { bookingId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = parsedBody.data;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return NextResponse.json(
                { message: "Booking not found." },
                { status: 404 }
            );
        }

        const userId = session.user.id;
        if (booking.user && userId && booking.user.toString() !== userId.toString()) {
            return NextResponse.json(
                { message: "Forbidden: You are not authorized to pay for this booking." },
                { status: 403 }
            );
        }

        const secret = process.env.RAZORPAY_API_SECRET;
        if (!secret) {
            console.error("RAZORPAY_API_SECRET is not configured.");
            return NextResponse.json(
                { message: "Server payment configuration error." },
                { status: 500 }
            );
        }

        //creating signature
        const generatedSignature = crypto.createHmac('sha256', secret)
            .update( razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        const isAuthentic = crypto.timingSafeEqual(
            Buffer.from(generatedSignature),
            Buffer.from(razorpay_signature)
        );

        if (!isAuthentic) {
            return NextResponse.json(
                { message: "Payment verification failed: Invalid signature." },
                { status: 400 }
            );
        }

        const adminCommission = booking.fare * 0.10;
        const partnerAmount = booking.fare - adminCommission;

        booking.adminCommission = adminCommission ;
        booking.partnerAmount = partnerAmount;
        booking.paymentStatus = "paid";
        booking.status = "confirmed";
        await booking.save();

        return NextResponse.json(
            {
                success: true,
                message: "Payment verified and booking confirmed successfully.",
                adminCommission,
                partnerAmount
            },
            { status: 200 }
        )

    } catch (error) {
        console.log("Verify Payment Error", error)
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        )
    }
}