import Hero from "@/components/Hero";
import Collections from "@/components/Collections";
import Manifesto from "@/components/Manifesto";
import Quality from "@/components/Quality";
import Reviews from "@/components/Reviews";
import Footer from "@/components/Footer";
import MarqueeTicker from "@/components/MarqueeTicker";

export default function Home() {
  return (
    <main className="bg-background min-h-screen text-foreground">
      <Hero />
      <MarqueeTicker />
      <Collections />
      <Manifesto />
      <Quality />
      <Reviews />
      <Footer />
    </main>
  );
}
