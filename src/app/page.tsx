import HeroSection from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import Featured from "@/components/home/Featured";
import Activity from "@/components/home/Activity";
import WhyChoose from "@/components/home/WhyChoose";
import CompactGuideStrip from "@/components/home/CompactGuideStrip";
export default function Home() {
  return (
    <main>
      <HeroSection />
      <HowItWorks />
      <Featured />
      <CompactGuideStrip/>
      <Activity />
      <WhyChoose />
    </main>
  );
}
