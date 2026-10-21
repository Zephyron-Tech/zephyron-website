export const TOPICS = ['automatizace', 'system', 'support', 'web', 'startup', 'jine'] as const;
export const COMPANY_SIZES = ['1-9', '10-49', '50-249', '250+', 'startup'] as const;

export type Topic = (typeof TOPICS)[number];
