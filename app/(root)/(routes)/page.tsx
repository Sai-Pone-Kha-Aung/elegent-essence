import HeroSection from "@/components/landing/HeroSection";
import FeaturedProducts from "@/components/landing/FeaturedProducts";
import PersonalizedSection from "@/components/recommender/PersonalizedSection";
import BrandValues from "@/components/landing/BrandValues";
import Testimonials from "@/components/landing/Testimonials";
import PartnerBrands from "@/components/landing/PartnerBrands";
import PhilosophySection from "@/components/landing/PhilosophySection";
import Newsletter from "@/components/landing/Newsletter";
import FooterCTA from "@/components/landing/FooterCTA";

export const metadata = {
  title: "Elegant Essence - Premium Artisanal Fragrances",
  description: "Discover handcrafted, premium olfactory blends that evoke deep emotion and memory.",
};

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="flex flex-col gap-24 pb-20">
      <HeroSection />

      {/* Recommender Cold-Start Onboarding & Personalized Shelf (Only visible for logged-in users) */}
      <PersonalizedSection />

      <FeaturedProducts />
      <BrandValues />
      <Testimonials />
      <PartnerBrands />
      <PhilosophySection />
      <Newsletter />
      <FooterCTA />
    </div>
  );
}

