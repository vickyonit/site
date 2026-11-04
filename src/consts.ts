import type { Site, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "Vignesh Rajendran",
  EMAIL: "vickyonit@gmail.com",
  NUM_POSTS_ON_HOMEPAGE: 5,
  NUM_WORKS_ON_HOMEPAGE: 7,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION:
    "Co-founder at Peach, a WhatsApp business platform with AI agents. Building Dexy, an AI workspace runtime, since January 2025.",
};

export const BLOG: Metadata = {
  TITLE: "Writing",
  DESCRIPTION:
    "Notes from running AI agents in production: measuring them honestly, handing off to people, and the systems underneath.",
};

export const WORK: Metadata = {
  TITLE: "Work",
  DESCRIPTION: "Where I've built products and what I owned.",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION: "A collection of my projects, with links to repositories and demos.",
};

export const SOCIALS: Socials = [
  {
    NAME: "twitter-x",
    HREF: "https://twitter.com/vickyonit",
  },
  {
    NAME: "github",
    HREF: "https://github.com/vickyonit",
  },
  {
    NAME: "linkedin",
    HREF: "https://www.linkedin.com/in/vickyonit",
  },
];
