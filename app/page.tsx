import { BootSequence } from "@/components/BootSequence";
import { SvgDefs } from "@/components/SvgDefs";
import { Cursor } from "@/components/Cursor";
import { HudHeader } from "@/components/HudHeader";
import { HeroSection } from "@/components/HeroSection";
import { ManifestoSection } from "@/components/ManifestoSection";
import { RouteSection } from "@/components/RouteSection";
import { XRaySection } from "@/components/XRaySection";
import { OrbitSection } from "@/components/OrbitSection";
import { DriveSection } from "@/components/DriveSection";
import { SectorsSection } from "@/components/SectorsSection";
import { TelemetrySection } from "@/components/TelemetrySection";
import { DeploySection } from "@/components/DeploySection";
import { Footer } from "@/components/Footer";
import { InteractionController } from "@/components/InteractionController";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://infinituderobotics.com/#organization",
      name: "Infinitude Robotics",
      url: "https://infinituderobotics.com",
      logo: "https://infinituderobotics.com/assets/logo.png",
      description:
        "Industrial autonomous mobile robotics and fleet orchestration systems.",
    },
    {
      "@type": "Product",
      "@id": "https://infinituderobotics.com/#nexus-m2",
      name: "NEXUS M2 Autonomous Mobile Robot",
      brand: {
        "@type": "Brand",
        name: "Infinitude Robotics",
      },
      manufacturer: {
        "@id": "https://infinituderobotics.com/#organization",
      },
      category: "Autonomous Mobile Robot (AMR)",
      image: [
        "https://infinituderobotics.com/assets/rear34.jpg",
        "https://infinituderobotics.com/assets/front.jpg",
        "https://infinituderobotics.com/assets/side.jpg",
      ],
      description:
        "NEXUS M2 by Infinitude Robotics. An autonomous mobile robot that sees in 360°, thinks in milliseconds and moves 1,000 kg payloads with natural-feature SLAM and ±5 mm docking accuracy.",
      additionalProperty: [
        { "@type": "PropertyValue", name: "Payload", value: "1,000 kg" },
        { "@type": "PropertyValue", name: "Top Speed", value: "2.0 m/s" },
        { "@type": "PropertyValue", name: "Runtime", value: "10 h" },
        {
          "@type": "PropertyValue",
          name: "Positioning Accuracy",
          value: "±5 mm",
        },
        {
          "@type": "PropertyValue",
          name: "Perception",
          value: "360° Safety LiDAR + 3D Depth Fusion",
        },
        {
          "@type": "PropertyValue",
          name: "Footprint",
          value: "1200 × 800 × 280 mm",
        },
        {
          "@type": "PropertyValue",
          name: "Fast Charge",
          value: "0 to 80% in 45 min",
        },
        {
          "@type": "PropertyValue",
          name: "Safety Rating",
          value: "ISO 3691-4 PL-d",
        },
      ],
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <BootSequence />
      <SvgDefs />
      <Cursor />
      <HudHeader />
      <div
        className="grain fixed -inset-1/2 z-[90] pointer-events-none opacity-[0.06]"
        aria-hidden="true"
      ></div>

      <main>
        <HeroSection />
        <ManifestoSection />
        <RouteSection />
        <XRaySection />
        <OrbitSection />
        <DriveSection />
        <SectorsSection />
        <TelemetrySection />
        <DeploySection />
      </main>

      <Footer />
      <InteractionController />
    </>
  );
}
