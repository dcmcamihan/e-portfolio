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
  // ③ word list, taken from the four services
  roles: ['web apps', 'dashboards', 'AI tools', 'landing pages', 'interfaces'],
  whoami: 'Computer Science student who builds responsive, accessible interfaces and the backends behind them.',
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
  ref: string;
  title: string;
  where: string;
  when: string;
  body: string;
  notes: string[];
  head?: boolean;
};

// Design System §07 / wireframe 2g: three commits, drawn oldest to newest (storyboard ⑬).
export const journey: Commit[] = [
  {
    ref: 'init',
    title: 'init: STEM strand, DCNHS',
    where: 'Davao City National High School',
    when: '–2023',
    body: 'Science, Technology, Engineering and Mathematics strand, completed July 2023.',
    notes: [
      'Consistent honor student',
      '2nd place, Best Research — Cluster I Research Congress, 2023',
      'Award for Outstanding Performance in Innovation, July 2023',
    ],
  },
  {
    ref: 'merge: cs',
    title: 'feat: BS Computer Science, MMCM',
    where: 'Mapúa Malayan Colleges of Mindanao',
    when: '2023–',
    body: "ChatSafe, AI Image Detector, Jolen's Bicycle Supply, SeGlo-12.",
    notes: [
      "President's Lister — Term 2 2024–25, Term 2 2025–26, Term 3 2025–26",
      "Dean's Lister, 2023–2026",
      'SeGlo-12 accepted at ICSTE 2025; three ChatSafe papers accepted at CCCIS 2026',
    ],
  },
  {
    ref: 'HEAD → main · 2026',
    title: 'release: IT Intern, ANFLOCOR · freelance',
    where: 'ANFLO Management and Investment Corporation · Davao City',
    when: 'Aug–Oct 2026 · now',
    body: 'Front-end / full-stack work for clients: websites, web apps, AI integrations, UI/UX.',
    notes: [
      'Desktop Support Intern, IT Department: workstation setup, software installs, printer and connectivity fixes, equipment inventory',
      'Open for freelance projects and full-time roles',
    ],
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
  /** One of the six stickers (Design System §08 / wireframe 2h). */
  featured?: boolean;
};

export const badges: Badge[] = [
  { id: 'aws-ai', featured: true, name: 'AWS Certified AI Practitioner', issuer: 'Amazon Web Services', date: 'May 2026', img: 'badges/aws-certified-ai-practitioner.png', verify: 'https://www.credly.com/badges/9304d89b-2003-441f-bb92-4d98bfac9a69/public_url' },
  { id: 'it-specialist', featured: true, name: 'IT Specialist — Data Analytics', issuer: 'Certiport / Pearson VUE', date: 'Oct 2025', img: 'badges/it-specialist-data-analytics.png', verify: 'https://www.credly.com/badges/c6b162ec-c12e-4f9f-8766-920113a2da02/public_url' },
  { id: 'mos', featured: true, name: 'Microsoft Office Specialist: Excel Associate', issuer: 'Microsoft', date: 'Sep 2023', img: 'badges/microsoft-office-specialist-excel-associate-office-2019.png', verify: 'https://www.credly.com/badges/2bf0c71f-9631-4c9d-be2f-04580e31c951/public_url' },
  { id: 'aws-genai', name: 'AWS Academy Graduate — Generative AI Foundations', issuer: 'Amazon Web Services', date: 'Jan 2026', img: 'badges/aws-academy-graduate-generative-ai-foundations-trai.png', verify: 'https://www.credly.com/badges/bdc8b3cd-041f-46ba-8eaf-860282f8f206/public_url' },
  { id: 'aws-cloud', featured: true, name: 'AWS Academy Graduate — Cloud Foundations', issuer: 'Amazon Web Services', date: 'Oct 2025', img: 'badges/aws-academy-graduate-cloud-foundations-training-bad.png', verify: 'https://www.credly.com/badges/2e9a37f4-ff31-49de-a867-b7f0d8c0d389/public_url' },
  { id: 'aws-arch', name: 'AWS Academy Graduate — Cloud Architecting', issuer: 'Amazon Web Services', date: 'May 2026', img: 'badges/aws-academy-graduate-cloud-architecting-training-ba.png', verify: 'https://www.credly.com/badges/b6272527-99dc-4cff-a8fa-2168cd19ee18/public_url' },
  { id: 'ds', featured: true, name: 'Data Science Orientation', issuer: 'IBM (via Coursera)', date: 'Jun 2025', img: 'badges/data-science-orientation.png', verify: 'https://www.credly.com/badges/10b09b74-8149-4701-89f9-e046db2ab2cf/public_url' },
  { id: 'cisco', featured: true, name: 'Introduction to Cybersecurity', issuer: 'Cisco Networking Academy', date: 'Feb 2026', img: 'badges/introduction-to-cybersecurity.png', verify: 'https://www.credly.com/badges/b1fcd339-b65b-456a-a777-54eb6ad5612f/public_url' },
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

/** Courses completed on Coursera and LinkedIn Learning. `href` is the Coursera verify page or the certificate PDF. */
export const courses = [
  { org: 'IBM · Coursera', when: 'Nov 2025', title: 'Introduction to Networking and Storage', href: 'https://coursera.org/verify/XZCCP4XICO2N' },
  { org: 'Duke University · Coursera', when: 'Sep 2025', title: 'Introduction to Machine Learning', href: 'https://coursera.org/verify/187N75TGVG62' },
  { org: 'University of Colorado Boulder · Coursera', when: 'Sep 2025', title: 'Data Mining Methods', href: 'https://coursera.org/verify/XXCJ5NKNAHRX' },
  { org: 'IBM · Coursera', when: 'Sep 2025', title: 'Introduction to Software Engineering', href: 'https://coursera.org/verify/K1XHCRPQTASP' },
  { org: 'IBM · Coursera', when: 'Jul 2025', title: 'Data Science Foundations: Tools, Careers & Real-World Applications', href: 'https://coursera.org/verify/Z7BWQGJUBJWU' },
  { org: 'POSTECH · Coursera', when: 'Jun 2025', title: 'Introduction and Programming with IoT Boards', href: 'https://coursera.org/verify/U3BXQYVTAFVB' },
  { org: 'LinkedIn Learning', when: 'Jun 2024', title: 'Java 8 Essential Training', href: 'docs/certs/java-8-essential-training.pdf', pdf: true },
  { org: 'LinkedIn Learning', when: 'Mar 2024', title: 'Programming Foundations: Discrete Mathematics', href: 'docs/certs/discrete-mathematics.pdf', pdf: true },
];

export type Publication = {
  id: string;
  title: string;
  venue: string;
  year: string;
  status: string;
  authors: string;
  project?: string;
  /** Short summary shown when the row expands (wireframe 1i). */
  abstract: string;
  figure?: { src: string; alt: string };
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
    abstract: 'Compares SVM, mBERT, XLM-RoBERTa Base, XLM-RoBERTa Large and HateBERT on Filipino text after it has been translated to English. HateBERT reaches the highest Filipino Macro-F1 (0.6780) with the smallest cross-lingual drop (9.2%).',
    figure: { src: 'img/fig-translation-engines.webp', alt: 'Figure from the ChatSafe study comparing translation engines' },
  },
  {
    id: 'BS1036',
    title: 'ChatSafe: End-to-End Evaluation and Translation-Layer Ablation of a Translate-then-Classify Cyberbullying Detection Pipeline',
    venue: '6th International Conference on Computer Communication and Information Systems (CCCIS 2026)',
    year: '2026',
    status: 'Accepted',
    authors: 'Amihan, D. C. M. C., et al.',
    project: 'chatsafe',
    abstract: 'Evaluates the deployed ChatSafe pipeline end to end on a purpose-built gold-standard set (Macro-F1 0.7044) and ablates the translation layer to measure how much it contributes.',
  },
  {
    id: 'BS1037',
    title: 'Psychological Validation for a Translate-Then-Classify Pipeline for Cyberbullying Detection in Code-Mixed Filipino-Bisaya-English Text',
    venue: '6th International Conference on Computer Communication and Information Systems (CCCIS 2026)',
    year: '2026',
    status: 'Accepted',
    authors: 'Amihan, D. C. M. C., et al.',
    project: 'chatsafe',
    abstract: "Validates the pipeline against three licensed psychology professionals using an Expert Labeling Protocol: substantial inter-expert agreement (Fleiss' kappa 0.7245) and moderate pipeline-to-expert agreement (Cohen's kappa 0.4222), falling to near chance without translation.",
  },
  {
    id: 'NT1009',
    title: 'SeGlo-12: A Multimodal Glove Integrating Flex Sensors and Computer Vision for Sign-to-Speech Translation',
    venue: 'International Conference on Science and Technology Engineering (ICSTE 2025), Springer LNEE',
    year: '2025',
    status: 'Accepted',
    authors: 'Cerna, P. D., Lungay, C. R. A., Amihan, D. C. M. C., Alalim, H. V. D., Lisondra, C. B.',
    project: 'seglo-12',
    abstract: 'A dual-mode ASL translator: a flex-sensor and gyroscope glove for rule-based static signs, and a MediaPipe + TensorFlow Lite camera mode, both in one offline Android app. The vision module reached 87% accuracy (macro-F1 0.86) over 38 classes; beta testers rated it 4.51/5.',
    figure: { src: 'img/seglo-glove.webp', alt: 'SeGlo-12 glove prototype' },
  },
  {
    id: 'THESIS',
    title: 'ChatSafe: A Translate-Then-Classify Pipeline for Cyberbullying Detection in Code-Mixed Filipino-Bisaya-English Text',
    venue: 'Undergraduate thesis, Mapúa Malayan Colleges Mindanao',
    year: '2026',
    status: 'Approved, June 2026',
    authors: 'Amihan, D. C. M. C., Alovera, J. L. S., Monteverde, I. M. C.',
    project: 'chatsafe',
    abstract: 'Curates a 213,090-instance English training corpus and a 13,724-instance Filipino evaluation corpus, selects HateBERT among five models, and shows through expert validation and ablation that translation is the component the pipeline depends on.',
  },
  {
    id: 'AID',
    title: 'Advancing AI Image Forensics: Machine Learning Approaches for Detecting Real and AI-Generated Images Using Multi-Source Unstructured Image Datasets',
    venue: 'Course manuscript, Mapúa Malayan Colleges Mindanao',
    year: '', // TODO: confirm the year of the AI image detection manuscript
    status: 'Manuscript',
    authors: 'Amihan, D. C. M. C., Monteverde, I. M. C., Yncierto, J. H. R.',
    project: 'ai-image-detector',
    abstract: 'A Swin Transformer Tiny model fine-tuned on multi-source data to detect images from seven generators, with temperature scaling and threshold tuning for calibrated confidence and Grad-CAM to show which regions drove each decision.',
  },
];
