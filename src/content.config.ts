import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/*.md" }),
  schema: z.object({
    name: z.string(),
    status: z.string(),
    members: z.array(z.enum(["johnny", "andrew", "giuseppi"])),
    repo: z.string().optional(),
    demo: z.string().optional(),
  }),
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

export const collections = { projects, people };
