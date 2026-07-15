import fs from "node:fs";
import vm from "node:vm";

const root = new URL("../", import.meta.url);
const pages = ["index.html", "career.html", "research.html", "education.html", "invest.html"];
const topics = new Set(["Career", "Research", "Education", "Invest"]);
const failures = [];

function read(path) {
  return fs.readFileSync(new URL(path, root), "utf8");
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}

const sandbox = { window: {} };
vm.runInNewContext(read("assets/data.js"), sandbox, { filename: "assets/data.js" });
const resources = sandbox.window.CLIMATE_LINKS;

assert(Array.isArray(resources), "assets/data.js must define window.CLIMATE_LINKS as an array");

if (Array.isArray(resources)) {
  const seenUrls = new Set();
  resources.forEach((resource, index) => {
    const label = `Resource ${index + 1}`;
    assert(typeof resource.title === "string" && resource.title.trim(), `${label} needs a title`);
    assert(typeof resource.summary === "string" && resource.summary.trim(), `${label} needs a summary`);
    assert(typeof resource.subtopic === "string" && resource.subtopic.trim(), `${label} needs a subtopic`);
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
}

pages.forEach((page) => {
  const html = read(page);
  ["main-content", "searchInput", "resultStatus", "content"].forEach((id) => {
    assert(html.includes(`id="${id}"`), `${page} is missing #${id}`);
  });
  assert(html.includes('src="assets/data.js"'), `${page} must load assets/data.js`);
  assert(html.includes('src="assets/page.js"'), `${page} must load assets/page.js`);
  assert(html.includes('rel="icon"'), `${page} must keep the site favicon`);
});

const renderer = read("assets/page.js");
assert(renderer.includes("s2/favicons"), "Resource-card favicons must remain enabled");
assert(renderer.includes("loading=\"lazy\""), "Resource-card favicons must be lazy-loaded");

if (failures.length) {
  console.error(`Site check failed with ${failures.length} problem${failures.length === 1 ? "" : "s"}:`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

const topicCounts = Object.fromEntries(
  [...topics].map((topic) => [topic, resources.filter((resource) => resource.topic === topic).length])
);
console.log(`Site check passed: ${resources.length} resources across ${topics.size} routes.`);
console.log(topicCounts);
