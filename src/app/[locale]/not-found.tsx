import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  const t = useTranslations('notFound');
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-start justify-center py-24">
      <div className="font-mono text-sm text-muted">404</div>
      <h1 className="mt-4 text-4xl text-ink sm:text-6xl">{t('title')}</h1>
      <p className="mt-5 text-lg text-ink-2">{t('body')}</p>
      <div className="mt-9">
        <Button href="/" arrow>
          {t('back')}
        </Button>
      </div>
    </section>
  );
}
