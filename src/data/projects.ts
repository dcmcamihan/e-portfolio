// Case-study content. Facts come from the manuscripts in "for claude/featured projects",
// the resume, and the previous site. Numbers shown inside the promo videos are illustrative
// and are deliberately not repeated here.

export type Stat = { value: string; label: string; source: string };
export type Section = { key: 'Problem' | 'Architecture' | 'Interface' | 'Results'; summary: string; body: string[] };
export type Shot = { src: string; alt: string };
export type Category = 'AI/ML' | 'Web' | 'Mobile';

export type Project = {
  slug: string;
  name: string;
  short: string;
  /** Case-study title (wireframe 2f). */
  headline: string;
  year: string;
  categories: Category[];
  /** Short stack line under carousel cards. */
  stackLine: string;
  facts: { label: 'Role' | 'Stack' | 'Infra' | 'Output'; value: string }[];
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
    captions?: string;
    /** Text alternative for the promo video. */
    transcript: string;
  };
  links: { label: string; href: string }[];
};

const v = (slug: string) => ({
  full: `video/${slug}`,
  loop: `video/${slug}-loop`,
  poster: `video/${slug}-poster.jpg`,
  captions: `video/${slug}.vtt`,
});

export const projects: Project[] = [
  {
    slug: 'chatsafe',
    name: 'ChatSafe',
    short: 'Cyberbullying detection for code-mixed Filipino text',
    headline: 'Detecting cyberbullying in Taglish and Bisaya, deployed on AWS',
    year: '2025–26',
    categories: ['AI/ML', 'Web'],
    stackLine: 'FastAPI · HateBERT · AWS',
    facts: [
      { label: 'Role', value: 'Lead developer' },
      { label: 'Stack', value: 'FastAPI · React · MySQL' },
      { label: 'Infra', value: 'AWS, containerised services' },
      { label: 'Output', value: 'Thesis + 3 CCCIS 2026 papers' },
    ],
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
        key: 'Problem',
        summary: 'No tool reliably catches bullying in code-mixed Philippine posts.',
        body: [
          'Cyberbullying among Filipino youth is a growing public health concern, yet no automated system reliably detects it in the code-mixed Filipino, Bisaya and English text that Philippine social media is written in.',
          'Existing annotated Filipino corpora were built for political discourse rather than interpersonal bullying, and English-centric models break on code-mixed tokens without some normalisation first.',
        ],
      },
      {
        key: 'Architecture',
        summary: 'Gemini Flash translates, a fine-tuned HateBERT classifies.',
        body: [
          'ChatSafe uses Google Gemini Flash to normalise code-mixed text into English, then classifies it with a fine-tuned hate-speech model. Five architectures were compared — SVM, mBERT, XLM-RoBERTa Base, XLM-RoBERTa Large and HateBERT. HateBERT reached the highest Filipino Macro-F1 (0.6780) and the smallest cross-lingual drop (9.2%), so it became the deployed model.',
          'I built the FastAPI back end around the translation and classification steps, the MySQL data layer, and the AWS deployment that runs the services as containers. I also led the manuscript and the system architecture.',
        ],
      },
      {
        key: 'Interface',
        summary: 'Analyzer, post library, analytics and batch upload in one dashboard.',
        body: [
          'The React dashboard takes a Reddit thread URL or pasted text and shows each pipeline step as it runs: ingest, preprocess, translate, classify. A post library lets moderators open any scraped post and inspect each comment’s verdict, analytics break results down by language, and a batch screen classifies a whole CSV at once.',
        ],
      },
      {
        key: 'Results',
        summary: 'Macro-F1 0.7044; translation is the component that matters.',
        body: [
          'The deployed system scored a Macro-F1 of 0.7044 and found about 4 in 5 actual cyberbullying posts on a purpose-built gold-standard set.',
          "Three licensed psychology professionals reached substantial agreement with each other (Fleiss' kappa 0.7245). Removing the translation step dropped pipeline-to-expert agreement to near chance (kappa 0.1910), which confirms translation as the key component.",
        ],
      },
    ],
    gallery: [
      { src: 'img/ui/chatsafe-analyzer.webp', alt: 'ChatSafe text analyzer running the four-step processing pipeline on a Reddit thread' },
      { src: 'img/ui/chatsafe-library.webp', alt: 'ChatSafe post library with a critical post and its threat bar' },
      { src: 'img/ui/chatsafe-overview.webp', alt: 'ChatSafe content intelligence overview with detection volume and language distribution' },
    ],
    video: {
      ...v('chatsafe'),
      transcript:
        'Promo walkthrough of the ChatSafe web app: a Taglish comment is typed in; the landing page opens into the dashboard; a Reddit URL goes through the four pipeline steps; the post library highlights a critical post; analytics show language and bullying breakdowns; a CSV batch is scanned. No narration.',
    },
    links: [],
  },
  {
    slug: 'jolens',
    name: "Jolen's Bicycle Supply",
    short: 'Point of sale, inventory and reports for a bike shop',
    headline: 'Taking a Digos City bike shop off paper logs',
    year: '2024–25',
    categories: ['Web'],
    stackLine: 'React · Node · POS',
    facts: [
      { label: 'Role', value: 'Full-stack developer' },
      { label: 'Stack', value: 'React · Express · MySQL' },
      { label: 'Infra', value: 'Render (web) · MySQL' },
      { label: 'Output', value: 'POS for a real shop + paper' },
    ],
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
        key: 'Problem',
        summary: 'Sales and stock were tracked by hand in logbooks and Excel.',
        body: [
          "Jolen's Bicycle Supply sells bicycles, parts and accessories to children, hobbyists and professional cyclists. Stock was tracked in paper logs and occasional Excel files, counted by hand each month, and reorder points were worked out manually.",
          'Sales were copied from receipts and logbooks, which made errors common and real-time sales figures impossible to see, especially in busy seasons.',
        ],
      },
      {
        key: 'Architecture',
        summary: 'A POS layer on an existing shop API, one MySQL database.',
        body: [
          'We extended an earlier shop-management back end that already covered employees, customers, suppliers and inventory, and added the missing point-of-sale layer on top. Every sale updates stock in real time in one central database.',
          'I built front-end screens and most of the back-end routes and database work behind them.',
        ],
      },
      {
        key: 'Interface',
        summary: 'Dashboard, point of sale, inventory and exportable reports.',
        body: [
          'Staff log in to a dashboard with the day’s figures and quick actions, ring up sales on a point-of-sale screen with a product grid and cart, manage stock and purchase orders in inventory, and export daily, weekly and monthly reports.',
        ],
      },
      {
        key: 'Results',
        summary: 'One tool replaces the manual sales and stock process.',
        body: [
          'The system was tested across different environments for functionality and reliability, and replaces the manual sales and stock processes with a single tool.',
        ],
      },
    ],
    gallery: [
      { src: 'img/ui/jolens-dashboard.webp', alt: "Jolen's BikeShop dashboard with sales performance and quick actions" },
      { src: 'img/ui/jolens-pos.webp', alt: "Jolen's point of sale screen with product grid and shopping cart" },
      { src: 'img/ui/jolens-reports.webp', alt: "Jolen's sales reports with trend line and category breakdown" },
    ],
    video: {
      ...v('jolens'),
      transcript:
        "Promo walkthrough of the Jolen's Bicycle Supply app: the landing page builds in; the cursor logs in; dashboard counters and weekly bars fill; a helmet and a bike are added to the cart and paid in cash; sales reports draw a trend line and category pie. No narration.",
    },
    links: [],
  },
  {
    slug: 'ai-image-detector',
    name: 'AI Image Detector',
    short: 'Telling real photos from AI-generated ones',
    headline: 'Telling real photos from AI-generated ones, with the reason shown',
    year: '2025',
    categories: ['AI/ML', 'Web'],
    stackLine: 'PyTorch · React',
    facts: [
      { label: 'Role', value: 'Lead' },
      { label: 'Stack', value: 'PyTorch · Swin-T · React' },
      { label: 'Infra', value: 'PyTorch model + web client' },
      { label: 'Output', value: 'ML course manuscript' },
    ],
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
        key: 'Problem',
        summary: 'Synthetic images are outpacing older forensic checks.',
        body: [
          'Tools like MidJourney, Stable Diffusion, DALL·E, BigGAN, Glide, VADM and WuKong make hyper-realistic images easy to produce, and older forensic methods that look for pixel or compression traces are falling behind.',
        ],
      },
      {
        key: 'Architecture',
        summary: 'Swin-T fine-tuned on multi-source data, with calibrated confidence.',
        body: [
          'A Swin Transformer Tiny model was fine-tuned on GenImage plus additional sources to pick up the subtle artefacts generators leave behind. Preprocessing normalises, resizes and screens out corrupted files; temperature scaling and threshold tuning calibrate the confidence score.',
          'I built the training and evaluation pipeline and the Grad-CAM explanation layer.',
        ],
      },
      {
        key: 'Interface',
        summary: 'Upload, get a verdict, see why; browse the dataset.',
        body: [
          'A web client with a dashboard of recent analyses, an upload-and-detect screen that returns a verdict with a calibrated confidence and per-generator likelihoods, and a dataset viewer for browsing the training images and their predictions.',
        ],
      },
      {
        key: 'Results',
        summary: 'Generalises across generators, keeps recall high, shows its reasons.',
        body: [
          'The model generalised across the generator platforms in the test set while keeping recall high, and every result comes with a visible reason instead of a bare score.',
        ],
      },
    ],
    gallery: [
      { src: 'img/ui/aid-dashboard.webp', alt: 'AI Detector dashboard with accuracy over time and prediction distribution' },
      { src: 'img/ui/aid-result.webp', alt: 'AI Detector result for an uploaded image, labelled AI-generated with generator likelihoods' },
      { src: 'img/ui/aid-dataset.webp', alt: 'AI Detector dataset viewer grid of real and generated images' },
    ],
    video: {
      ...v('ai-image-detector'),
      transcript:
        'Promo walkthrough of the AI Image Detector: a wall of images is scanned and labelled; dashboard stats and charts fill; an image is dragged into the dropzone and returned as AI-generated with a confidence and generator bars; the dataset grid opens a prediction detail. No narration.',
    },
    links: [{ label: 'GitHub repository', href: 'https://github.com/dcmcamihan/ai-image-detector' }],
  },
  {
    slug: 'seglo-12',
    name: 'SeGlo-12',
    short: 'Sign-language glove and Android app',
    headline: 'Turning sign language into speech, offline, from a glove or a camera',
    year: '2025–26',
    categories: ['AI/ML', 'Mobile'],
    stackLine: 'Kotlin · Arduino · TF Lite',
    facts: [
      { label: 'Role', value: 'Lead developer' },
      { label: 'Stack', value: 'Kotlin · Arduino · TF Lite' },
      { label: 'Infra', value: 'On-device Android + Arduino' },
      { label: 'Output', value: 'ICSTE 2025 paper (Springer LNEE)' },
    ],
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
        key: 'Problem',
        summary: 'Glove-only and camera-only systems each fail somewhere.',
        body: [
          'Most people who hear do not know sign language. Glove-only systems handle lighting well but are limited to static signs; camera-only systems struggle with light, clutter and line of sight. Few systems combine both, and fewer still run offline on a phone.',
        ],
      },
      {
        key: 'Architecture',
        summary: 'Flex-sensor glove over Bluetooth, plus MediaPipe + TF Lite on device.',
        body: [
          'Glove mode: an Arduino Nano reads five flex sensors and an MPU-6050 gyroscope, maps hand shapes to letters with calibrated thresholds, and sends the label to the phone over HC-05 Bluetooth.',
          'Camera mode: MediaPipe Hands extracts 21 landmarks per hand (a 126-value feature vector for two hands) and a TensorFlow Lite dense network classifies the sign on the device.',
        ],
      },
      {
        key: 'Interface',
        summary: 'One Kotlin app for both modes, with text and speech output.',
        body: [
          'I led the Android app in Kotlin and Jetpack Compose: a Bluetooth card to pair and reconnect the glove, live sensor readings, a message that fills as letters are signed and a Speak button for text-to-speech, and a camera mode that draws the hand skeleton with the detected sign and its confidence.',
        ],
      },
      {
        key: 'Results',
        summary: 'Accepted at ICSTE 2025; 4.51/5 from beta testers.',
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
      // TODO: the SeGlo-12 promo composition needs its jsx files to render; export it to
      // public/video/seglo-12{,-loop}.{mp4,webm} + seglo-12.vtt. Poster is a glove still until then.
      poster: 'video/seglo-12-poster.jpg',
      transcript:
        'Promo video pending. The still shows the SeGlo-12 glove prototype: five flex sensors along the fingers and a gyroscope module on the back of the hand.',
    },
    links: [{ label: 'GitHub repository', href: 'https://github.com/dcmcamihan/seglo12' }],
  },
];

export const categories: Category[] = ['AI/ML', 'Web', 'Mobile'];
export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);
export const nextProject = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
};
export const projectIndex = (slug: string) => projects.findIndex((p) => p.slug === slug);
