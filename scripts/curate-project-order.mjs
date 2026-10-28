import fs from 'node:fs/promises';
import {projects} from '../js/portfolio.js';
// Keep the opening selection varied. New apparel work remains in its offline pack.
const order=['cloudline-campaign','studio-notes','campaign-review','cloudline-listing','orvane-print','cloudline-identity','rise-above','creator-edition','fragrance-editions','orvane','oud-noir','fresh-expression','noir-objects','noor-atelier'];
const byId=Object.fromEntries(projects.map(p=>[p.id,p]));
if(order.length!==projects.length||order.some(id=>!byId[id]))throw Error('Unexpected project inventory');
const file=new URL('../js/portfolio.js',import.meta.url),source=await fs.readFile(file,'utf8');
const start=source.indexOf('export const projects = ['),end=source.indexOf('\n];',start)+3;
await fs.writeFile(file,source.slice(0,start)+'export const projects = '+JSON.stringify(order.map(id=>byId[id]),null,2)+';'+source.slice(end));
console.log('Curated 14 projects; no new clothing imagery.');
