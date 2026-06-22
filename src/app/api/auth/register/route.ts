import connectDB from "@/lib/db";
import User from "@/models/User.model";
import bcrypt from "bcryptjs";
import z from "zod";
import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@/lib/sendMail";

export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validation = RegisterSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: validation.error
        },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;
    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isEmailVerified) {
      return NextResponse.json(
        { message: "User already exists with this email" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    const emailTemplate = `
      <div style="font-family: DM-sans, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Verify Your Email</h2>
        <p>Thank you for registering. Please use the following One-Time Password (OTP) to complete your verification. This code is valid for 5 minutes.</p>
        <h1 style="background: #f4f4f4; padding: 10px; text-align: center; letter-spacing: 5px; color: #333;">${otp}</h1>
        <p>If you did not request this code, please ignore this email.</p>
      </div>
    `;

    if (existingUser && !existingUser.isEmailVerified) {
      existingUser.name = name;
      existingUser.email = email;
      existingUser.password = hashedPassword;
      existingUser.otp = otp;
      existingUser.otpExpiry = otpExpiry
      await existingUser.save();

      await sendMail(email, "Your OTP for Email Verification", emailTemplate);

      return NextResponse.json(
        { message: "Account pending verification. New OTP sent." },
        { status: 200 }
      );

    } else {
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        otp,
        otpExpiry
      });

      await sendMail(email, "Your OTP for Email Verification", emailTemplate);

      return NextResponse.json(
        {
          message: "User registered successfully. Please verify your email.",
          user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt
          },
        },
        { status: 201 }
      );
    }

  } catch (error) {
    console.error("Registration Error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}