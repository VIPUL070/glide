import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Booking from "@/models/Booking.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    await connectDB();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // 2. Pre-populate all 7 days with 0 to prevent missing keys on inactive days
    const earningMap: Record<string, number> = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      const formattedKey = d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      });
      earningMap[formattedKey] = 0;
    }

    const bookings = await Booking.find({
      paymentStatus: "paid",
      createdAt: { $gte: sevenDaysAgo },
    }).select("adminCommission createdAt").lean();

    let totalAdminCommission = 0;

    bookings.forEach((booking) => {
      const commission = Number(booking.adminCommission) || 0;
      const dateKey = new Date(booking.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        timeZone: "Asia/Kolkata",
      });

      if (dateKey in earningMap) {
        earningMap[dateKey] = Number((earningMap[dateKey] + commission).toFixed(2));
      } else {
        earningMap[dateKey] = Number(commission.toFixed(2));
      }

      totalAdminCommission = Number((totalAdminCommission + commission).toFixed(2));
    });

    const chartData = Object.entries(earningMap).map(([date, earnings]) => ({
      date,
      earnings,
    }));

    return NextResponse.json(
      {
        success: true,
        earning: {
          chartData,
          earningMap,
          totalAdminCommission,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetching Admin Earning Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}