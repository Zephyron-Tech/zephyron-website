// Shared class strings for the cards admin. It lives outside the localised site,
// so it cannot use the site's next-intl Button and Link; these mirror them.

export const field =
  'mt-1.5 w-full rounded-xl border border-transparent bg-paper px-4 py-2.5 text-[15px] text-ink placeholder:text-muted/70 transition-[background-color,border-color] duration-150 focus:border-accent focus:bg-card focus:outline-none';
export const fieldErr = 'border-err! bg-card!';
export const label = 'block text-sm font-medium text-ink';

const btnBase =
  'inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[color,background-color,transform] duration-150 ease-[var(--ease-out)] active:scale-[0.97] disabled:cursor-default disabled:opacity-60 motion-reduce:active:scale-100';
export const btnPrimary = `${btnBase} bg-accent px-5 py-2.5 text-sm text-white hover:bg-accent-hover`;
export const btnSecondary = `${btnBase} bg-paper-2 px-5 py-2.5 text-sm text-ink hover:bg-line`;
export const btnDanger = `${btnBase} bg-err px-5 py-2.5 text-sm text-white hover:bg-err/90`;

export const card = 'rounded-2xl bg-card p-6';
