import fs from 'node:fs/promises';import path from 'node:path';import {createRequire} from 'node:module';
const require=createRequire('C:/Users/sabaf/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/check.cjs');const sharp=require('sharp');
const root=path.resolve(import.meta.dirname,'..');
const sources={
 'sevra-silk':'D:/Designers/portfolio-designs/fragrance-round-1/finals/Sevra_Social_03_Silk.png',
 'aurelle-light':'D:/Designers/portfolio-designs/fragrance-round-1/finals/Aurelle_Social_02_Light.png',
 'orvane-master':'D:/Designers/portfolio-designs/oud-noir-round-2/photography/main-bottle.png',
 'orvane-gift':'D:/Designers/portfolio-designs/oud-noir-round-2/photography/gift.png',
 'orvane-contents':'D:/Designers/portfolio-designs/oud-noir-round-2/photography/box.png',
 'orvane-ribbon':'D:/Designers/portfolio-designs/oud-noir-round-2/photography/ribbon-macro.png'
};
for(const[name,source]of Object.entries(sources))await sharp(source).webp({quality:92,alphaQuality:100}).toFile(path.join(root,'assets/work',name+'.webp'));
const dimensions={};for(const file of await fs.readdir(path.join(root,'assets/work'))){if(!file.endsWith('.webp'))continue;const m=await sharp(path.join(root,'assets/work',file)).metadata();dimensions[file.replace('.webp','')]=[m.width,m.height]}
await fs.writeFile(path.join(root,'js/image-sizes.js'),'export const imageSizes = '+JSON.stringify(dimensions,null,2)+';\n');
console.log('Imported all six selected images from clean originals, preserving native transparency.');
