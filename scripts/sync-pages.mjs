import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, "dist");
const distHtml = join(dist, "app.html");
const pagesAssets = join(root, "assets");

rmSync(pagesAssets, { recursive: true, force: true });
mkdirSync(pagesAssets, { recursive: true });
cpSync(join(dist, "assets"), pagesAssets, { recursive: true });

const html = readFileSync(distHtml, "utf8").replaceAll("./assets/", "assets/");
writeFileSync(join(root, "index.html"), html);
writeFileSync(join(dist, "index.html"), html);
