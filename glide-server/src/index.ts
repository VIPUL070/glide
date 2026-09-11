import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server, Socket } from "socket.io";
import User from "./models/User.model.js";
dotenv.config();

const port = process.env.PORT || 8000;
const db_url = process.env.DB_URL;
const next_url = process.env.NEXT_BASE_URL;

export const connectDB = async () => {
  try {
    await mongoose.connect(`${db_url}`)
    console.log("DB Connected!")
  } catch (error) {
    console.error("Unable to connect to DB.", error);
    process.exit(1);
  }
}

const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(cors({
  origin: [next_url!],
  credentials: true
}))

const io = new Server(server, {
  cors: {
    origin: next_url!,
  }
})

io.on("connection", (socket: Socket) => {

  socket.on("identity", async (userId) => {
    try {
      socket.data.userId = userId;
      await User.findByIdAndUpdate(userId, { socketId: socket.id, isOnline: true });
    } catch (err) {
      console.error("identity handler error:", err);
    }
  })

  socket.on("watcher", async ({ userId, lat, lng }) => {
    try {
      if (!userId || typeof lat !== "number" || typeof lng !== "number") return;

      await User.findByIdAndUpdate(
        userId,
        {
          location: {
            type: "Point",
            coordinates: [lng, lat]
          }
        }
      );
      console.log(`Updated location for user ${userId}: [${lng}, ${lat}]`);
    } catch (error) {
      console.error("Error updating location:", error);
    }
  });

  socket.on("join", (bookingId) => {
    console.log("join", bookingId);

    socket.join(`ride-${bookingId}`)
  })

  socket.on("driver-location-update", (bookingId, lat, lng) => {
    io.to(`ride-${bookingId}`).emit("driver-location", {
      lat,
      lng
    })
  })

  socket.on('chat-message', (data) => {
    io.to(`ride-${data.bookingId}`).emit('chat-msg', data);
  })

  socket.on("disconnect", async () => {
    if (!socket.data.userId) return;
    await User.findByIdAndUpdate(
      socket.data.userId,
      {
        $set: { socketId: null, isOnline: false },
        $unset: { location: "" }
      }
    );
  })

})

app.post(`/emit`, async (req, res) => {
  const { event, userId, data } = req.body;

  try {
    const user = await User.findById(userId);
    if (user && user.socketId) {
      io.to(user!.socketId).emit(event, data);
    }

    return res.status(200).json({
      success: true
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false
    })
  }
})

const start = async () => {
  await connectDB();
  server.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
};
start();