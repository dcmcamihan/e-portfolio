import {
  siReact, siTypescript, siTailwindcss, siVite, siNodedotjs, siFastapi, siMysql,
  siPython, siPytorch, siGooglegemini, siFigma, siAmazonwebservices,
} from 'simple-icons';
import { projects } from './projects';

/** What I build · exploration 6f: tools as a left-to-right build graph. */

export type ToolId =
  | 'flows' | 'usab' | 'figma' | 'proto'
  | 'react' | 'typescript' | 'tailwindcss'
  | 'nodedotjs' | 'fastapi' | 'mysql'
  | 'python' | 'pytorch' | 'googlegemini'
  | 'vite' | 'aws';

type Mark = { path: string; hex: string };
export type Tool = { id: ToolId; name: string; mark?: Mark; abbr?: string; usedIn: string[] };

// Brand marks are bundled from simple-icons (no third-party requests). AWS's mark is near-black,
// so it lights in its orange instead. Practices have no mark and show as lettered tiles.
const m = (icon: { path: string; hex: string }, hex = icon.hex): Mark => ({ path: icon.path, hex });

// "Used in" comes only from the projects' own stack lists, so nothing here is claimed
// that the case studies don't say. A tool no project lists gets no note.
const STACK_NAME: Partial<Record<ToolId, string>> = {
  react: 'React', typescript: 'TypeScript', tailwindcss: 'Tailwind CSS', vite: 'Vite',
  nodedotjs: 'Node.js', fastapi: 'FastAPI', mysql: 'MySQL', python: 'Python',
  pytorch: 'PyTorch', googlegemini: 'Gemini API', aws: 'AWS', figma: 'Figma',
};
const usedIn = (id: ToolId) => {
  const n = STACK_NAME[id];
  return n ? projects.filter((p) => p.stack.includes(n)).map((p) => p.name) : [];
};

const T = (id: ToolId, name: string, mark?: Mark, abbr?: string): Tool => ({ id, name, mark, abbr, usedIn: usedIn(id) });

export const TOOLS: Record<ToolId, Tool> = {
  flows: T('flows', 'User flows', undefined, 'FLOW'),
  usab: T('usab', 'Usability', undefined, 'TEST'),
  figma: T('figma', 'Figma', m(siFigma)),
  proto: T('proto', 'Prototyping', undefined, 'PROTO'),
  react: T('react', 'React', m(siReact)),
  typescript: T('typescript', 'TypeScript', m(siTypescript)),
  tailwindcss: T('tailwindcss', 'Tailwind CSS', m(siTailwindcss)),
  nodedotjs: T('nodedotjs', 'Node.js', m(siNodedotjs)),
  fastapi: T('fastapi', 'FastAPI', m(siFastapi)),
  mysql: T('mysql', 'MySQL', m(siMysql)),
  python: T('python', 'Python', m(siPython)),
  pytorch: T('pytorch', 'PyTorch', m(siPytorch)),
  googlegemini: T('googlegemini', 'Gemini API', m(siGooglegemini)),
  vite: T('vite', 'Vite', m(siVite)),
  aws: T('aws', 'AWS', m(siAmazonwebservices, 'FF9900')),
};

export const STAGES: { label: string; tools: ToolId[] }[] = [
  { label: 'Research', tools: ['flows', 'usab'] },
  { label: 'Design', tools: ['figma', 'proto'] },
  { label: 'Interface', tools: ['react', 'typescript', 'tailwindcss'] },
  { label: 'Server', tools: ['nodedotjs', 'fastapi', 'mysql'] },
  { label: 'Intelligence', tools: ['python', 'pytorch', 'googlegemini'] },
  { label: 'Ship', tools: ['vite', 'aws'] },
];

/** Each service's path through the stages (6f). */
export const PATHS: Record<'web' | 'apps' | 'ai' | 'ux', ToolId[]> = {
  web: ['figma', 'react', 'typescript', 'tailwindcss', 'vite'],
  apps: ['figma', 'react', 'nodedotjs', 'fastapi', 'mysql'],
  ai: ['fastapi', 'python', 'pytorch', 'googlegemini', 'aws'],
  ux: ['flows', 'usab', 'figma', 'proto'],
};
