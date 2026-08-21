import Razorpay from "razorpay";

const key_id = process.env.RAZORPAY_API_KEY;
const key_secret = process.env.RAZORPAY_API_SECRET;

if (!key_id || !key_secret) {
  throw new Error(
    "Razorpay initialization failed: RAZORPAY_API_KEY or RAZORPAY_API_SECRET is missing. " +
    "Check your .env.local file and restart the dev server."
  );
}

const razorpay = new Razorpay({ key_id, key_secret });

export default razorpay;