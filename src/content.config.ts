import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const media = z.array(
  z.object({
    src: z.string(),
    alt: z.string(),
    poster: z.string().optional(),
    kind: z.enum(["image", "gif", "video"]),
  }),
);
const link = z.object({ href: z.string(), label: z.string() });

// Fields every project file has, on the team page and on member pages.
const projectFields = {
  name: z.string(),
  status: z.string(),
  order: z.number(),
  oneLiner: z.string(),
  tags: z.array(z.string()),
  description: z.string().optional(),
  thumb: z.string().optional(),
  thumbFit: z.enum(["cover", "contain"]).optional(),
  media: media.optional(),
  explore: link.optional(),
  repo: z.url().optional(),
  demo: z.url().optional(),
  draft: z.boolean().optional(),
};

const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/*.md" }),
  schema: z.object({ ...projectFields, team: z.array(z.string()) }),
});

const people = defineCollection({
  loader: glob({ base: "./src/content/people", pattern: "**/*.md" }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    github: z.string(),
    photo: z.string(),
  }),
});

// Each member's own copies, in src/people/<name>/content/<kind>/<file>.md.
// Entry ids are "<name>/<file>", e.g. "johnny/clutch".
const memberContent = (kind: "projects" | "experience") =>
  glob({
    base: "./src/people",
    pattern: `*/content/${kind}/*.md`,
    generateId: ({ entry }) => entry.replace(`/content/${kind}/`, "/").replace(/\.md$/, ""),
  });

const memberProjects = defineCollection({
  loader: memberContent("projects"),
  schema: z.object({
    ...projectFields,
    team: z.union([z.array(z.string()), z.literal("solo")]),
    // Still frame shown instead of an animated thumb under reduced motion.
    thumbStill: z.string().optional(),
  }),
});

const memberExperience = defineCollection({
  loader: memberContent("experience"),
  schema: z.object({
    company: z.string(),
    // A product shown in the side panel from this entry (BeesEye on Giuseppi's page).
    product: z.string().optional(),
    showcase: z
      .object({
        id: z.string(),
        status: z.string().optional(),
        description: z.string(),
        tags: z.array(z.string()),
        links: z.array(link),
        media,
      })
      .optional(),
    logo: z.string().optional(),
    place: z.string(),
    start: z.string(),
    end: z.string(),
    order: z.number(),
    roles: z.array(
      z.object({
        title: z.string(),
        start: z.string(),
        end: z.string(),
        summary: z.string(),
        stack: z.array(z.string()),
        bullets: z.array(z.string()),
      }),
    ),
  }),
});

export const collections = { projects, people, memberProjects, memberExperience };
