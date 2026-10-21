import { getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';
import { NAV, SITE } from '@/content/site';
import { services } from '@/content/services';
import { Logo } from './ui/Logo';

export async function Footer() {
  const t = await getTranslations('footer');
  const tn = await getTranslations('nav');

  const heading = 'font-mono text-xs uppercase tracking-[0.12em] text-white/50';
  const link = 'text-white/80 transition-colors hover:text-white';

  return (
    <footer className="bg-night text-white">
      <div className="container-page grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-xs">
          <Logo dark height={30} />
          <p className="mt-5 text-sm leading-relaxed text-white/60">{t('tagline')}</p>
        </div>

        <div>
          <h2 className={heading}>{t('services')}</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/sluzby/${s.slug}`} className={link}>
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className={heading}>{t('company')}</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV.filter((n) => n.href !== '/sluzby').map((n) => (
              <li key={n.href}>
                <Link href={n.href} className={link}>
                  {tn(n.key)}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/kontakt" className={link}>
                {tn('contact')}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className={heading}>{tn('contact')}</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a href={`mailto:${SITE.email}`} className={link}>
                {SITE.email}
              </a>
            </li>
            <li>
              <a href={`tel:${SITE.phone.replace(/\s/g, '')}`} className={link}>
                {SITE.phone}
              </a>
            </li>
            <li className="pt-2 text-white/60">
              {SITE.legalName}
              <br />
              {SITE.address.street}
              <br />
              {SITE.address.zip} {SITE.address.city}
              <br />
              {t('ico')} {SITE.ico}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-night-line">
        <div className="container-page flex flex-col gap-3 py-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {t('copyright')}
          </span>
          <div className="flex gap-5">
            <Link href="/ochrana-osobnich-udaju" className="hover:text-white">
              {t('privacy')}
            </Link>
            <Link href="/obchodni-podminky" className="hover:text-white">
              {t('terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
