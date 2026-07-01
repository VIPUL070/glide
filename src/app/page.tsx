import Footer from "@/components/layout/Footer";
import HomePage from "@/components/home/HomePage";
import Navbar from "@/components/layout/Navbar";
import { auth } from "@/auth";
import PartnerDashboard from "@/components/Partner/PartnerDashboard";
import AdminDashboard from "@/components/Admin/AdminDashboard";

export default async function Home() {
  const session = await auth();
  const role = session?.user?.role;

  const renderDashboard = () => {
    switch (role) {
      case "partner":
        return <PartnerDashboard />;
      case "admin":
        return <AdminDashboard />;
      case "user":
        return <HomePage />;
      default:
        return <HomePage />;
    }
  };
  return (
    <div className="w-full min-h-dvh bg-background">
      <Navbar />
      {renderDashboard()}
      <Footer />
    </div>
  );
}
