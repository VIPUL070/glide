import connectDB from "@/lib/db";
import User from "@/models/User.model";
import { NextRequest, NextResponse } from "next/server";
import z from 'zod';

const OTPSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().min(6, "OTP must be at least 6 characters")
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    
    const validation = OTPSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: validation.error
        },
        { status: 400 }
      );
    }

    const { email, otp } = validation.data;

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "User not found!" },
        { status: 404 }
      );
    }

    if (user.isEmailVerified) {
      return NextResponse.json(
        { message: "Email is already verified. Please login." },
        { status: 200 } 
      );
    } 
    
    if (user.otp !== otp) {
      return NextResponse.json(
        { message: "Invalid verification code" },
        { status: 400 }
      );
    }

    if (new Date() > new Date(user.otpExpiry)) {
      return NextResponse.json(
        { message: "Verification code has expired. Please request a new one." },
        { status: 400 }
      );
    }

    user.isEmailVerified = true;
    user.otp = undefined; 
    user.otpExpiry = undefined;

    await user.save();

    return NextResponse.json(
      { message: "Email verified successfully! Account is now active." },
      { status: 200 }
    );

  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}