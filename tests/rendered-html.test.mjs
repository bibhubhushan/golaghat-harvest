import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the complete Assam Harvest marketplace", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Assam Harvest — Assamese Produce, Pantry and Craft/);
  assert.match(html, /Fresh from/);
  assert.match(html, /অসমৰ বজাৰ/);
  assert.match(html, /খাদ্যৰ ভাষা/);
  assert.match(html, /Minimum order: one 10 kg crate/);
  assert.match(html, /Handwoven Gamusa/);
  assert.equal((html.match(/class="product-card"/g) ?? []).length, 10);
  assert.doesNotMatch(html, /Khumtai|codex-preview|3D lemon/i);
});

test("includes a GitHub Pages deployment with subpath-safe assets", async () => {
  const [workflow, exporter, page, css] = await Promise.all([
    readFile(new URL("../.github/workflows/deploy-pages.yml", import.meta.url), "utf8"),
    readFile(new URL("../scripts/export-pages.mjs", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(workflow, /actions\/deploy-pages@v4/);
  assert.match(workflow, /actions\/upload-pages-artifact@v3/);
  assert.match(workflow, /pages: write/);
  assert.match(exporter, /\/\_next\//);
  assert.match(exporter, /\.nojekyll/);
  assert.doesNotMatch(page, /src="\/images\//);
  assert.doesNotMatch(page, /image: "\/images\//);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(css, /mobileCinema|cardGlow|buttonShine/);
});
