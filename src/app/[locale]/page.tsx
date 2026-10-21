import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { SITE } from '@/content/site';
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

export const metadata: Metadata = {
  alternates: { canonical: `${SITE.url}/` },
};

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale((await params).locale);

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: SITE.name,
          url: SITE.url,
          inLanguage: 'cs',
        }}
      />
      <JsonLd data={faqSchema(homeFaq)} />
      <Hero />
      <TrustStrip />
      <PainPoints />
      <Services />
      <Comparison />
      <Process num={4} />
      <CaseStudies />
      <StartupTeaser />
      <Team />
      <Faq items={homeFaq} num={8} />
      <FinalCta />
    </>
  );
}
