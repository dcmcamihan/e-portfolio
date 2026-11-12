// Skills gained from the certifications and trainings, each linked to the course or credential
// it came from. Grouping into themes is ours.

export type Skill = { name: string; from: string[] };
export type SkillGroup = { key: string; label: string; skills: Skill[] };

const DSF = 'Data Science Foundations (IBM)';
const DSO = 'Data Science Orientation';
const GENAI = 'AWS Academy: Generative AI Foundations';
const AIP = 'AWS Certified AI Practitioner';
const ARCH = 'AWS Academy: Cloud Architecting';
const ML = 'Introduction to Machine Learning (Duke)';
const DMM = 'Data Mining Methods (CU Boulder)';
const SE = 'Introduction to Software Engineering (IBM)';
const NET = 'Introduction to Networking and Storage (IBM)';
const CYB = 'Introduction to Cybersecurity (Cisco)';
const IOT = 'Introduction and Programming with IoT Boards (POSTECH)';
const JAVA = 'Java 8 Essential Training';
const DM = 'Programming Foundations: Discrete Mathematics';
const WIRE = 'Build Wireframes and Low-Fidelity Prototypes (Google)';
const PROC = 'Start the UX Design Process (Google)';
const RES = 'Conduct UX Research and Test Early Concepts (Google)';
const GT = 'Introduction to User Experience Design (Georgia Tech)';

export const skillGroups: SkillGroup[] = [
  {
    key: 'ai', label: 'AI and machine learning',
    skills: [
      { name: 'Machine Learning', from: [DSF, DSO, GENAI] },
      { name: 'Applied Machine Learning', from: [ML] },
      { name: 'Artificial Intelligence (AI)', from: [DSO, GENAI, AIP] },
      { name: 'Generative AI', from: [GENAI, AIP] },
      { name: 'Deep Learning', from: [DSF, ML] },
      { name: 'Artificial Neural Networks', from: [DMM, ML] },
      { name: 'Supervised Learning', from: [DMM] },
      { name: 'Unsupervised Learning', from: [DMM, ML] },
      { name: 'Reinforcement Learning', from: [ML] },
      { name: 'Natural Language Processing (NLP)', from: [ML] },
      { name: 'Computer Vision', from: [ML] },
      { name: 'Image Analysis', from: [ML] },
      { name: 'Medical Imaging', from: [ML] },
      { name: 'PyTorch', from: [ML] },
      { name: 'Python (Programming Language)', from: [ML] },
    ],
  },
  {
    key: 'data', label: 'Data',
    skills: [
      { name: 'Data Science', from: [DSF, DSO, DMM] },
      { name: 'Data Mining', from: [DSF, DMM] },
      { name: 'Classification', from: [DMM] },
      { name: 'Decision Trees', from: [DMM] },
      { name: 'Anomaly Detection', from: [DMM] },
      { name: 'Correlation Analysis', from: [DMM] },
      { name: 'Algorithms', from: [DMM] },
      { name: 'Data Literacy', from: [DSF] },
      { name: 'Data-driven Decision Making', from: [DSF] },
      { name: 'Data Storage', from: [DSF, NET] },
      { name: 'Data Ethics', from: [RES] },
    ],
  },
  {
    key: 'software', label: 'Software and web',
    skills: [
      { name: 'Full-Stack Development', from: [SE] },
      { name: 'Web Development', from: [SE] },
      { name: 'Web Applications', from: [SE] },
      { name: 'Software Development', from: [SE] },
      { name: 'Software Design', from: [SE] },
      { name: 'Software Architecture', from: [SE] },
      { name: 'Software Development Life Cycle (SDLC)', from: [SE] },
      { name: 'Software Development Tools', from: [SE] },
      { name: 'Application Deployment', from: [SE] },
      { name: 'Computer Programming', from: [SE] },
      { name: 'Java', from: [JAVA] },
      { name: 'Programming Foundations', from: [DM] },
      { name: 'Discrete Mathematics', from: [DM] },
    ],
  },
  {
    key: 'cloud', label: 'Cloud',
    skills: [
      { name: 'Amazon Web Services (AWS)', from: [ARCH, AIP] },
      { name: 'Solution Architecture', from: [ARCH] },
      { name: 'Cloud Computing', from: [DSF] },
      { name: 'Digital Transformation', from: [DSF] },
    ],
  },
  {
    key: 'network', label: 'Networking and security',
    skills: [
      { name: 'Computer Networking', from: [NET] },
      { name: 'Network Protocols', from: [NET] },
      { name: 'Network Design', from: [NET] },
      { name: 'Network Security', from: [NET] },
      { name: 'Network Troubleshooting', from: [NET] },
      { name: 'Network Support', from: [NET] },
      { name: 'Local Area Network (LAN)', from: [NET] },
      { name: 'Windows', from: [NET] },
      { name: 'CLI', from: [NET] },
      { name: 'Cybersecurity', from: [CYB] },
      { name: 'Threat Detection', from: [CYB] },
      { name: 'Threat & Vulnerability Management', from: [CYB] },
      { name: 'Data Privacy', from: [CYB] },
    ],
  },
  {
    key: 'iot', label: 'IoT and hardware',
    skills: [
      { name: 'Internet of Things (IoT)', from: [IOT] },
      { name: 'Emerging Technologies', from: [IOT] },
      { name: 'Electronic Components', from: [IOT] },
      { name: 'Computer Hardware', from: [IOT] },
      { name: 'Networking', from: [IOT] },
      { name: 'Wireless Networking', from: [IOT] },
      { name: 'Communication Systems', from: [IOT] },
      { name: 'Problem Solving', from: [IOT] },
    ],
  },
  {
    key: 'ux', label: 'UX and design',
    skills: [
      { name: 'UX Research', from: [GT, WIRE, RES] },
      { name: 'Research Design', from: [RES] },
      { name: 'Requirements Gathering', from: [GT] },
      { name: 'Competitive Analysis', from: [PROC] },
      { name: 'Storyboarding', from: [WIRE] },
      { name: 'Figma (Software)', from: [WIRE] },
    ],
  },
];

export const skillCount = skillGroups.reduce((n, g) => n + g.skills.length, 0);
