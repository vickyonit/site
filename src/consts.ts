import type { Site, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "Vignesh Rajendran",
  EMAIL: "vickyonit@gmail.com",
  NUM_POSTS_ON_HOMEPAGE: 5,
  NUM_WORKS_ON_HOMEPAGE: 4,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION:
    "Co-founder at Peach. Building Dexy since January 2025 — AI workspaces, playbooks, and MCP agent runtimes.",
};

export const BLOG: Metadata = {
  TITLE: "Writing",
  DESCRIPTION:
    "Notes from Peach and Dexy — playbooks, MCP, context budgets, WhatsApp retries, and why the two products stay separate.",
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
