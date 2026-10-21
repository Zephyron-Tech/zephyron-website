export interface Person {
  name: string;
  role: string;
  bio: string;
  photo?: string;
  initials: string;
  email?: string;
  phone?: string;
  linkedin?: string;
}

// TODO(Jan): bio si každý doladí sám.
export const team: Person[] = [
  {
    name: 'Ing. Jan Vandlíček',
    role: 'Co-Founder & Tech Lead',
    bio: 'Vede projekty od prvního hovoru po spuštění a stará se o klienty. Na úvodní konzultaci budete nejspíš mluvit s ním.',
    photo: '/assets/vandlicek-pfp.jpg',
    initials: 'JV',
    email: 'jan.vandlicek@zephyron.tech',
    phone: '+420 722 635 417',
  },
  {
    name: 'Ing. Jan Rychlík',
    role: 'Co-Founder & SW Architekt',
    bio: 'Navrhuje architekturu systémů a hlídá, aby to, co postavíme, vydrželo roky provozu a další rozvoj.',
    photo: '/assets/rychlik-pfp.jpg',
    initials: 'JR',
    email: 'jan.rychlik@zephyron.tech',
    phone: '+420 734 687 713',
  },
];
