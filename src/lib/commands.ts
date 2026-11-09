// One command map shared by section headers, the ⌘K palette and the terminal (Design System v2 §02).
import { projects } from '../data/projects';

export type Route = { cmd: string; path: string; label: string; result: string; aliases: string[] };

export const routes: Route[] = [
  { cmd: 'whoami', path: '/about', label: 'About / journey', result: 'dianna — developer, Davao City', aliases: ['about', 'journey'] },
  { cmd: 'ls --featured', path: '/work', label: 'Work', result: `${projects.length} projects`, aliases: ['work', 'projects', 'ls projects', 'ls'] },
  { cmd: 'cat services.md', path: '/#services', label: 'Services', result: '4 services', aliases: ['services'] },
  { cmd: 'git log --oneline', path: '/about#journey', label: 'Journey (commit log)', result: 'HEAD → open for work', aliases: ['git log', 'log'] },
  { cmd: 'ls ./certs', path: '/certifications', label: 'Certifications', result: 'badges loaded', aliases: ['certs', 'certifications'] },
  { cmd: 'cat research.bib', path: '/research', label: 'Research & publications', result: 'papers indexed', aliases: ['research', 'papers'] },
  { cmd: 'mail --to dianna', path: '/contact', label: 'Contact', result: 'inbox open', aliases: ['contact', 'mail', 'email', 'hire'] },
  { cmd: 'cd ~', path: '/', label: 'Home', result: 'ok', aliases: ['home', 'cd'] },
];

export const projectAliases = (slug: string, name: string) => [
  slug,
  name.toLowerCase(),
  name.toLowerCase().replace(/[^a-z0-9]+/g, ''),
  name.toLowerCase().split(/\s+/)[0].replace(/[^a-z0-9-]/g, ''),
];

export function findProject(q: string) {
  const n = q.trim().toLowerCase();
  return projects.find((p) => projectAliases(p.slug, p.name).some((a) => a === n || a.startsWith(n)));
}
