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
  // Footer list links: a block with its own padding, so links that wrap to two
// lines on a phone still keep a full hit area without crowding the next one.
  const link = 'block py-1 text-white/80 transition-colors hover:text-white pointer-coarse:py-3';

  return (
    <footer data-cta-zone className="bg-night text-white">
      {/* Phones: the two link lists sit side by side under the brand, not three tall stacks. */}
      <div className="container-page grid grid-cols-2 gap-x-6 gap-y-10 py-16 md:grid-cols-[1.6fr_1fr_1fr] md:gap-12">
        <div className="col-span-2 max-w-xs md:col-span-1">
          <Logo dark height={30} />
          <p className="mt-5 text-sm leading-relaxed text-white/60">{t('tagline')}</p>
          <CopyLink href={`mailto:${SITE.email}`} value={SITE.email} tone="dark" className={`mt-3 text-sm ${link}`}>
            {SITE.email}
          </CopyLink>
        </div>

        <div>
          <h2 className={heading}>{t('services')}</h2>
          <ul className="mt-3 text-sm">
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
          <ul className="mt-3 text-sm">
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
        <div className="container-page flex flex-col gap-3 pb-[max(24px,env(safe-area-inset-bottom))] pt-6 text-[13px] text-white/50 sm:flex-row sm:items-center sm:justify-between">
          {/* Company details sit on one line here instead of stretching the contact column. */}
          <span>
            © {new Date().getFullYear()} {t('copyright')} · {SITE.address.street}, {SITE.address.zip}{' '}
            {SITE.address.city} · {t('ico')} {SITE.ico}
          </span>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            <Link href="/ochrana-osobnich-udaju" className="tap hover:text-white">
              {t('privacy')}
            </Link>
            <Link href="/obchodni-podminky" className="tap hover:text-white">
              {t('terms')}
            </Link>
            <Link href="/zdroje-obrazku" className="tap hover:text-white">
              Zdroje obrázků
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
