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
  /** A second source, when the picture is put together from two photos. */
  page2?: { label: string; href: string };
}

export const printArt = {
  hourglass: {
    src: '/print/hourglass.png',
    alt: 'Přesýpací hodiny',
    width: 700,
    height: 1562,
    title: 'Dřevěné přesýpací hodiny',
    credit: 'S Sepp, CC BY-SA 3.0, via Wikimedia Commons (upraveno, sdíleno pod stejnou licencí)',
    page: 'https://commons.wikimedia.org/wiki/File:Wooden_hourglass_3.jpg',
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
  macintosh: {
    src: '/print/macintosh.png',
    alt: 'Počítač Apple Macintosh 128K z roku 1984',
    width: 960,
    height: 1394,
    title: 'Apple Macintosh 128K, 1984 (Apple Museum, Praha)',
    credit: 'Benoît Prieur, CC0, via Wikimedia Commons',
    page: 'https://commons.wikimedia.org/wiki/File:Apple_Museum_(Prague)_Macintosh_128K_(1984)_-_1.jpg',
  },
  draftingTools: {
    src: '/print/drafting-tools.png',
    alt: 'Kružítko a trojúhelník',
    width: 916,
    height: 849,
    title: 'Kružítko a trojúhelník',
    credit: 'Trojúhelník: Auckland War Memorial Museum, CC BY 4.0; kružítko: CC BY-SA 3.0; obojí via Wikimedia Commons, upraveno',
    page: 'https://commons.wikimedia.org/wiki/File:Set-square_(AM_2015.34.65-2).jpg',
    page2: { label: 'Zdroj kružítka', href: 'https://commons.wikimedia.org/wiki/File:Cyrkiel_RB1.jpg' },
  },
  lifebuoy: {
    src: '/print/lifebuoy.png',
    alt: 'Záchranný kruh',
    width: 800,
    height: 788,
    title: 'Záchranný kruh',
    credit: 'CC0, via rawpixel',
    page: 'https://www.rawpixel.com/image/5924284/photo-image-public-domain-vintage-wall',
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
  wrench: {
    src: '/print/wrench.png',
    alt: 'Starý francouzský klíč',
    width: 900,
    height: 1228,
    title: 'Francouzský klíč, Mexiko, kolem roku 1900',
    credit: 'Cvmontuy, CC BY 4.0, via Wikimedia Commons (upraveno)',
    page: 'https://commons.wikimedia.org/wiki/File:Monkey_wrench_Mexico_1900.jpg',
  },
  bulb: {
    src: '/print/bulb.png',
    alt: 'Žárovka',
    width: 700,
    height: 1163,
    title: 'Žárovka',
    credit: 'KMJ, CC BY-SA 3.0, via Wikimedia Commons (upraveno, sdíleno pod stejnou licencí)',
    page: 'https://commons.wikimedia.org/wiki/File:Gluehlampe_01_KMJ.jpg',
  },
  bulbLight: {
    src: '/print/bulb-light.png',
    alt: 'Žárovka',
    width: 700,
    height: 1163,
    title: 'Žárovka',
    credit: 'KMJ, CC BY-SA 3.0, via Wikimedia Commons (upraveno, sdíleno pod stejnou licencí)',
    page: 'https://commons.wikimedia.org/wiki/File:Gluehlampe_01_KMJ.jpg',
  },
} satisfies Record<string, PrintArt>;

export type PrintArtKey = keyof typeof printArt;
