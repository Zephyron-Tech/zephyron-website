import { getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';
import { NAV, SITE } from '@/content/site';
import { services } from '@/content/services';
import { Logo } from './ui/Logo';
import { CopyLink } from './CopyLink';

export async function Footer() {
  const t = await getTranslations('footer');
  const tn = await getTranslations('nav');

  const heading = 'text-sm font-medium text-white';
  const link = 'text-white/80 transition-colors hover:text-white';

  return (
    <footer className="bg-night text-white">
      <div className="container-page grid gap-12 py-16 md:grid-cols-[1.6fr_1fr_1fr]">
        <div className="max-w-xs">
          <Logo dark height={30} />
          <p className="mt-5 text-sm leading-relaxed text-white/60">{t('tagline')}</p>
          <CopyLink href={`mailto:${SITE.email}`} value={SITE.email} tone="dark" className={`mt-4 inline-block text-sm ${link}`}>
            {SITE.email}
          </CopyLink>
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

      </div>

      <div className="bg-night-2">
        <div className="container-page flex flex-col gap-3 py-6 text-[13px] text-white/50 sm:flex-row sm:items-center sm:justify-between">
          {/* Company details sit on one line here instead of stretching the contact column. */}
          <span>
            © {new Date().getFullYear()} {t('copyright')} · {SITE.address.street}, {SITE.address.zip}{' '}
            {SITE.address.city} · {t('ico')} {SITE.ico}
          </span>
          <div className="flex gap-5">
            <Link href="/ochrana-osobnich-udaju" className="hover:text-white">
              {t('privacy')}
            </Link>
            <Link href="/obchodni-podminky" className="hover:text-white">
              {t('terms')}
            </Link>
            <Link href="/zdroje-obrazku" className="hover:text-white">
              Zdroje obrázků
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
