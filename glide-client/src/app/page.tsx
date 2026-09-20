import { Suspense } from "react";
import Footer from "@/components/layout/Footer";
import HomePage from "@/components/home/HomePage";
import Navbar from "@/components/layout/Navbar";
import { auth } from "@/auth";
import PartnerDashboard from "@/components/Partner/PartnerDashboard";
import AdminDashboard from "@/components/Admin/AdminDashboard";
import GeoLocationUpdater from "@/components/GeoLocationUpdater";

// This is now a plain (non-async) component. Nothing in this outer
// shell depends on the session, so Next.js has no reason to Suspend
// it — Navbar, Footer, and the layout wrapper are always in the very
// first HTML flush, for crawlers, bots, and slow DB connections alike.
export default function Home() {
  return (
    <div className="w-full min-h-dvh bg-background">
      <Navbar />
      {/* Only THIS part waits on auth() — and its fallback is HomePage
          itself (your default/most-common case), not a full-screen
          spinner. Logged-out visitors and crawlers see real marketing
          content immediately; partners/admins see it swap to their
          dashboard a moment later. */}
      <Suspense fallback={<HomePage />}>
        <DashboardGate />
      </Suspense>
      <Footer />
    </div>
  );
}

// Small async Server Component: this is the ONLY part that suspends.
async function DashboardGate() {
  const session = await auth();
  const role = session?.user?.role;

  if (session?.user?.id) {
    // Fire-and-forget-ish: fine to keep here since it's scoped to the
    // authenticated case only, not the public marketing path.
    return (
      <>
        <GeoLocationUpdater userId={session.user.id} />
        {role === "partner" && <PartnerDashboard />}
        {role === "admin" && <AdminDashboard />}
        {(role === "user" || !role) && <HomePage />}
      </>
    );
  }

  return <HomePage />;
}