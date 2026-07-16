import fs from "node:fs";
import { resources } from "../src/data";
import { topicOrder } from "../src/types";

const root = new URL("../", import.meta.url);
const pages = ["index.html", "career.html", "research.html", "education.html", "invest.html"];
const topics = new Set(topicOrder);
const failures: string[] = [];

function read(path: string): string {
  return fs.readFileSync(new URL(path, root), "utf8");
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) failures.push(message);
}

const seenUrls = new Set<string>();

resources.forEach((resource, index) => {
  const label = `Resource ${index + 1}`;
  assert(resource.title.trim(), `${label} needs a title`);
  assert(resource.summary.trim(), `${label} needs a summary`);
  assert(resource.subtopic.trim(), `${label} needs a subtopic`);
  assert(topics.has(resource.topic), `${label} has an unknown topic: ${resource.topic}`);

  try {
    const parsed = new URL(resource.url);
    assert(["http:", "https:"].includes(parsed.protocol), `${label} must use an HTTP(S) URL`);
  } catch {
    failures.push(`${label} has an invalid URL: ${resource.url}`);
  }

  assert(!seenUrls.has(resource.url), `${label} duplicates this URL: ${resource.url}`);
  seenUrls.add(resource.url);
});

pages.forEach((page) => {
  const html = read(page);
  assert(html.includes('id="root"'), `${page} is missing #root`);
  assert(html.includes('src="/src/main.tsx"'), `${page} must load the React entrypoint`);
  assert(html.includes('rel="icon"'), `${page} must keep the site favicon`);
});

const card = read("src/components/ResourceCard.tsx");
const utilities = read("src/utils.ts");
assert(utilities.includes("s2/favicons"), "Resource-card favicons must remain enabled");
assert(card.includes('loading="lazy"'), "Resource-card favicons must be lazy-loaded");
assert(!card.includes("resource-source"), "Resource cards must not restore a visible URL row");

assert(fs.existsSync(new URL("public/CNAME", root)), "public/CNAME is required for the custom domain");
assert(fs.existsSync(new URL("public/.nojekyll", root)), "public/.nojekyll is required for GitHub Pages");

if (failures.length) {
  console.error(`Site check failed with ${failures.length} problem${failures.length === 1 ? "" : "s"}:`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

const topicCounts = Object.fromEntries(
  topicOrder.map((topic) => [topic, resources.filter((resource) => resource.topic === topic).length])
);

console.log(`Site check passed: ${resources.length} resources across ${topicOrder.length} routes.`);
console.log(topicCounts);
