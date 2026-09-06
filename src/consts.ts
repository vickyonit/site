import type { Site, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "Vignesh Rajendran",
  EMAIL: "vickyonit@gmail.com",
  NUM_POSTS_ON_HOMEPAGE: 5,
  NUM_WORKS_ON_HOMEPAGE: 3,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION:
    "Product founder building WhatsApp AI agents. Writing on handoffs, retries, latency, and trust in conversational systems.",
};

export const BLOG: Metadata = {
  TITLE: "Writing",
  DESCRIPTION:
    "Notes on shipping AI agents in production — escalation, reliability, latency, memory, and messaging primitives.",
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
