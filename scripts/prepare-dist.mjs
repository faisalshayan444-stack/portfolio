import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const dist=path.join(root,'dist');
await fs.mkdir(dist,{recursive:true});
for(const name of ['index.html','css','js','assets']) await fs.cp(path.join(root,name),path.join(dist,name),{recursive:true});
console.log('Static publish directory prepared: dist/');
