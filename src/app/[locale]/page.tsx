import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Portfolio } from '@/components/Portfolio';
import { TechStack } from '@/components/TechStack';
import { ContactCTA } from '@/components/ContactCTA';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Portfolio />
        <TechStack />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
