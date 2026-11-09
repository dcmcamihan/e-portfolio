// Case-study content. Facts come from the manuscripts in "for claude/featured projects",
// the resume, and the previous site. Numbers shown inside the promo videos are illustrative
// and are deliberately not repeated here.

export type Stat = { value: string; label: string; source: string };
export type Section = { heading: string; body: string[] };
export type Shot = { src: string; alt: string };

export type Project = {
  slug: string;
  name: string;
  short: string;
  year: string;
  kind: string;
  tags: string[];
  role: string;
  roleDetail: string;
  team: string;
  stack: string[];
  summary: string;
  stats: Stat[];
  sections: Section[];
  gallery: Shot[];
  video: {
    full?: string;
    loop?: string;
    poster: string;
    /** Text alternative for the promo video. */
    transcript: string;
  };
  links: { label: string; href: string }[];
};

const v = (slug: string) => ({
  full: `video/${slug}`,
  loop: `video/${slug}-loop`,
  poster: `video/${slug}-poster.jpg`,
});

export const projects: Project[] = [
  {
    slug: 'chatsafe',
    name: 'ChatSafe',
    short: 'Multilingual cyberbullying detection',
    year: '2025–2026',
    kind: 'AI integration · full-stack',
    tags: ['AI/ML', 'NLP', 'Full-stack', 'AWS'],
    role: 'Lead developer and researcher',
    roleDetail: 'Manuscript, model pipeline, back end, front end, database and AWS deployment',
    team: 'Thesis group of three, Mapúa MCM',
    stack: ['Python', 'Gemini API', 'HateBERT', 'React', 'FastAPI', 'MySQL', 'AWS'],
    summary:
      'A translate-then-classify pipeline that detects cyberbullying in code-mixed Filipino, Bisaya and English text from Philippine social media.',
    stats: [
      { value: '0.7044', label: 'Macro-F1 of the deployed system on the gold-standard set', source: 'Thesis, Objective 3' },
      { value: '0.7245', label: "Fleiss' kappa between three licensed psychology professionals", source: 'Thesis, Objective 4' },
      { value: '213,090', label: 'English training instances curated from four public datasets', source: 'Thesis, Objective 1' },
      { value: '3', label: 'papers accepted at CCCIS 2026', source: 'Acceptance notices BS1035–BS1037' },
    ],
    sections: [
      {
        heading: 'Problem',
        body: [
          'Cyberbullying among Filipino youth is a growing public health concern, yet no automated system reliably detects it in the code-mixed Filipino, Bisaya and English text that Philippine social media is written in.',
          'Existing annotated Filipino corpora were built for political discourse rather than interpersonal bullying, and English-centric models break on code-mixed tokens without some normalisation first.',
        ],
      },
      {
        heading: 'Approach',
        body: [
          'ChatSafe uses Google Gemini Flash to normalise code-mixed text into English, then classifies it with a fine-tuned hate-speech model.',
          'Five architectures were compared — SVM, mBERT, XLM-RoBERTa Base, XLM-RoBERTa Large and HateBERT. HateBERT reached the highest Filipino Macro-F1 (0.6780) and the smallest cross-lingual drop (9.2%), so it became the deployed model.',
        ],
      },
      {
        heading: 'What I built',
        body: [
          'A FastAPI back end around the translation and classification steps, a React front end for submitting and reviewing text, a MySQL data layer, and the AWS deployment that runs the services as containers.',
          'I also led the manuscript and the system architecture, and tested and debugged the pipeline end to end.',
        ],
      },
      {
        heading: 'Outcome',
        body: [
          'The deployed system scored a Macro-F1 of 0.7044 and found about 4 in 5 actual cyberbullying posts on a purpose-built gold-standard set.',
          "Three licensed psychology professionals reached substantial agreement with each other (Fleiss' kappa 0.7245). Removing the translation step dropped pipeline-to-expert agreement to near chance (kappa 0.1910), which confirms translation as the key component.",
        ],
      },
    ],
    gallery: [{ src: 'img/fig-translation-engines.webp', alt: 'Chart from the ChatSafe study comparing translation engines on code-mixed text' }],
    video: {
      ...v('chatsafe'),
      transcript:
        'Promo walkthrough of the ChatSafe web app: a code-mixed Filipino, Bisaya and English message is pasted in, translated to English, classified, and returned with a label and confidence. No narration.',
    },
    links: [],
  },
  {
    slug: 'jolens',
    name: "Jolen's Bicycle Supply",
    short: 'Point of sale, inventory and reports',
    year: '2024–2025',
    kind: 'Web app · dashboard',
    tags: ['Full-stack', 'Dashboard', 'Client work'],
    role: 'Developer',
    roleDetail: 'Front end, back end and database',
    team: 'Team of three, Software Engineering course, Mapúa MCM',
    stack: ['React', 'Vite', 'Tailwind CSS', 'Node.js', 'Express', 'MySQL'],
    summary:
      'A point-of-sale and inventory system for a bicycle shop in Digos City that ran on paper logs and spreadsheets.',
    stats: [
      { value: '2003', label: 'year the shop was founded in Digos City', source: 'Project paper' },
      { value: '3', label: 'report periods exported: daily, weekly, monthly', source: 'Project paper' },
    ],
    sections: [
      {
        heading: 'Problem',
        body: [
          "Jolen's Bicycle Supply sells bicycles, parts and accessories to children, hobbyists and professional cyclists. Stock was tracked in paper logs and occasional Excel files, counted by hand each month, and reorder points were worked out manually.",
          'Sales were copied from receipts and logbooks, which made errors common and real-time sales figures impossible to see, especially in busy seasons.',
        ],
      },
      {
        heading: 'Approach',
        body: [
          'We extended an earlier shop-management back end that already covered employees, customers, suppliers and inventory, and added the missing point-of-sale layer on top.',
          'The system records sales, updates inventory in real time, keeps everything in one database, and summarises data into daily, weekly and monthly reports that can be exported.',
        ],
      },
      {
        heading: 'What I built',
        body: [
          'Front-end screens focused on fast, clear navigation for shop staff — landing and login, dashboard, point of sale, inventory, and reports and analytics — plus most of the back-end routes and database work behind them.',
        ],
      },
      {
        heading: 'Outcome',
        body: [
          'The system was tested across different environments for functionality and reliability, and replaces the manual sales and stock processes with a single tool.',
        ],
      },
    ],
    gallery: [{ src: 'img/jolens.webp', alt: "Jolen's Bicycle Supply dashboard" }],
    video: {
      ...v('jolens'),
      transcript:
        "Promo walkthrough of the Jolen's Bicycle Supply app: login, the sales dashboard, ringing up a sale at the point of sale, checking stock in inventory, and exporting a report. No narration.",
    },
    links: [],
  },
  {
    slug: 'ai-image-detector',
    name: 'AI Image Detector',
    short: 'Real vs AI-generated image forensics',
    year: '2025',
    kind: 'AI integration · web app',
    tags: ['AI/ML', 'Computer vision', 'Explainable AI'],
    role: 'Lead',
    roleDetail: 'Research, model development, web app and manuscript',
    team: 'Team of three, Machine Learning course, Mapúa MCM',
    stack: ['Python', 'PyTorch', 'Swin Transformer', 'Grad-CAM', 'React'],
    summary:
      'A fine-tuned Swin Transformer that tells real photographs from AI-generated ones and shows, with Grad-CAM, which regions drove the decision.',
    stats: [
      { value: '7', label: 'generators covered, from MidJourney to WuKong', source: 'Manuscript abstract' },
      { value: 'Swin-T', label: 'fine-tuned Swin Transformer Tiny backbone', source: 'Manuscript abstract' },
    ],
    sections: [
      {
        heading: 'Problem',
        body: [
          'Tools like MidJourney, Stable Diffusion, DALL·E, BigGAN, Glide, VADM and WuKong make hyper-realistic images easy to produce, and older forensic methods that look for pixel or compression traces are falling behind.',
        ],
      },
      {
        heading: 'Approach',
        body: [
          'A Swin Transformer Tiny model was fine-tuned on GenImage plus additional sources to pick up the subtle artefacts generators leave behind.',
          'Preprocessing normalises, resizes and screens out corrupted files. Temperature scaling and threshold tuning calibrate the confidence score so it means something.',
        ],
      },
      {
        heading: 'What I built',
        body: [
          'The training and evaluation pipeline, the Grad-CAM explanation layer, and a web client where you upload an image and get a verdict, a calibrated confidence and a heat map of the regions that mattered.',
        ],
      },
      {
        heading: 'Outcome',
        body: [
          'The model generalised across the generator platforms in the test set while keeping recall high, and every result comes with a visible reason instead of a bare score.',
        ],
      },
    ],
    gallery: [{ src: 'img/ai-image-detector.webp', alt: 'AI Image Detector result screen with a confidence score and heat map' }],
    video: {
      ...v('ai-image-detector'),
      transcript:
        'Promo walkthrough of the AI Image Detector: an image is uploaded, analysed, and returned with a real or AI-generated verdict, a confidence score and a Grad-CAM heat map. No narration.',
    },
    links: [{ label: 'GitHub repository', href: 'https://github.com/dcmcamihan/ai-image-detector' }],
  },
  {
    slug: 'seglo-12',
    name: 'SeGlo-12',
    short: 'Sign-language glove and Android app',
    year: '2025–2026',
    kind: 'Mobile app · embedded · ML',
    tags: ['AI/ML', 'Computer vision', 'Embedded', 'Android'],
    role: 'Lead developer',
    roleDetail: 'Glove firmware, vision model, Kotlin app and manuscript',
    team: 'Team of five, Mapúa MCM',
    stack: ['Kotlin', 'Jetpack Compose', 'Arduino', 'C++', 'MediaPipe', 'TensorFlow Lite', 'Python'],
    summary:
      'A dual-mode American Sign Language translator: a flex-sensor glove and an on-device camera model, both turning signs into text and speech in real time, offline.',
    stats: [
      { value: '87%', label: 'vision accuracy across 38 gesture classes (macro-F1 0.86)', source: 'ICSTE 2025 paper' },
      { value: '4.51/5', label: 'user satisfaction from beta testing with ten participants', source: 'ICSTE 2025 paper' },
      { value: '97.04%', label: 'accuracy of the current model: 24 static letters (no J or Z) and 16 phrases', source: 'seglo12 repository' },
    ],
    sections: [
      {
        heading: 'Problem',
        body: [
          'Most people who hear do not know sign language. Glove-only systems handle lighting well but are limited to static signs; camera-only systems struggle with light, clutter and line of sight. Few systems combine both, and fewer still run offline on a phone.',
        ],
      },
      {
        heading: 'Approach',
        body: [
          'Glove mode: an Arduino Nano reads five flex sensors and an MPU-6050 gyroscope, maps hand shapes to letters with calibrated thresholds, and sends the label to the phone over HC-05 Bluetooth.',
          'Camera mode: MediaPipe Hands extracts 21 landmarks per hand (a 126-value feature vector for two hands) and a TensorFlow Lite dense network classifies the sign on the device.',
        ],
      },
      {
        heading: 'What I built',
        body: [
          'I led the Android app in Kotlin and Jetpack Compose — Bluetooth pairing and reconnection, the on-device inference pipeline, text display and text-to-speech output, and "no hand detected" handling — and worked on the glove code and the vision model.',
        ],
      },
      {
        heading: 'Outcome',
        body: [
          'The paper was accepted at ICSTE 2025 for Springer LNEE. Beta testing with ten participants, including a member of the hard-of-hearing community, gave an overall satisfaction score of 4.51 out of 5.',
        ],
      },
    ],
    gallery: [
      { src: 'img/seglo-glove.webp', alt: 'SeGlo-12 smart glove prototype with flex sensors and gyroscope module' },
      { src: 'img/seglo-app-results.webp', alt: 'SeGlo-12 app detection results panel showing the detected sign and a confidence bar' },
    ],
    video: {
      // TODO: export "SeGlo-12 Promo Video.dc.html" to public/video/seglo-12{,-loop}.{mp4,webm}; poster is a glove still for now.
      poster: 'video/seglo-12-poster.jpg',
      transcript:
        'Promo video pending. The still shows the SeGlo-12 glove prototype: five flex sensors along the fingers and a gyroscope module on the back of the hand.',
    },
    links: [{ label: 'GitHub repository', href: 'https://github.com/dcmcamihan/seglo12' }],
  },
];

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);
export const nextProject = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
};
