import { useState } from 'react';
import { skillCount, skillGroups, type Skill } from '../data/skills';

/** Skills grouped by theme. Hover, focus or tap a skill to see which courses it came from. */
export function SkillsGained() {
  const [pick, setPick] = useState<Skill | null>(null);
  return (
    <section className="section skills" aria-labelledby="h-skills">
      <h2 id="h-skills" className="label muted">Skills gained · {skillCount}</h2>
      <p className="skills__lede">Gained through the courses and credentials above. Pick a skill to see where it came from.</p>
      <div className="skills__groups" onMouseLeave={() => setPick(null)}>
        {skillGroups.map((g) => (
          <div className="skills__group" key={g.key}>
            <h3 className="label accent">{g.label}</h3>
            <ul>
              {g.skills.map((s) => (
                <li key={s.name}>
                  <button
                    type="button"
                    className={`skill ${pick === s ? 'is-on' : ''}`}
                    aria-pressed={pick === s}
                    onMouseEnter={() => setPick(s)}
                    onFocus={() => setPick(s)}
                    onClick={() => setPick(pick === s ? null : s)}
                  >{s.name}</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="skills__from label" role="status" aria-live="polite">
        {pick ? <><span className="accent">{pick.name}</span> · from {pick.from.join(' · ')}</> : <span className="muted">Select a skill</span>}
      </p>
    </section>
  );
}
