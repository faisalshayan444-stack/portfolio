import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { projects } from '../js/portfolio.js';
import { imageSizes } from '../js/image-sizes.js';
const root=path.resolve(import.meta.dirname,'..');
assert.ok(projects.length>=11,'Includes selected fragrance and print projects');
assert.equal(new Set(projects.map(p=>p.id)).size,projects.length,'Unique project identifiers');
for(const p of projects){
  assert.ok(Array.isArray(p.gallery),`${p.title}: valid gallery`);
  for(const download of p.downloads || [])assert.ok(fs.existsSync(path.join(root,'assets/print',download.file)),`Missing PDF: ${download.file}`);
  for(const image of [p.cover,...p.gallery]){
    assert.ok(fs.existsSync(path.join(root,'assets/work',`${image}.webp`)),`Missing image: ${image}`);
    assert.ok(imageSizes[image]?.every(n=>n>0),`Missing dimensions: ${image}`);
  }
}
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)){
  const target=match[1]; if(/^(https?:|mailto:|data:)/.test(target))continue;
  assert.ok(fs.existsSync(path.join(root,target)),`Missing local resource: ${target}`);
}
for(const email of html.matchAll(/mailto:([^"<]+)/g))assert.equal(email[1],'faisalshayan444@gmail.com');
console.log(`Verified ${projects.length} projects, all gallery resources, image dimensions and contact destinations.`);
