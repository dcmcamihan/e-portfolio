// One command map shared by section headers, the ⌘K palette, the terminal and the page transition
// (Design System §02 and §06).
import { projects } from '../data/projects';

export type Route = { key: string; path: string; label: string; aliases: string[] };

/** GO entries in the palette, with their G-key shortcut. */
export const routes: Route[] = [
  { key: 'G H', path: '/', label: 'Home', aliases: ['home', '~'] },
  { key: 'G W', path: '/work', label: 'Work', aliases: ['work', 'projects'] },
  { key: 'G A', path: '/about', label: 'About', aliases: ['about', 'journey'] },
  { key: 'G C', path: '/certifications', label: 'Certifications', aliases: ['certs', 'certifications'] },
  { key: 'G R', path: '/research', label: 'Research', aliases: ['research', 'papers'] },
  { key: 'G M', path: '/contact', label: 'Contact', aliases: ['contact', 'mail'] },
];

export const projectAliases = (slug: string, name: string) => [
  slug,
  name.toLowerCase(),
  name.toLowerCase().replace(/[^a-z0-9]+/g, ''),
  name.toLowerCase().split(/\s+/)[0].replace(/[^a-z0-9-]/g, ''),
];

export function findProject(q: string) {
  const n = q.trim().toLowerCase();
  if (!n) return undefined;
  return projects.find((p) => projectAliases(p.slug, p.name).some((a) => a === n || a.startsWith(n)));
}
