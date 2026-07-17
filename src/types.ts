export const topicOrder = ["Career", "Research", "Education", "Invest"] as const;

export type Topic = (typeof topicOrder)[number];

export interface Resource {
  title: string;
  url: string;
  topic: Topic;
  subtopic: string;
  date: string;
  summary: string;
}

export interface TopicConfig {
  page: string;
  action: string;
  title: string;
  description: string;
  shortDescription: string;
  panelLabel: string;
  panelDescription: string;
}

export type Theme = "light" | "dark";
