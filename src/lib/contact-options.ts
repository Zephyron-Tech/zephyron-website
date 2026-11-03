export const TOPICS = ['automatizace', 'system', 'support', 'web', 'startup', 'jine'] as const;
export const COMPANY_SIZES = ['1-9', '10-49', '50-249', '250+', 'startup'] as const;

export type Topic = (typeof TOPICS)[number];

/** How each topic reads in the enquiry e-mail and in the admin. */
export const TOPIC_LABELS: Record<Topic, string> = {
  automatizace: 'Automatizace procesů',
  system: 'Interní systém / aplikace',
  support: 'IT podpora a správa',
  web: 'Web / webová aplikace',
  startup: 'Startup Support',
  jine: 'Jiné',
};
