import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('landing page is crawlable without executing game JavaScript',()=>{
 const html=read('index.html');assert.match(html,/<h1[^>]*>IRON HERO/);assert.match(html,/<main/);assert.match(html,/href="\/play.html"/);assert.match(html,/name="description"/);assert.match(html,/rel="canonical" href="https:\/\/ironhero3d.vercel.app\/"/);assert.doesNotMatch(html,/<canvas|src="src\/game.js"/);
 const scripts=[...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)];assert.equal(scripts.length,1);assert.match(scripts[0][1],/application\/ld\+json/);const schema=JSON.parse(scripts[0][2]);assert.equal(schema['@type'],'VideoGame');assert.equal(schema.offers.price,'0');
});
test('play page preserves every game DOM reference',()=>{
 const html=read('play.html'),ids=[...html.matchAll(/id="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);
 for(const file of ['src/game.js','src/systems/mobile.js','src/systems/audio.js','src/systems/settings.js'])for(const match of read(file).matchAll(/\$\('([^']+)'\)|getElementById\('([^']+)'\)/g))assert.ok(ids.includes(match[1]||match[2]),file+': '+match[0]);
 assert.match(html,/src="src\/game.js"/);assert.match(html,/<noscript>/);
});
test('crawler files and static hosting configuration point to production',()=>{
 assert.match(read('robots.txt'),/Sitemap: https:\/\/ironhero3d.vercel.app\/sitemap.xml/);assert.equal((read('sitemap.xml').match(/<loc>/g)||[]).length,2);assert.doesNotMatch(read('sitemap.xml'),/localhost|example.com/);
 const config=JSON.parse(read('vercel.json'));assert.equal(config.framework,null);assert.equal(config.outputDirectory,'dist');assert.equal(config.buildCommand,'npm run build');
});
