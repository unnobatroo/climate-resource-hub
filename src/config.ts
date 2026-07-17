import type { Topic, TopicConfig } from "./types";

export const GENERAL_CATEGORY = "General";

export const topicConfig: Record<Topic, TopicConfig> = {
  Career: {
    page: "career.html",
    action: "Work",
    title: "Find where to work on climate.",
    description: "Climate job boards, teams, and practical entry points into the transition.",
    shortDescription: "Jobs, teams, and pathways into climate work.",
    panelLabel: "Climate careers",
    panelDescription: "curated career resources"
  },
  Research: {
    page: "research.html",
    action: "Evidence",
    title: "Find climate data and research.",
    description: "Open datasets, models, policy tools, and scientific communities.",
    shortDescription: "Data, models, policy tools, and open science.",
    panelLabel: "Climate evidence",
    panelDescription: "curated research resources"
  },
  Education: {
    page: "education.html",
    action: "Learning",
    title: "Build practical climate knowledge.",
    description: "Courses, explainers, teaching material, and communities for learning.",
    shortDescription: "Courses, explainers, teaching resources, and communities.",
    panelLabel: "Climate education",
    panelDescription: "curated education resources"
  },
  Invest: {
    page: "invest.html",
    action: "Capital",
    title: "Find climate funding pathways.",
    description: "Funds and organizations moving capital toward climate solutions.",
    shortDescription: "Funds and organizations backing climate solutions.",
    panelLabel: "Climate capital",
    panelDescription: "curated funding resources"
  }
};
