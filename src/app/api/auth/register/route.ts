import connectDB from "@/lib/db";
import User from "@/model/User.model";
import bcrypt from "bcryptjs";
import z from "zod";
import { NextRequest, NextResponse } from "next/server";

export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body= await req.json();

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

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields (name, email, password) are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists with this email" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
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

  } catch (error) {
    console.error("Registration Error:", error);
    
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}