// Lists everything that still looks like template content.
// `--strict` exits non-zero so a release build cannot ship placeholders.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const dir = "src/content";
const rules = [
  [/REPLACE_ME/, "REPLACE_ME marker"],
  [/name: "Your Name"/, "default name"],
  [/example\.com/, "default email domain"],
  [/placeholder:\s*true/, "placeholder entry"],
  [/ogImage: ""/, "no link-preview image (ogImage)"],
  [/linkedin: ""/, "no LinkedIn link (hidden on the site)"],
];
let found = 0;
for (const f of readdirSync(dir).filter((f) => f.endsWith(".ts"))) {
  readFileSync(join(dir, f), "utf8").split("\n").forEach((line, i) => {
    for (const [re, why] of rules) if (re.test(line)) { found++; console.log(`${join(dir, f)}:${i + 1}  ${why}`); }
  });
}
console.log(found ? `\n${found} item(s) still to fill before sharing.` : "No placeholders left.");
if (found && process.argv.includes("--strict")) process.exit(1);
