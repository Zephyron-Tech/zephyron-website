import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { homeFaq } from '@/content/faq';
import { Hero } from '@/components/home/Hero';
import { TrustStrip } from '@/components/home/TrustStrip';
import { PainPoints } from '@/components/home/PainPoints';
import { Services } from '@/components/home/Services';
import { Comparison } from '@/components/home/Comparison';
import { Process } from '@/components/Process';
import { CaseStudies } from '@/components/home/CaseStudies';
import { StartupTeaser } from '@/components/home/StartupTeaser';
import { Team } from '@/components/home/Team';
import { Faq } from '@/components/Faq';
import { FinalCta } from '@/components/FinalCta';
import { JsonLd } from '@/components/JsonLd';
import { faqSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Zephyron Tech: automatizace a interní systémy pro firmy',
  absoluteTitle: true,
  description:
    'Softwarové studio z Plzně. Automatizujeme ruční práci, stavíme interní systémy a staráme se o IT firmám, které přerostly Excel, ale nepotřebují ERP za miliony.',
  path: '/',
});

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale((await params).locale);

  return (
    <>
      <JsonLd data={faqSchema(homeFaq)} />
      <Hero />
      <TrustStrip />
      <PainPoints />
      <Services />
      <Comparison />
      <Process />
      <CaseStudies />
      <StartupTeaser />
      <Team />
      <Faq items={homeFaq} />
      <FinalCta />
    </>
  );
}
