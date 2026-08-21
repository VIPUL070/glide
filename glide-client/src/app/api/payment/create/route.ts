import { auth } from "@/auth";
import connectDB from "@/lib/db";
import razorpay from "@/lib/razorpay";
import Booking from "@/models/Booking.model";
import { NextRequest, NextResponse } from "next/server";

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

        const { bookingId } = await req.json();
        if (!bookingId) {
            return NextResponse.json(
                { message: "Booking ID is required." },
                { status: 400 }
            );
        }

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return NextResponse.json(
                { message: "Booking Not Found." },
                { status: 404 }
            )
        }

        const userId = session.user.id;
        if (booking.user && userId && booking.user.toString() !== userId.toString()) {
            return NextResponse.json(
                { message: "Forbidden: You are not authorized to pay for this booking." },
                { status: 403 }
            );
        }

        if (booking.paymentStatus === "paid" || booking.bookingStatus === "confirmed") {
            return NextResponse.json(
                { message: "This booking has already been paid for." },
                { status: 400 }
            );
        }


        const receipt = `rcpt_${booking._id.toString().slice(-20)}_${Date.now().toString().slice(-8)}`;

        const options = {
            amount: Math.round(booking.fare * 100),
            currency: "INR",
            receipt,
            notes: {
                bookingId: booking._id.toString(),
            },
        };

        //create a payment order using razorpay
        const order = await razorpay.orders.create(options)

        booking.bookingStatus = "awaiting_payment";
        await booking.save();

        return NextResponse.json(
            {
                success: true,
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
            },
            { status: 200 }
        )
        
    } catch (error) {
        console.log("Creating Payment Error", error)
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        )
    }
}