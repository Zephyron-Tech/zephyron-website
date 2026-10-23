export const SITE = {
  url: 'https://zephyron.tech',
  name: 'Zephyron Tech',
  legalName: 'Zephyron Tech s.r.o.',
  email: 'hello@zephyron.tech',
  phone: '+420 722 635 417',
  ico: '23793538',
  address: {
    street: 'Čermákova 2587/60',
    district: 'Jižní Předměstí',
    zip: '301 00',
    city: 'Plzeň',
  },
  // Public profiles that belong to the company (LinkedIn, Firmy.cz, GitHub...).
  // Feeds `sameAs` in the Organization schema; add URLs once the profiles exist.
  sameAs: [
    'https://www.firmy.cz/neoverena-firma/113896444-zephyron-tech-plzen.html',
    'https://github.com/Zephyron-Tech',
    'https://www.linkedin.com/company/zephyron-tech',
  ] as string[],
  // Cal.com event slug, e.g. "zephyron/konzultace". Without it the contact
  // page falls back to the form only.
  calLink: process.env.NEXT_PUBLIC_CAL_LINK ?? '',
} as const;

export const NAV = [
  { href: '/sluzby', key: 'services' },
  { href: '/reference', key: 'cases' },
  { href: '/startup-support', key: 'startup' },
  { href: '/o-nas', key: 'about' },
] as const;
