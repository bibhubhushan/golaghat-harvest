import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

const sourceUrl = process.env.PAGES_SOURCE_URL || "http://127.0.0.1:3000";
const repository = process.env.GITHUB_REPOSITORY?.split("/")[1] || "golaghat-harvest";
const basePath = `/${repository}`;
const publicOrigin = process.env.PAGES_PUBLIC_ORIGIN || `https://bibhubhushan.github.io${basePath}`;
const outputDirectory = "pages-dist";

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });
await cp("dist/client", outputDirectory, { recursive: true });
await cp("scripts/pages-runtime.js", join(outputDirectory, "pages-runtime.js"));

const response = await fetch(sourceUrl);
if (!response.ok) {
  throw new Error(`Unable to render the homepage: ${response.status}`);
}

function rewriteForPages(content) {
  return content
    .replaceAll("/_next/", `${basePath}/_next/`)
    .replaceAll(sourceUrl, publicOrigin)
    .replaceAll("http://127.0.0.1:3000", publicOrigin)
    .replaceAll("https://127.0.0.1:3000", publicOrigin)
    .replaceAll("http://localhost:3000", publicOrigin)
    .replaceAll("https://localhost:3000", publicOrigin)
    .replaceAll("https://khumtai-market.utpalgogoiuk.chatgpt.site", publicOrigin);
}

let html = rewriteForPages(await response.text());
const staticMetadata = `
  <title>Assam Harvest — Assamese Produce, Pantry and Craft</title>
  <meta name="description" content="A bilingual marketplace for Assamese produce, pantry goods and handmade craft—connecting growers and makers with buyers." />
  <meta property="og:title" content="Assam Harvest — Food, Pantry and Craft from Assam" />
  <meta property="og:description" content="Fresh produce, pantry essentials and living craft—presented with clear origin and equal respect." />
  <meta property="og:image" content="${publicOrigin}/og-award.png" />
  <meta property="og:url" content="${publicOrigin}/" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
`;
html = html
  .replace(/<script(?:\s[^>]*)?>[\s\S]*?<\/script>/gi, "")
  .replace(/<link[^>]+rel="modulepreload"[^>]*>/gi, "")
  .replace("<head>", `<head>${staticMetadata}`)
  .replace(
    /<\/main>[\s\S]*?<\/body>/i,
    `</main><script src="${basePath}/pages-runtime.js" defer></script></body>`,
  );

await writeFile(join(outputDirectory, "index.html"), html);
await writeFile(join(outputDirectory, "404.html"), html);
await writeFile(join(outputDirectory, ".nojekyll"), "");

async function rewriteStaticAssets(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await rewriteStaticAssets(path);
    } else if (entry.name.endsWith(".css") || entry.name.endsWith(".js")) {
      await writeFile(path, rewriteForPages(await readFile(path, "utf8")));
    }
  }
}

await rewriteStaticAssets(join(outputDirectory, "_next"));

console.log(`GitHub Pages export created in ${outputDirectory}`);
