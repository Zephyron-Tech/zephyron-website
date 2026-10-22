import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { SITE } from '@/content/site';
import { LegalPage } from '@/components/LegalPage';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Ochrana osobních údajů',
  description: 'Jak Zephyron Tech s.r.o. zpracovává osobní údaje z kontaktního formuláře a webu, na jak dlouho je uchovává a jaká máte práva podle GDPR.',
  path: '/ochrana-osobnich-udaju',
});

const sections = [
  {
    heading: 'Správce',
    body: `${SITE.legalName}, IČO ${SITE.ico}, ${SITE.address.street}, ${SITE.address.zip} ${SITE.address.city}. Kontakt: ${SITE.email}.`,
  },
  {
    heading: 'Jaké údaje zpracováváme',
    body: 'Když nám napíšete přes formulář nebo e-mailem, zpracováváme jméno, e-mail, případně telefon, název a velikost firmy a obsah zprávy. Když si rezervujete konzultaci, zpracováváme údaje zadané v rezervačním systému Cal.com.',
  },
  {
    heading: 'Proč je zpracováváme',
    body: 'Jen abychom vám mohli odpovědět a připravit případnou nabídku. Právní základ: čl. 6 odst. 1 písm. b) GDPR (jednání před uzavřením smlouvy) a čl. 6 odst. 1 písm. f) GDPR (oprávněný zájem odpovídat na obchodní dotazy).',
  },
  {
    heading: 'Zpracovatelé',
    body: 'E-maily z formuláře doručuje služba Resend. Rezervace konzultací zajišťuje Cal.com. Web běží na platformě Vercel.',
  },
  {
    heading: 'Cookies a měření návštěvnosti',
    body: 'Web nepoužívá reklamní ani sledovací cookies. Návštěvnost měříme nástrojem Vercel Web Analytics, který pracuje bez cookies a s anonymizovanými, souhrnnými daty.',
  },
  {
    heading: 'Jak dlouho údaje uchováváme',
    body: 'Údaje z poptávek uchováváme nejdéle 2 roky od posledního kontaktu, nebo dokud nás nepožádáte o výmaz.',
  },
  {
    heading: 'Vaše práva',
    body: `Máte právo na přístup k údajům, jejich opravu, výmaz, omezení zpracování a přenositelnost a právo vznést námitku. Žádost pošlete na ${SITE.email}, odpovíme do 30 dnů.`,
  },
  {
    heading: 'Dozorový úřad',
    body: 'Stížnost můžete podat u Úřadu pro ochranu osobních údajů (uoou.gov.cz).',
  },
];

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale((await params).locale);
  return <LegalPage title="Ochrana osobních údajů" updated="Aktualizováno: říjen 2026" sections={sections} />;
}
