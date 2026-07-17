import { GENERAL_CATEGORY, topicConfig } from "./config";
import type { Resource, Topic } from "./types";
import { topicOrder } from "./types";

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function faviconOf(url: string): string {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostOf(url))}&sz=64`;
}

export function topicFromPath(pathname: string): Topic | null {
  const page = pathname.split("/").pop() || "index.html";
  return topicOrder.find((topic) => topicConfig[topic].page === page) ?? null;
}

export function sortResources(items: Resource[]): Resource[] {
  return [...items].sort((a, b) => a.title.localeCompare(b.title));
}

export function categoriesFor(items: Resource[], topic: Topic): string[] {
  return [...new Set(items.filter((resource) => resource.topic === topic).map((resource) => resource.subtopic))]
    .sort((a, b) => {
      if (a === GENERAL_CATEGORY) return -1;
      if (b === GENERAL_CATEGORY) return 1;
      return a.localeCompare(b);
    });
}

export function groupBySubtopic(items: Resource[]): Record<string, Resource[]> {
  return items.reduce<Record<string, Resource[]>>((groups, resource) => {
    (groups[resource.subtopic] ??= []).push(resource);
    return groups;
  }, {});
}

export function groupByTopic(items: Resource[]): Partial<Record<Topic, Resource[]>> {
  return items.reduce<Partial<Record<Topic, Resource[]>>>((groups, resource) => {
    (groups[resource.topic] ??= []).push(resource);
    return groups;
  }, {});
}

export function searchResources(items: Resource[], query: string): Resource[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return items;

  return items.filter((resource) => {
    const haystack = [
      resource.title,
      resource.topic,
      resource.subtopic,
      resource.summary,
      hostOf(resource.url)
    ].join(" ").toLowerCase();
    return words.every((word) => haystack.includes(word));
  });
}
