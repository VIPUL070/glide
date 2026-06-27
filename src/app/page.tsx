import Footer from "@/components/layout/Footer";
import HomePage from "@/components/home/HomePage";
import Navbar from "@/components/layout/Navbar";
import { auth } from "@/auth";
import PartnerDashboard from "@/components/Partner/PartnerDashboard";
import AdminDashboard from "@/components/Admin/AdminDashboard";

export default async function Home() {
  const session = await auth();
  return (
    <div className="w-full min-h-dvh bg-background">
      <Navbar />
      {session?.user?.role === "partner" ? (
        <PartnerDashboard />
      ) : session?.user?.role === "admin" ? (
        <AdminDashboard />
      ) : (
        <HomePage />
      )}
      <Footer />
    </div>
  );
}
