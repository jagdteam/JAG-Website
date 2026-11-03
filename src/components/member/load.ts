import { getCollection, getEntry } from "astro:content";
import type { Profile } from "./types";

const profiles = import.meta.glob<{ profile: Profile }>("/src/people/*/data.ts", { eager: true });

/** Everything a member page shows, read from src/people/<person>/. */
export async function loadMember(person: string) {
  const profile = profiles[`/src/people/${person}/data.ts`]?.profile;
  if (!profile) throw new Error(`loadMember: no profile exported from src/people/${person}/data.ts`);

  const [projects, experience] = await Promise.all([
    Promise.all(
      profile.projects.map(async (ref) => {
        const entry = await getEntry("memberProjects", `${person}/${ref.local}`);
        if (!entry) {
          throw new Error(`profile.projects: "${ref.local}" is not in src/people/${person}/content/projects/`);
        }
        return { ...ref, project: entry.data };
      }),
    ),
    getCollection("memberExperience", (e) => e.id.startsWith(`${person}/`)),
  ]);

  return {
    profile,
    projects: projects.filter((p) => !p.project.draft),
    experience: experience.map((e) => e.data).sort((a, b) => a.order - b.order),
  };
}
