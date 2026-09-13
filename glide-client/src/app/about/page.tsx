import AboutHero from "@/components/About/AboutHero";
import AboutMission from "@/components/About/AboutMission";
import AboutSuccess from "@/components/About/AboutSuccess";
import AboutTestimonials from "@/components/About/AboutTestimonials";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export const metadata = {
  title: "About Us",
  description: "Learn about our mission, leadership, and verified vehicle booking fleet.",
};

export default function AboutPage() {
  return (
    <main className="w-full flex flex-col bg-foreground">
      <Navbar />
      <AboutHero />
      <AboutMission />
      <AboutSuccess />
      <AboutTestimonials />
      <Footer />
    </main>
  );
}