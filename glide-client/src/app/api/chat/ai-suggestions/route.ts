import { auth } from "@/auth";
import connectDB from "@/lib/db";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod";

const geminiUrl = process.env.GEMINI_API_URL;
const msgSchema = z.object({
  lastMessage: z.string(),
  role: z.string()
})

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

    if (!geminiUrl) {
      return NextResponse.json(
        { message: "Gemini URL is invalid." },
        { status: 404 }
      );
    }

    const body = await req.json();
    const parsedData = msgSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: parsedData.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }
    const {lastMessage, role} = parsedData.data;
    await connectDB();

    const prompt = `You are an AI reply suggestion system for a vehicle booking chat app.

Generate short, smart, human-like quick reply suggestions based on:
- ROLE (DRIVER/PARTNER or USER)
- RECENT_MESSAGE

Rules:
- Return exactly 3 suggestions
- Keep replies short (3-12 words)
- Match the conversation context and tone
- Driver replies should sound professional and helpful
- User replies should sound natural and realistic
- Avoid repetition
- Return ONLY valid JSON

Output format:
{
  "suggestions": [
    "Reply 1",
    "Reply 2",
    "Reply 3"
  ]
}

Input:
ROLE: ${role}
RECENT_MESSAGE: ${lastMessage}"`

    const response = await axios.post(geminiUrl, {
      "contents": [
        {
          "parts": [
            {
              "text": `${prompt}`
            }
          ]
        }
      ]
    })

    const suggestions = response.data.candidates[0].content.parts[0].text

    return NextResponse.json(
      suggestions,
      { status: 200 }
    );

  } catch (error) {
    console.error("AI Gemini Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}