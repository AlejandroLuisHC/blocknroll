import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { JSDOM } from "jsdom";

const output = new URL("../dist/", import.meta.url);
const languages = ["es", "ca", "en"];
let origin;
for (const language of languages) {
  const file = language === "es" ? "index.html" : `${language}.html`;
  const html = await readFile(new URL(file, output), "utf8");
  const { document } = new JSDOM(html).window;
  const copy = JSON.parse(await readFile(new URL(`../src/i18n/locales/${language}.json`, import.meta.url), "utf8"));
  assert.equal(document.documentElement.lang, language, `${file}: document language`);
  assert.equal(document.title, copy.meta.title, `${file}: localized title`);
  assert.equal(document.querySelector('meta[name="description"]')?.content, copy.meta.description);
  assert.equal(document.querySelectorAll("h1").length, 1, `${file}: one H1`);
  assert.equal(document.querySelector("h1").textContent, `${copy.hero.headline} ${copy.hero.city}`);
  assert.ok(document.querySelector("#root").textContent.length > 2000, `${file}: content is present without JavaScript`);
  for (const id of ["services", "about", "gallery", "contact"]) assert.ok(document.getElementById(id));
  assert.equal(document.querySelectorAll(".training-faq details").length, 4);
  assert.equal(document.querySelectorAll("video").length, 0, `${file}: no videos loaded initially`);
  assert.equal(document.querySelectorAll('link[rel="canonical"]').length, 1);
  const canonical = document.querySelector('link[rel="canonical"]').href;
  origin ??= new URL(canonical).origin;
  assert.equal(canonical, origin + (language === "es" ? "/" : "/" + language));
  assert.equal(document.querySelector('meta[property="og:url"]').content, canonical);
  assert.equal(document.querySelector('meta[property="og:image"]').content, origin + "/club-social.jpg");
  assert.equal(document.querySelectorAll('link[rel="alternate"][hreflang]').length, 4);
  for (const other of [...languages, "x-default"]) {
    const href = origin + (other === "es" || other === "x-default" ? "/" : "/" + other);
    assert.equal(document.querySelector(`link[hreflang="${other}"]`)?.href, href);
  }
  for (const lang of languages) assert.ok(document.querySelector(`a[hreflang="${lang}"]`), "crawlable language links");
  const data = JSON.parse(document.getElementById("club-structured-data").textContent);
  assert.equal(data["@context"], "https://schema.org");
  const organization = data["@graph"].find((item) => item["@type"] === "SportsOrganization");
  assert.equal(organization.location.address.addressLocality, "Barcelona");
  assert.equal(organization.email, "blocknroll.bcnclub@gmail.com");
  assert.ok(!JSON.stringify(data).includes("aggregateRating"), "no invented reviews");
  assert.ok(!JSON.stringify(data).includes('"price"'), "runtime prices are not frozen in metadata");
  for (const element of document.querySelectorAll('img[src], source[srcset], script[src], link[rel="stylesheet"], link[rel="preload"]')) {
    const url = element.getAttribute("src") || element.getAttribute("srcset") || element.getAttribute("href");
    if (!url?.startsWith("/")) continue;
    assert.ok(!url.startsWith("/src/"), `${file}: source asset leaked into built HTML: ${url}`);
    await access(new URL(url.slice(1), output));
  }
  const robots = document.querySelector('meta[name="robots"]').content;
  assert.ok(robots.includes("follow"));
  if (process.env.VERCEL_ENV === "preview" || process.env.VITE_NOINDEX === "true") {
    assert.ok(robots.includes("noindex"), `${file}: staging builds must not be indexed`);
  }
  console.log(`${file}: prerendered content, localized metadata, canonical, hreflang, JSON-LD and assets OK (${robots}).`);
}

const sitemap = new JSDOM(await readFile(new URL("sitemap.xml", output), "utf8"), { contentType: "application/xml" }).window.document;
assert.deepEqual(Array.from(sitemap.querySelectorAll("loc"), (element) => element.textContent), [origin + "/", origin + "/ca", origin + "/en"]);
assert.ok((await readFile(new URL("robots.txt", output), "utf8")).includes(`Sitemap: ${origin}/sitemap.xml`));
const missing = new JSDOM(await readFile(new URL("404.html", output), "utf8")).window.document;
assert.ok(missing.querySelector('meta[name="robots"]').content.includes("noindex"));
assert.equal(missing.querySelector('link[rel="canonical"]'), null);
assert.match(missing.title, /404/);
console.log("sitemap.xml, robots.txt and the noindex 404 page OK.");
