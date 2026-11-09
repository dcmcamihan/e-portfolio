// All copy here is sourced from 2_Amihan_Resume.pdf, the project manuscripts in
// "for claude/featured projects", and the Credly links on the previous site.

export const profile = {
  name: 'Dianna Claire Marie Amihan',
  first: 'Dianna Claire',
  last: 'Marie Amihan',
  mark: 'DCMA.',
  email: 'diannaclairemarie.amihan@gmail.com',
  github: 'https://github.com/dcmcamihan',
  linkedin: 'https://www.linkedin.com/in/dianna-claire-marie-amihan-29ab23293',
  credly: 'https://www.credly.com/users/dianna-claire-marie-amihan',
  location: 'Davao City',
  coords: '7.07°N 125.61°E',
  timezone: 'Asia/Manila',
  roles: ['front-end developer', 'full-stack developer', 'AI integrations', 'UI/UX design'],
  summary:
    'Front-end and full-stack developer building responsive, accessible web applications with React, TypeScript, Node.js and FastAPI, with research experience in applied machine learning.',
  languages: ['English', 'Filipino', 'Cebuano'],
};

export const services = [
  {
    id: 'web',
    title: 'Websites and landing pages',
    body: 'Responsive, accessible sites built with React, TypeScript and Tailwind CSS, from layout to deployment.',
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
  },
  {
    id: 'apps',
    title: 'Web apps and dashboards',
    body: 'Full-stack tools with real data behind them: point of sale, inventory, reporting and admin panels.',
    stack: ['React', 'Node.js', 'FastAPI', 'MySQL'],
  },
  {
    id: 'ai',
    title: 'AI integrations',
    body: 'Connecting language and vision models to a working product, with the API, evaluation and deployment around them.',
    stack: ['Python', 'Gemini API', 'PyTorch', 'AWS'],
  },
  {
    id: 'ux',
    title: 'UI/UX design',
    body: 'User flows, wireframes and high-fidelity prototypes in Figma, grounded in HCI coursework and usability testing.',
    stack: ['Figma', 'User flows', 'Prototyping', 'Usability'],
  },
];

export const skills = {
  'Front-end': ['React', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Responsive web design'],
  'Back-end and data': ['Node.js', 'FastAPI', 'Python', 'SQL', 'MySQL'],
  'Tools': ['Git / GitHub', 'AWS', 'Figma', 'Canva', 'Google Colab'],
  'Knowledge areas': ['Software development', 'Artificial intelligence', 'Machine learning', 'Data science and analytics', 'UI/UX design'],
};

export type Commit = {
  hash: string;
  type: 'init' | 'feat' | 'fix' | 'HEAD';
  message: string;
  where: string;
  when: string;
  notes: string[];
  head?: boolean;
};

// Commit history, oldest first. Hashes are decorative.
export const journey: Commit[] = [
  {
    hash: 'a1c03d2',
    type: 'init',
    message: 'STEM strand',
    where: 'Davao City National High School (DCNHS)',
    when: 'Completed July 2023',
    notes: [
      'Consistent honor student',
      '2nd place, Best Research — Cluster I Research Congress, 2023',
      'Award for Outstanding Performance in Innovation, July 2023',
    ],
  },
  {
    hash: 'b7e41f0',
    type: 'feat',
    message: 'BS Computer Science',
    where: 'Mapúa Malayan Colleges of Mindanao (MMCM)',
    when: 'Aug 2023 – present',
    notes: [
      "President's Lister — Term 2 2024–2025, Term 2 2025–2026, Term 3 2025–2026",
      "Dean's Lister, 2023–2026",
      'Thesis: ChatSafe, a translate-then-classify cyberbullying detection pipeline',
    ],
  },
  {
    hash: 'c94a0be',
    type: 'feat',
    message: 'Research published and accepted',
    where: 'ICSTE 2025 (Springer LNEE) · CCCIS 2026',
    when: '2025 – 2026',
    notes: ['SeGlo-12 paper accepted at ICSTE 2025', 'Three ChatSafe papers accepted at CCCIS 2026'],
  },
  {
    hash: 'd20f5c7',
    type: 'feat',
    message: 'Desktop Support Intern, IT Department',
    where: 'ANFLO Management and Investment Corporation (ANFLOCOR)',
    when: 'Aug – Oct 2026',
    notes: [
      'Set up workstations and installed and configured software for staff across departments',
      'Diagnosed hardware, software, printer and connectivity issues; escalated when needed',
      'Kept equipment inventory records and asset documentation current',
    ],
  },
  {
    hash: 'e5b8a19',
    type: 'HEAD',
    message: 'Open for freelance and full-time work',
    where: 'Davao City · remote',
    when: 'Now',
    notes: ['Websites, web apps and dashboards, AI integrations, UI/UX design'],
    head: true,
  },
];

export type Badge = {
  id: string;
  name: string;
  issuer: string;
  date: string;
  img: string;
  verify: string;
};

export const badges: Badge[] = [
  { id: 'aws-ai', name: 'AWS Certified AI Practitioner', issuer: 'Amazon Web Services', date: 'May 2026', img: 'badges/aws-certified-ai-practitioner.png', verify: 'https://www.credly.com/badges/9304d89b-2003-441f-bb92-4d98bfac9a69/public_url' },
  { id: 'it-specialist', name: 'IT Specialist — Data Analytics', issuer: 'Certiport / Pearson VUE', date: 'Oct 2025', img: 'badges/it-specialist-data-analytics.png', verify: 'https://www.credly.com/badges/c6b162ec-c12e-4f9f-8766-920113a2da02/public_url' },
  { id: 'mos', name: 'Microsoft Office Specialist: Excel Associate', issuer: 'Microsoft', date: 'Sep 2023', img: 'badges/microsoft-office-specialist-excel-associate-office-2019.png', verify: 'https://www.credly.com/badges/2bf0c71f-9631-4c9d-be2f-04580e31c951/public_url' },
  { id: 'aws-genai', name: 'AWS Academy Graduate — Generative AI Foundations', issuer: 'Amazon Web Services', date: 'Jan 2026', img: 'badges/aws-academy-graduate-generative-ai-foundations-trai.png', verify: 'https://www.credly.com/badges/bdc8b3cd-041f-46ba-8eaf-860282f8f206/public_url' },
  { id: 'aws-cloud', name: 'AWS Academy Graduate — Cloud Foundations', issuer: 'Amazon Web Services', date: 'Oct 2025', img: 'badges/aws-academy-graduate-cloud-foundations-training-bad.png', verify: 'https://www.credly.com/badges/2e9a37f4-ff31-49de-a867-b7f0d8c0d389/public_url' },
  { id: 'aws-arch', name: 'AWS Academy Graduate — Cloud Architecting', issuer: 'Amazon Web Services', date: 'May 2026', img: 'badges/aws-academy-graduate-cloud-architecting-training-ba.png', verify: 'https://www.credly.com/badges/b6272527-99dc-4cff-a8fa-2168cd19ee18/public_url' },
  // TODO: add the earned date for Data Science Orientation (not on the resume).
  { id: 'ds', name: 'Data Science Orientation', issuer: 'IBM (via Coursera)', date: '', img: 'badges/data-science-orientation.png', verify: 'https://www.credly.com/badges/10b09b74-8149-4701-89f9-e046db2ab2cf/public_url' },
  { id: 'cisco', name: 'Introduction to Cybersecurity', issuer: 'Cisco Networking Academy', date: 'Feb 2026', img: 'badges/introduction-to-cybersecurity.png', verify: 'https://www.credly.com/badges/b1fcd339-b65b-456a-a777-54eb6ad5612f/public_url' },
];

export const hciCourses = [
  { org: 'Google', when: 'July 2025', title: 'Foundations of User Experience (UX) Design', img: 'img/google-ux-foundations.webp', pdf: 'docs/hci/Course_1.pdf' },
  { org: 'Google', when: 'July 2025', title: 'Start the UX Design Process: Empathize, Define, and Ideate', img: 'img/google-ux-process.webp', pdf: 'docs/hci/Course_2.pdf' },
  { org: 'Google', when: 'July 2025', title: 'Build Wireframes and Low-Fidelity Prototypes', img: 'img/google-ux-wireframes.webp', pdf: 'docs/hci/Course_3.pdf' },
  { org: 'Google', when: 'July 2025', title: 'Conduct UX Research and Test Early Concepts', img: 'img/google-ux-research.webp', pdf: 'docs/hci/Course_4.pdf' },
  { org: 'Google', when: 'July 2025', title: 'Create High-Fidelity Designs and Prototypes in Figma', img: 'img/google-ux-figma.webp', pdf: 'docs/hci/Course_5.pdf' },
  { org: 'UC San Diego', when: 'May 2025', title: 'Input and Interaction', img: 'img/ucsd-input-interaction.webp', pdf: 'docs/hci/ucsd-input-interaction.pdf' },
  { org: 'Georgia Tech', when: 'May 2025', title: 'Introduction to User Experience Design', img: 'img/gatech-ux-design.webp', pdf: 'docs/hci/gatech-intro-ux.pdf' },
];

export type Publication = {
  id: string;
  title: string;
  venue: string;
  year: string;
  status: string;
  authors: string;
  project?: string;
};

export const publications: Publication[] = [
  {
    id: 'BS1035',
    title: 'Benchmarking Five Classification Models for a Translate-then-Classify Cyberbullying Detection Pipeline in Code-Mixed Filipino-Bisaya-English Text',
    venue: '6th International Conference on Computer Communication and Information Systems (CCCIS 2026)',
    year: '2026',
    status: 'Accepted',
    authors: 'Amihan, D. C. M. C., et al.',
    project: 'chatsafe',
  },
  {
    id: 'BS1036',
    title: 'ChatSafe: End-to-End Evaluation and Translation-Layer Ablation of a Translate-then-Classify Cyberbullying Detection Pipeline',
    venue: '6th International Conference on Computer Communication and Information Systems (CCCIS 2026)',
    year: '2026',
    status: 'Accepted',
    authors: 'Amihan, D. C. M. C., et al.',
    project: 'chatsafe',
  },
  {
    id: 'BS1037',
    title: 'Psychological Validation for a Translate-Then-Classify Pipeline for Cyberbullying Detection in Code-Mixed Filipino-Bisaya-English Text',
    venue: '6th International Conference on Computer Communication and Information Systems (CCCIS 2026)',
    year: '2026',
    status: 'Accepted',
    authors: 'Amihan, D. C. M. C., et al.',
    project: 'chatsafe',
  },
  {
    id: 'NT1009',
    title: 'SeGlo-12: A Multimodal Glove Integrating Flex Sensors and Computer Vision for Sign-to-Speech Translation',
    venue: 'International Conference on Science and Technology Engineering (ICSTE 2025), Springer LNEE',
    year: '2025',
    status: 'Accepted',
    authors: 'Cerna, P. D., Lungay, C. R. A., Amihan, D. C. M. C., Alalim, H. V. D., Lisondra, C. B.',
    project: 'seglo-12',
  },
  {
    id: 'THESIS',
    title: 'ChatSafe: A Translate-Then-Classify Pipeline for Cyberbullying Detection in Code-Mixed Filipino-Bisaya-English Text',
    venue: 'Undergraduate thesis, Mapúa Malayan Colleges Mindanao',
    year: '2026',
    status: 'Approved, June 2026',
    authors: 'Amihan, D. C. M. C., Alovera, J. L. S., Monteverde, I. M. C.',
    project: 'chatsafe',
  },
  {
    id: 'AID',
    title: 'Advancing AI Image Forensics: Machine Learning Approaches for Detecting Real and AI-Generated Images Using Multi-Source Unstructured Image Datasets',
    venue: 'Course manuscript, Mapúa Malayan Colleges Mindanao',
    year: '', // TODO: confirm the year of the AI image detection manuscript
    status: 'Manuscript',
    authors: 'Amihan, D. C. M. C., Monteverde, I. M. C., Yncierto, J. H. R.',
    project: 'ai-image-detector',
  },
];
