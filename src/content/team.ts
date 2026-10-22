export interface Person {
  name: string;
  role: string;
  bio: string;
  photo?: string;
  initials: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  /** Slug of the person's digital business card, served at /v/:slug. */
  card?: string;
  /** What to bring to this person, three short items. */
  focus: string[];
}

// TODO(Jan): bio si každý doladí sám.
export const team: Person[] = [
  {
    name: 'Ing. Jan Vandlíček',
    role: 'Co-Founder & Tech Lead',
    bio: 'Vede projekty od prvního hovoru po spuštění a stará se o klienty. Na úvodní konzultaci budete nejspíš mluvit s ním.',
    photo: '/assets/vandlicek-pfp.jpg',
    card: 'vandl',
    initials: 'JV',
    email: 'jan.vandlicek@zephyron.tech',
    phone: '+420 722 635 417',
    focus: ['Rozsah a cena projektu', 'Termíny a průběh etap', 'Provoz po spuštění'],
  },
  {
    name: 'Ing. Jan Rychlík',
    role: 'Co-Founder & SW Architekt',
    bio: 'Navrhuje architekturu systémů a hlídá, aby to, co postavíme, vydrželo roky provozu a další rozvoj.',
    photo: '/assets/rychlik-pfp.jpg',
    card: 'rychlik',
    initials: 'JR',
    email: 'jan.rychlik@zephyron.tech',
    phone: '+420 734 687 713',
    focus: ['Architektura a technologie', 'Napojení na vaše systémy', 'Bezpečnost a výkon'],
  },
];
