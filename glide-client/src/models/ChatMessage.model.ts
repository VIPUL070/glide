import mongoose from "mongoose";

export interface IChatMessageProps {
    bookingId: mongoose.Schema.Types.ObjectId;
    sender: string;
    text: string;
}

const chatMessageSchema = new mongoose.Schema<IChatMessageProps>({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: true,
    },
    sender: {
        type: String,
        enum: ["user", "driver"],
        required: true,
    },
    text: {
        type: String,
        required: true,
    }

}, { timestamps: true })

const ChatMessage = mongoose.models.ChatMessage || mongoose.model("ChatMessage", chatMessageSchema);
export default ChatMessage;