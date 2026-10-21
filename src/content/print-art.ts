// Objects printed in one-colour ink (scripts/cutout.swift + scripts/retro-print.py).
// Sources are CC0 / public domain; credits are listed on /zdroje-obrazku.

export interface PrintArt {
  src: string;
  alt: string;
  width: number;
  height: number;
  title: string;
  credit: string;
  page: string;
}

export const printArt = {
  hourglass: {
    src: '/print/hourglass.png',
    alt: 'Přesýpací hodiny',
    width: 960,
    height: 2893,
    title: 'Přesýpací hodiny, 18. století',
    credit: 'The Metropolitan Museum of Art, public domain (CC0)',
    page: 'https://www.metmuseum.org/art/collection/search/202374',
  },
  typewriter: {
    src: '/print/typewriter.png',
    alt: 'Psací stroj',
    width: 960,
    height: 784,
    title: 'Psací stroj Woodstock, 40. léta',
    credit: 'Cbaile19, CC0, via Wikimedia Commons',
    page: 'https://commons.wikimedia.org/wiki/File:Woodstock_typewriter,_1940s,_daylight.jpg',
  },
  abacus: {
    src: '/print/abacus.png',
    alt: 'Dřevěné počítadlo',
    width: 960,
    height: 783,
    title: 'Dřevěné počítadlo, 20. století',
    credit: 'Deinodactyla, CC0, via Wikimedia Commons',
    page: 'https://commons.wikimedia.org/wiki/File:20th_Century_Small_Wooden_Abacus.jpg',
  },
  padlock: {
    src: '/print/padlock.png',
    alt: 'Visací zámek',
    width: 960,
    height: 1144,
    title: 'Visací zámek, 16. století',
    credit: 'The Metropolitan Museum of Art, public domain (CC0)',
    page: 'https://www.metmuseum.org/art/collection/search/463365',
  },
  radio: {
    src: '/print/radio.png',
    alt: 'Starý rozhlasový přijímač',
    width: 960,
    height: 600,
    title: 'Rozhlasový přijímač',
    credit: 'CC0, via rawpixel',
    page: 'https://www.rawpixel.com/image/6034731/antique-radio-free-public-domain-cc0-photo',
  },
  phone: {
    src: '/print/phone.png',
    alt: 'Telefon s otočným číselníkem',
    width: 960,
    height: 745,
    title: 'Telefon s otočným číselníkem',
    credit: 'CC0, via rawpixel',
    page: 'https://www.rawpixel.com/image/5923051/photo-image-phone-public-domain-gold',
  },
  key: {
    src: '/print/key.png',
    alt: 'Starý klíč',
    width: 960,
    height: 381,
    title: 'Starý klíč',
    credit: 'CC0, via rawpixel',
    page: 'https://www.rawpixel.com/image/6035969/old-key-free-public-domain-cc0-photo',
  },
  bulb: {
    src: '/print/bulb.png',
    alt: 'Žárovka Lewise Latimera z roku 1883',
    width: 960,
    height: 1966,
    title: 'Žárovka Lewise Latimera, 1883',
    credit: 'Daderot, CC0, via Wikimedia Commons',
    page: 'https://commons.wikimedia.org/w/index.php?curid=35074704',
  },
  bulbLight: {
    src: '/print/bulb-light.png',
    alt: 'Žárovka Lewise Latimera z roku 1883',
    width: 960,
    height: 1966,
    title: 'Žárovka Lewise Latimera, 1883',
    credit: 'Daderot, CC0, via Wikimedia Commons',
    page: 'https://commons.wikimedia.org/w/index.php?curid=35074704',
  },
} satisfies Record<string, PrintArt>;

export type PrintArtKey = keyof typeof printArt;
