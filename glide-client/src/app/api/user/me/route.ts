import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/User.model";

export async function GET(req: Request) {
  try {
    await connectDB();

    const session = await auth();
    if (!session || !session.user || !session.user.email) {
      return Response.json(
        { message: "Unauthorized: Please log in" },
        { status: 401 }
      );
    }

    const user = await User.findOne({ email: session.user.email }).select("-password");

    if (!user) {
      return Response.json(
        { message: "User not found" },
        { status: 404 }
      );
    }
    return Response.json(user, { status: 200 });

  } catch (error) {
    console.error("Fetching User Error:", error);
    
    return Response.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}