import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Booking from "@/models/Booking.model";
import ChatMessage from "@/models/ChatMessage.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const chatSchema = z.object({
  bookingId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid booking ID format",
    }),
});

export async function GET(req: NextRequest) {
  try {

    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized, Please Login." },
        { status: 401 }
      );
    }

    const bookingId = req.nextUrl.searchParams.get("bookingId");
    const result = chatSchema.safeParse({ bookingId });
    if (!result.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    await connectDB();

    const booking = await Booking.findById(result.data.bookingId);
    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    const messages = await ChatMessage.find({
      bookingId
    }).sort({createdAt: 1})

    return NextResponse.json(
       messages,
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetching Messages Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}