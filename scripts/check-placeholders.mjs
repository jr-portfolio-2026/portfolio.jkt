// Content validator with two modes.
//
//   npm run check:content            TEMPLATE PREVIEW: lists everything that still looks like template content
//                                    and exits 0, so a generic demo can always be built and shown.
//   npm run build:release            CLIENT RELEASE: runs this with --strict; any open item stops the build.
//
// Always fatal (both modes): personal identity written into components instead of src/content.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const strict = process.argv.includes("--strict");
const contentDir = join(root, "src/content");

// Open items: each rule is a pattern that means "the owner has not decided this yet".
const rules = [
  [/REPLACE_ME/, "REPLACE_ME marker"],
  [/name: "Your Name"/, "default name"],
  [/example\.com/, "default email domain"],
  [/placeholder:\s*true/, "placeholder entry"],
  [/reviewed:\s*false/, "project wording not yet confirmed by the owner"],
  [/ogImage: ""/, "no link-preview image (ogImage)"],
  [/linkedin: ""/, "no LinkedIn link (hidden on the site)"],
  [/github: ""/, "no GitHub link (hidden on the site)"],
  [/logo: \{ src: ""/, "no approved logo (typographic mark in use)"],
  [/portrait: \{ src: ""/, "no portrait supplied (designated placeholder shown)"],
  [/Language claims|Languages are claims/, "language claims need the owner's confirmation"],
];

let open = 0;
for (const f of readdirSync(contentDir).filter((f) => f.endsWith(".ts"))) {
  readFileSync(join(contentDir, f), "utf8").split("\n").forEach((line, i) => {
    const isComment = /^\s*(\/\/|\*|\/\*)/.test(line);
    for (const [re, why] of rules) if (re.test(line) && (!isComment || /Language claims|Languages are claims/.test(re.source))) { open++; console.log(`open   src/content/${f}:${i + 1}  ${why}`); }
  });
}

// Fatal in every mode: identity values must come from content, never from JSX or route files.
const site = readFileSync(join(contentDir, "site.ts"), "utf8");
const literals = [site.match(/initials: "([^"]+)"/)?.[1], site.match(/name: "([^"]+)"/)?.[1], site.match(/email: "([^"]+)"/)?.[1]]
  .filter((v, i, a) => v && a.indexOf(v) === i && v !== "Your Name");
const hardcoded = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) { if (p !== contentDir) walk(p); continue; }
    if (!/\.(tsx?|css)$/.test(name) || name === "routeTree.gen.ts") continue;
    readFileSync(p, "utf8").split("\n").forEach((line, i) => {
      if (/^\s*(\/\/|\*|\/\*)/.test(line)) return; // comments may mention the template values
      for (const v of literals) if (line.includes(v)) hardcoded.push(`${p.replace(root + "/", "")}:${i + 1}  hard-coded identity "${v}"`);
    });
  }
};
walk(join(root, "src"));
hardcoded.forEach((h) => console.log(`FATAL  ${h}`));

const mode = strict ? "client release" : "template preview";
console.log(`\nMode: ${mode}. ${open} open item(s), ${hardcoded.length} hard-coded identity value(s).`);
if (hardcoded.length) process.exit(1);
if (open && strict) { console.log("Release refused: resolve the open items above."); process.exit(1); }
if (!open) console.log("No open items.");
