// Headless logic smoke test: actual Three.js scene graph, stubbed browser/WebGL I/O.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const threeContext={};vm.runInNewContext(fs.readFileSync(new URL('../vendor/three.min.js',import.meta.url),'utf8'),threeContext);const THREE=threeContext.THREE;
const elements=new Map();
const context=new Proxy({},{get:()=>()=>{}});
function element(id){if(!elements.has(id))elements.set(id,{id,style:{},value:'balanced',textContent:'',hidden:false,firstChild:{style:{}},classList:{toggle(){}},getContext:()=>context,addEventListener(){},querySelector:key=>element(id+key),querySelectorAll:()=>[],setAttribute(){},click(){return this.onclick?.();}});return elements.get(id);}
THREE.WebGLRenderer=class{constructor(){this.domElement=element('canvas');this.info={render:{}};}setPixelRatio(){}setSize(){}render(){}getRenderTarget(){return null;}getActiveCubeFace(){return 0;}getActiveMipmapLevel(){return 0;}setRenderTarget(){}};
THREE.CubeCamera.prototype.update=function(){};
globalThis.window={THREE};globalThis.THREE=THREE;globalThis.innerWidth=1280;globalThis.innerHeight=800;globalThis.devicePixelRatio=1;globalThis.matchMedia=()=>({matches:false});globalThis.localStorage={getItem(){return null;},setItem(){}};globalThis.document={body:{prepend(){},classList:{toggle(){}}},getElementById:element,createElement:()=>element('textureCanvas'),addEventListener(){},exitPointerLock(){}};globalThis.Audio=class{play(){return Promise.resolve();}};globalThis.addEventListener=()=>{};globalThis.requestAnimationFrame=()=>{};
let code=fs.readFileSync(new URL('../src/game.js',import.meta.url),'utf8');code=code.replace(/from "(\.\/[^\"]+)"/g,(_,path)=>`from "${new URL('../src/'+path.slice(2),import.meta.url).href}"`);code+='\nexport {S,bots,pb,spawnWave,spawnBoss,dmgBot,reset,update,fireRepulsor,hero,staticSolids};';
const game=await import('data:text/javascript,'+encodeURIComponent(code));
test('full wave / boss / next wave / restart flow',()=>{game.reset();game.S.mode='play';game.spawnWave();assert.equal(game.bots.length,20);for(const bot of game.bots.slice())game.dmgBot(bot,8);assert.equal(game.S.phase,'bossPending');game.spawnBoss();assert.equal(game.bots[0].hp,800);game.dmgBot(game.bots[0],800);assert.equal(game.S.phase,'complete');game.spawnWave();assert.equal(game.bots.length+game.S.remaining,40);for(let i=0;i<12;i++)game.update(.016);game.fireRepulsor();assert.ok(game.pb.length);game.S.qcd=6;game.reset();assert.equal(game.S.qcd,0);assert.equal(game.bots.length,0);assert.equal(game.pb.length,0);});
test('city collisions exclude sky bodies',()=>assert.ok(game.staticSolids.every(b=>b.y0>=-.01)));
test('hero has two animated firing points and hand thrusters',()=>{assert.equal(game.hero.userData.rig.muzzles.length,2);assert.equal(game.hero.userData.rig.handJets.length,2);});

test('repulsors consume energy only on successful shots and resume after recharge',()=>{
 game.reset();game.S.mode='play';game.S.en=3;
 game.fireRepulsor();assert.equal(game.S.en,1);assert.equal(game.pb.length,1);
 game.fireRepulsor();assert.equal(game.S.en,1);assert.equal(game.pb.length,1);
 game.S.cd=0;game.fireRepulsor();assert.equal(game.S.en,1);assert.equal(game.pb.length,1);
 game.update(.05);game.update(.05);game.update(.05);
 assert.ok(game.S.en>=2);const before=game.S.en,count=game.pb.length;
 game.fireRepulsor();assert.equal(game.S.en,before-2);assert.equal(game.pb.length,count+1);
 game.reset();
});
