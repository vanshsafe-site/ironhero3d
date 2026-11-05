import { cp, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root=new URL('../',import.meta.url),output=new URL('dist/',root);
// Explicit public-file allowlist keeps tests and development files out of hosting.
await rm(output,{recursive:true,force:true});await mkdir(output,{recursive:true});
for(const entry of ['index.html','play.html','404.html','robots.txt','sitemap.xml','site.webmanifest','favicon.ico','favicon-16x16.png','favicon-32x32.png','apple-touch-icon.png','android-chrome-192x192.png','android-chrome-512x512.png','assets','styles','src','vendor','soundtrack.mp3','flying sound effect.mp3','blaster-sound-effect.mp3']){
 await cp(new URL(entry,root),new URL(entry,output),{recursive:true});
}
console.log('Static site ready: '+fileURLToPath(output));
