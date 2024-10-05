import ContactUs from "@/components/shared/ContactUs";
import FeatureSection from "@/components/shared/FeatureSection";
import HeroSection from "@/components/shared/HeroSection";


export default function Home() {
  return (
    <div className="wrapper">
      <HeroSection />
      <FeatureSection />
      <ContactUs />
    </div>
  );
}
