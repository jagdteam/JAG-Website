import type { CollectionEntry } from "astro:content";

/** A project file in src/people/<name>/content/projects/ (see src/content.config.ts). */
export type Project = CollectionEntry<"memberProjects">["data"];
/** An experience file in src/people/<name>/content/experience/. */
export type Experience = CollectionEntry<"memberExperience">["data"];
export type Media = NonNullable<Project["media"]>[number];

export interface Link {
  label: string;
  href: string;
}

/** A project on a member's page: its file name, plus this member's role and part in it. */
export interface ProjectRef {
  local: string;
  role?: string;
  myPart?: string;
}

/** One About paragraph: plain text runs and links. */
export type Paragraph = (string | { text: string; href: string })[];

/** Everything on a member's page that is not a project or experience file: src/people/<name>/data.ts. */
export interface Profile {
  name: string;
  title: string;
  blurb: string[];
  about: Paragraph[];
  contactLine?: string;
  education: {
    school: string;
    logo?: string;
    degree?: string;
    gpa?: string;
    date: string;
    place: string;
  }[];
  skills: { label: string; list: string[] }[];
  contact: {
    email?: string;
    github: string;
    linkedin?: string;
    resume?: string;
  };
  projects: ProjectRef[];
  /** Image path; without one the page shows initials. */
  photo?: string;
}
