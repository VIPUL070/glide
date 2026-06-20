import Footer from "@/components/layout/Footer";
import HomePage from "@/components/home/HomePage";
import Navbar from "@/components/layout/Navbar";

export default function Home() {
  return (
    <div className="w-full min-h-dvh bg-background">
      <Navbar />
      <HomePage />
      <Footer />
    </div>
  );
}
