/**
 * Copy for the certifications spotlight, taken from "Certifications Spotlight Interactive".
 * Names, issuers, dates and verify links come from `badges` in site.ts; this adds what the
 * spotlight shows besides them. Order is the design's.
 */
export const SPOT_ORDER = ['aws-ai', 'aws-cloud', 'ds', 'it-specialist', 'mos', 'cisco'] as const;

export const SPOTLIGHT: Record<string, { area: string; level: string; what: string; glow: string }> = {
  'aws-ai': {
    area: 'CLOUD', level: 'FOUNDATIONAL', glow: 'rgba(255, 153, 0, 0.16)',
    what: 'Foundational knowledge of AI, machine learning and generative AI concepts and the AWS services that deliver them.',
  },
  'aws-cloud': {
    area: 'CLOUD', level: 'TRAINED', glow: 'rgba(255, 153, 0, 0.14)',
    what: 'Core cloud concepts, the AWS global infrastructure, core services, security, pricing and support.',
  },
  ds: {
    area: 'DATA', level: 'DIGITAL CREDENTIAL', glow: 'rgba(60, 130, 255, 0.16)',
    what: 'An orientation to data science: its tools, its workflow and the roles involved.',
  },
  'it-specialist': {
    area: 'DATA', level: 'SPECIALIST', glow: 'rgba(80, 160, 200, 0.16)',
    what: 'Collecting, preparing, analysing and presenting data to answer questions.',
  },
  mos: {
    area: 'PRODUCTIVITY', level: 'SPECIALIST', glow: 'rgba(40, 160, 90, 0.16)',
    what: 'Applied skills in Microsoft Office tools, shown here on Excel.',
  },
  cisco: {
    area: 'NETWORKING', level: 'VERIFIED', glow: 'rgba(110, 190, 60, 0.16)',
    what: 'Threats, attacks and the basics of keeping networks and personal data secure.',
  },
};
