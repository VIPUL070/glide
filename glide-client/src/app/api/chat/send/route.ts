import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Booking from "@/models/Booking.model";
import ChatMessage from "@/models/ChatMessage.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const chatSchema = z.object({
  bookingId: z.string() || z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid booking ID format",
    }),
    sender: z.string(),
    text: z
    .string().min(1).max(2000),
});

export async function POST(req: NextRequest) {
  try {

    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized, Please Login." },
        { status: 401 }
      );
    }

    const rawBody = await req.json();
    const result = chatSchema.safeParse(rawBody);
    if (!result.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    const { bookingId, sender , text } = result.data;
    await connectDB();

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    const newMessage = await ChatMessage.create({
      bookingId,
      sender,
      text,
    });

    return NextResponse.json(
       newMessage,
      { status: 200 }
    );
  } catch (error) {
    console.error("Sending Message Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}