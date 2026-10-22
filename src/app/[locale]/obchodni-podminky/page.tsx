import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { SITE } from '@/content/site';
import { LegalPage } from '@/components/LegalPage';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Obchodní podmínky',
  description: 'Podmínky používání webu Zephyron Tech s.r.o.: obsah webu, autorská práva, odkazy na jiné weby a kontakt pro dotazy.',
  path: '/obchodni-podminky',
});

const sections = [
  {
    heading: 'Provozovatel',
    body: `Web provozuje ${SITE.legalName}, IČO ${SITE.ico}, ${SITE.address.street}, ${SITE.address.zip} ${SITE.address.city}.`,
  },
  {
    heading: 'Používání webu',
    body: 'Web slouží k informačním účelům. Snažíme se, aby byl obsah přesný a aktuální, ale neručíme za jeho úplnost ani vhodnost pro konkrétní účel.',
  },
  {
    heading: 'Duševní vlastnictví',
    body: `Veškerý obsah webu, včetně textů, grafiky, loga a kódu, je majetkem ${SITE.legalName} a bez předchozího písemného souhlasu jej nelze šířit.`,
  },
  {
    heading: 'Poptávky',
    body: 'Odeslání formuláře, e-mailu nebo rezervace konzultace je poptávka, nikoliv závazná objednávka. Spolupráce se vždy řídí samostatnou písemnou smlouvou.',
  },
  {
    heading: 'Odpovědnost',
    body: `V rozsahu, který připouští právní předpisy, neodpovídá ${SITE.legalName} za nepřímé nebo následné škody vzniklé používáním webu.`,
  },
  {
    heading: 'Rozhodné právo',
    body: 'Tyto podmínky se řídí právem České republiky. Případné spory řeší příslušné české soudy.',
  },
  {
    heading: 'Kontakt',
    body: SITE.email,
  },
];

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale((await params).locale);
  return <LegalPage title="Obchodní podmínky" updated="Aktualizováno: říjen 2026" sections={sections} />;
}
