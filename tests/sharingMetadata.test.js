import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const publicUrl = 'https://crm-demo-frontend-ivory.vercel.app/';
const html = await readFile(new URL('index.html', root), 'utf8');
const meta = (key) => {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const matches = [...html.matchAll(new RegExp(`<meta\\s+(?:name|property)="${escaped}"\\s+content="([^"]*)"\\s*\\/>`, 'g'))];
  assert.equal(matches.length, 1, `One static ${key} tag`);
  return matches[0][1];
};

test('public sharing metadata is static, Spanish and canonical', () => {
  assert.match(html, /<html lang="es-MX">/);
  assert.match(html, /<title>Aurelia Estates — Demo de CRM inmobiliario<\/title>/);
  assert.ok(meta('description').includes('demo'));
  assert.match(html, new RegExp(`<link rel="canonical" href="${publicUrl}"`));
  assert.equal(meta('robots'), 'index, follow');
  assert.equal(meta('og:type'), 'website');
  assert.equal(meta('og:site_name'), 'Aurelia Estates');
  assert.equal(meta('og:locale'), 'es_MX');
  assert.equal(meta('og:url'), publicUrl);
  assert.equal(meta('og:title'), meta('twitter:title'));
  assert.equal(meta('og:description'), meta('twitter:description'));
  assert.equal(meta('twitter:card'), 'summary_large_image');
  assert.equal(meta('og:image'), `${publicUrl}og-image.png`);
  assert.equal(meta('twitter:image'), meta('og:image'));
  assert.equal(meta('og:image:type'), 'image/png');
  assert.equal(meta('og:image:width'), '1200');
  assert.equal(meta('og:image:height'), '630');
  assert.ok(meta('og:image:alt').length > 20);
  assert.equal(meta('twitter:image:alt'), meta('og:image:alt'));
});

test('sharing image and linked app icons have their declared dimensions', async () => {
  for (const [name, size] of [['og-image.png', [1200, 630]], ['favicon-32.png', [32, 32]], ['apple-touch-icon.png', [180, 180]], ['icon-192.png', [192, 192]], ['icon-512.png', [512, 512]]]) {
    const image = await readFile(new URL(`public/${name}`, root));
    assert.equal(image.subarray(1, 4).toString(), 'PNG');
    assert.deepEqual([image.readUInt32BE(16), image.readUInt32BE(20)], size);
  }
  const manifest = JSON.parse(await readFile(new URL('public/site.webmanifest', root), 'utf8'));
  assert.equal(manifest.lang, 'es-MX');
  assert.equal(manifest.name, 'Aurelia Estates — Demo de CRM inmobiliario');
  for (const icon of manifest.icons) await readFile(new URL(`public${icon.src}`, root));
  for (const href of ['/favicon.svg', '/favicon-32.png', '/apple-touch-icon.png', '/site.webmanifest']) assert.ok(html.includes(`href="${href}"`));
});

test('crawler files and structured data describe only the public demo', async () => {
  const robots = await readFile(new URL('public/robots.txt', root), 'utf8');
  assert.ok(robots.includes(`Sitemap: ${publicUrl}sitemap.xml`));
  const sitemap = await readFile(new URL('public/sitemap.xml', root), 'utf8');
  assert.equal((sitemap.match(/<loc>/g) || []).length, 1);
  assert.ok(sitemap.includes(`<loc>${publicUrl}</loc>`));
  const json = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(json, 'Static JSON-LD');
  const data = JSON.parse(json[1]);
  assert.equal(data['@context'], 'https://schema.org');
  assert.deepEqual(data['@graph'].map((entry) => entry['@type']), ['WebSite', 'SoftwareApplication']);
  for (const entry of data['@graph']) {
    assert.equal(entry.url, publicUrl);
    assert.equal(entry.inLanguage, 'es-MX');
    assert.equal(entry.offers, undefined);
    assert.equal(entry.aggregateRating, undefined);
  }
});
