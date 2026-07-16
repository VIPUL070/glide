import express  from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server, Socket } from "socket.io";
dotenv.config();

const port = process.env.PORT || 5000;
const db_url = process.env.DB_URL;
const next_url = process.env.NEXT_BASE_URL;

export const connectDB = async () => {
  try {
    await mongoose.connect(`${db_url}`)
    console.log("DB Connected!")
  } catch (error) {
    console.log("Unable to connect to DB.")
  }
}

const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(cors({
    origin: [next_url!],
    credentials: true
}))

const io = new Server(server ,{
  cors: {
    origin: next_url!,
  }
})

io.on("connection" , (socket:Socket) => {

})

server.listen(port , () => {
    connectDB()
    console.log(`App listening on port ${port}`)
})