import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/User.model";
import { NextRequest, NextResponse } from "next/server";
import crypto from 'crypto';

export function generateRoomId(userId: string): string {
  const secretSalt = process.env.KYC_SECRET_SALT || "default_secure_fallback_salt_32_chars_long!!";

  // Using 8 random bytes (16 hex chars) ensures excellent entropy per generation retry
  const nonce = crypto.randomBytes(8).toString('hex'); 
  const input = `${userId}-${secretSalt}-${nonce}`;
  
  return crypto
    .createHash('sha256')
    .update(input)
    .digest('base64url') // Perfectly safe for URLs out of the box
    .substring(0, 24);   // Truncated to 24 chars for balanced security and readability
}

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  req: NextRequest, 
  context: RouteContext
) {
  try {
    const session = await auth();
    if (!session?.user?.email || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();
    const { id: partnerId } = await context.params;

    if (!partnerId) {
      return NextResponse.json(
        { success: false, message: "Missing partner ID parameter" },
        { status: 400 }
      );
    }

    const roomId = generateRoomId(partnerId);
    
    const updatedPartner = await User.findOneAndUpdate(
      { _id: partnerId, role: "partner" },
      {
        $set: {
          videoKycRoomId: roomId,
          videoKycStatus: "in_progress",
          steps: 4,
        }
      },
      { new: true, runValidators: true }
    );

    if (!updatedPartner) {
      return NextResponse.json(
        { success: false, message: "Partner not found or target user is not a valid partner" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "KYC roomId generated successfully",
        roomId
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Critical: Video KYC initialization failure", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}