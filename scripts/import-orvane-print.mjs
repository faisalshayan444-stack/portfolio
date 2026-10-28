import fs from 'node:fs/promises';import path from 'node:path';import {createRequire} from 'node:module';
const require=createRequire('C:/Users/sabaf/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/check.cjs');const sharp=require('sharp');const root=path.resolve(import.meta.dirname,'..');
const source='D:/Designers/portfolio-designs/orvane-round-3/previews';
const a=await sharp(path.join(source,'ORVANE_Print_02_BusinessCard-1.jpg')).resize(800,444).toBuffer();const b=await sharp(path.join(source,'ORVANE_Print_02_BusinessCard-2.jpg')).resize(800,444).toBuffer();
await sharp({create:{width:1800,height:1200,channels:3,background:'#F4EFE8'}}).composite([{input:a,left:100,top:100},{input:b,left:900,top:650}]).jpeg({quality:96}).toFile(path.join(source,'ORVANE_BusinessCard_Pair.jpg'));
const files={'orvane-print-set':'ORVANE_Print_Set_Mockup.png','orvane-flyer':'ORVANE_Print_01_Flyer-1.jpg','orvane-cards':'ORVANE_BusinessCard_Pair.jpg','orvane-brochure-outside':'ORVANE_Print_03_Brochure-1.jpg','orvane-brochure-inside':'ORVANE_Print_03_Brochure-2.jpg'};
for(const[name,file]of Object.entries(files))await sharp(path.join(source,file)).resize({width:1800,withoutEnlargement:true}).webp({quality:92}).toFile(path.join(root,'assets/work',name+'.webp'));
const sizes={};for(const file of await fs.readdir(path.join(root,'assets/work'))){if(!file.endsWith('.webp'))continue;const m=await sharp(path.join(root,'assets/work',file)).metadata();sizes[file.slice(0,-5)]=[m.width,m.height]}
await fs.writeFile(path.join(root,'js/image-sizes.js'),'export const imageSizes = '+JSON.stringify(sizes,null,2)+';\n');console.log('Imported print mockup, flyer, cards, and both brochure sides.');
