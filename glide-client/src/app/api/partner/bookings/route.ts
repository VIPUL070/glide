import { auth } from "@/auth";
import connectDB from "@/lib/db"
import Booking from "@/models/Booking.model";
import User from "@/models/User.model";
import { NextResponse } from "next/server"

export async function GET(){
  try {
    await connectDB();

    const session = await auth();
    if(!session?.user || session?.user?.role !== "partner"){
        return NextResponse.json(
            {message:"Unauthorized. Login First!"},
            {status:401}
        )
    }

    const driver = await User.findOne({email:session.user.email})
    const bookings = await Booking.find({
        driver:driver._id
    })
    .populate("user driver vehicle")
    .sort({createdAt:-1});

    if(!bookings){
        return NextResponse.json(
            {bookings: []},
            {status:400}
        )
    }

    return NextResponse.json(
        bookings,
        {status:200}
    )
    
  } catch (error) {
    console.log("Fetching Partner Bookings Error", error)
    return NextResponse.json(
        {message: "Internal Server Error"},
        {status: 500}
    )
  }
}