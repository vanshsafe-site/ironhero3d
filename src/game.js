import { createSpatialIndex } from "./systems/spatial.js";
import { segmentBox, segmentSphere, waveSize } from "./systems/combat.js";
import { dressStreets } from "./systems/streets.js";
import { setupSettings } from "./systems/settings.js";
import { setupMobile } from "./systems/mobile.js";
import { buildUltronium } from "./hero/ultronium.js";
import { moveSolid, actorBounds } from "./systems/collision.js";
import { createCityLife } from "./systems/city-life.js";
import { createReflections } from "./systems/reflections.js";
import { detailCity, createImpacts } from "./systems/city-detail.js";
import { createAudio } from "./systems/audio.js";
import { createDayNight } from "./systems/day-night.js";
import { buildBot, animateBot } from "./hero/bot.js";
import { buildHero } from "./hero/model.js";
import { animateHero } from "./hero/animation.js";

const R=Math.random,rr=(a,b)=>a+R()*(b-a),cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z);
const $=id=>document.getElementById(id);
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.outputEncoding=THREE.sRGBEncoding;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
const settings=setupSettings(renderer);renderer.setSize(innerWidth,innerHeight);
document.body.prepend(renderer.domElement);
const scene=new THREE.Scene();scene.background=new THREE.Color(0x0a1024);scene.fog=new THREE.FogExp2(0x0a1024,.0038);
const cam=new THREE.PerspectiveCamera(70,innerWidth/innerHeight,.5,1600);
const hemisphere=new THREE.HemisphereLight(0x7a9cff,0x241830,1);scene.add(hemisphere);
const moon=new THREE.DirectionalLight(0xbcd0ff,.8);moon.position.set(-100,200,-80);scene.add(moon);
const cycleDayNight=createDayNight(scene,moon,hemisphere),audio=createAudio();
{const g=new THREE.BufferGeometry(),p=[];for(let i=0;i<700;i++){const a=R()*6.28,b=R()*1.4+.1;p.push(Math.cos(a)*Math.cos(b)*900,Math.sin(b)*900,Math.sin(a)*Math.cos(b)*900)}
g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));scene.add(new THREE.Points(g,new THREE.PointsMaterial({size:2.2,color:0xffffff,fog:false})))}
// ---------- City ----------
function winTex(){const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d');g.fillStyle='#10141f';g.fillRect(0,0,128,128);
for(let y=0;y<8;y++)for(let x=0;x<8;x++)if(R()<.55){g.fillStyle=R()<.8?'#ffd27a':'#9fd8ff';g.fillRect(x*16+3,y*16+4,10,8)}
const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t}
const wt=winTex();
const mats=[0x8a94a8,0x6b7589,0x9a8f86,0x5d6a80].map(c=>new THREE.MeshLambertMaterial({color:c,map:wt,emissive:0xffffff,emissiveMap:wt,emissiveIntensity:.8}));
const B=[];
function addB(x,z,w,d,h,mi){const g=new THREE.BoxGeometry(w,h,d),uv=g.attributes.uv;
 for(let i=0;i<uv.count;i++){const f=Math.floor(i/4),us=f<2?d/16:w/16;uv.setXY(i,uv.getX(i)*us,uv.getY(i)*h/20)}
 const m=new THREE.Mesh(g,mats[mi%4]);m.position.set(x,h/2,z);scene.add(m);B.push({x0:x-w/2,x1:x+w/2,z0:z-d/2,z1:z+d/2,h,mesh:m,baseMaterial:m.material,damage:0})}
const N=9,P=64,off=-(N-1)/2*P,LIM=N*P/2-6;
const road=new THREE.Mesh(new THREE.PlaneGeometry(800,800),new THREE.MeshLambertMaterial({color:0x14161c}));road.rotation.x=-Math.PI/2;scene.add(road);
const swMat=new THREE.MeshLambertMaterial({color:0x3a3d46}),treeMat=new THREE.MeshLambertMaterial({color:0x1f5a2c}),trunkMat=new THREE.MeshLambertMaterial({color:0x4a3220});
for(let i=0;i<N;i++)for(let j=0;j<N;j++){const cx=off+i*P,cz=off+j*P;
 const sw=new THREE.Mesh(new THREE.BoxGeometry(48,.4,48),swMat);sw.position.set(cx,.2,cz);scene.add(sw);
 if(i==4&&j==4){const pk=new THREE.Mesh(new THREE.PlaneGeometry(44,44),new THREE.MeshLambertMaterial({color:0x15381c}));pk.rotation.x=-Math.PI/2;pk.position.set(cx,.5,cz);scene.add(pk);
  for(let t=0;t<30;t++){const tx=cx+rr(-19,19),tz=cz+rr(-19,19),tr=new THREE.Mesh(new THREE.CylinderGeometry(.3,.4,3),trunkMat),tc=new THREE.Mesh(new THREE.SphereGeometry(2.8,20,16),treeMat);tr.position.set(tx,1.5,tz);tc.position.set(tx,6,tz);scene.add(tr,tc)}continue}
 const k=1-Math.hypot(i-4,j-4)/6.5;
 for(let a=0;a<2;a++)for(let b=0;b<2;b++){const x=cx+(a?11.5:-11.5),z=cz+(b?11.5:-11.5);
  if(i==5&&j==3&&!a&&!b){addB(x,z,20,20,90,1);addB(x,z,13,13,125,1);addB(x,z,6,6,150,1);
   const sp=new THREE.Mesh(new THREE.CylinderGeometry(.1,.6,35),new THREE.MeshBasicMaterial({color:0xff5555}));sp.position.set(x,167,z);scene.add(sp);B.push({x0:x-.6,x1:x+.6,z0:z-.6,z1:z+.6,h:180});continue}
  addB(x,z,rr(15,21),rr(15,21),rr(14,40)+R()*k*90,Math.floor(R()*4))}}
// Cache vertical bounds for hot-path ray / projectile queries.
for(const building of B){building.y0=0;building.y1=building.h;}
const staticSolids=[];
scene.updateMatrixWorld(true);
scene.traverse(o=>{if(o.isMesh&&o!==road&&o.material.fog!==false){const bounds=new THREE.Box3().setFromObject(o);staticSolids.push({x0:bounds.min.x,x1:bounds.max.x,y0:bounds.min.y,y1:bounds.max.y,z0:bounds.min.z,z1:bounds.max.z});}});
detailCity(scene,B);
const updateStreetLights=dressStreets(scene);
scene.updateMatrixWorld(true);
scene.traverse(o=>{if(o.isInstancedMesh&&!o.userData.decorative){o.geometry.computeBoundingBox();const matrix=new THREE.Matrix4();for(let i=0;i<o.count;i++){o.getMatrixAt(i,matrix);matrix.premultiply(o.matrixWorld);const b=o.geometry.boundingBox.clone().applyMatrix4(matrix);staticSolids.push({x0:b.min.x,x1:b.max.x,y0:b.min.y,y1:b.max.y,z0:b.min.z,z1:b.max.z});}}});
const nearbySolids=createSpatialIndex(staticSolids);
const updateReflections=createReflections(renderer,scene,B,settings);
const impacts=createImpacts(scene);
const updateCityLife=createCityLife(scene);
// ---------- Models ----------
const mk=(g,c,e)=>new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:c,metalness:.7,roughness:.35,emissive:e||0,emissiveIntensity:e?1.3:0}));
const bx=(w,h,d)=>new THREE.BoxGeometry(w,h,d);
const hero=buildHero();hero.rotation.y=Math.PI;scene.add(hero);
// ---------- State ----------
const S={phase:'bots',remaining:0,mode:'menu',hp:100,en:100,score:0,wave:0,wait:2,lastHit:0,fly:false,grounded:true,yaw:0,pitch:.1,cd:0,qcd:0,ecd:0};
const pos=hero.position.set(32,0,32),vel=V(),keys={};let mouseDown=false;
const bots=[],pb=[],eb=[],ms=[],fx=[],dronePool=[],bossPool=[];
const explosionGeometry=new THREE.SphereGeometry(1,16,12);
let hitTimer=0,bannerTimeout;
const boltG=new THREE.SphereGeometry(.25,6,6),pM=new THREE.MeshBasicMaterial({color:0x9ff6ff}),eM=new THREE.MeshBasicMaterial({color:0xff3030});
const fwd=()=>V(-Math.sin(S.yaw)*Math.cos(S.pitch),Math.sin(S.pitch),-Math.cos(S.yaw)*Math.cos(S.pitch));
function bolt(arr,mat,p,d,sp,dmg,life=3){const m=new THREE.Mesh(boltG,mat);m.scale.z=4;m.position.copy(p);scene.add(m);arr.push({m,v:d.clone().multiplyScalar(sp),life,dmg})}
function boom(p,s,c){if(fx.length>=80){const old=fx.shift();scene.remove(old.m);old.m.material.dispose();}const m=new THREE.Mesh(explosionGeometry,new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.9}));m.position.copy(p);scene.add(m);fx.push({m,t:0,s})}
function banner(t){const b=$('bn');b.textContent=t;b.style.opacity=1;clearTimeout(bannerTimeout);bannerTimeout=setTimeout(()=>b.style.opacity=0,2400)}
function spawnDrone(){
 const m=dronePool.pop()||buildBot(),target=B[Math.floor(R()*B.length)],a=R()*6.28;
 m.position.set(cl((target.x0+target.x1)/2+Math.cos(a)*32,-LIM,LIM),target.h+18,(target.z0+target.z1)/2+Math.sin(a)*32);
 for(const wall of B)if(m.position.x>wall.x0-4&&m.position.x<wall.x1+4&&m.position.z>wall.z0-4&&m.position.z<wall.z1+4)m.position.y=Math.max(m.position.y,wall.h+8);
 for(const other of bots)if(m.position.distanceTo(other.m.position)<8)m.position.y=other.m.position.y+8;
 scene.add(m);bots.push({m,hp:4,v:V(),cd:rr(2,5),str:R()<.5?1:-1,target,orbit:a,retarget:rr(8,16)});S.remaining--;
}
function spawnWave(){S.wave++;S.phase='bots';S.remaining=waveSize(S.wave);const total=S.remaining;
 while(bots.length<20&&S.remaining>0)spawnDrone();banner(`WAVE ${S.wave} — ${total} ULTRA BOTS`);S.hp=Math.min(100,S.hp+25);}
function spawnBoss(){S.phase='boss';const m=bossPool.pop()||buildUltronium(),hp=800*1.5**(S.wave-1);m.position.set(cl(pos.x+65,-LIM,LIM),200,cl(pos.z+65,-LIM,LIM));scene.add(m);
 bots.push({m,boss:true,hp,maxHp:hp,v:V(),cd:3,str:1,target:B[0],orbit:0,retarget:999});banner('ULTRONIUM — HEAVY ASSAULT');}
function botBounds(b){return b.boss?actorBounds(b.m,13,13,-14,14):actorBounds(b.m,1.5,1,-3.4,2.6);}
function hurt(d){if(S.mode!=='play')return;S.hp=Math.max(0,S.hp-d);S.lastHit=performance.now();$('fl').style.opacity=.8;setTimeout(()=>$('fl').style.opacity=0,120);if(S.hp<=0)end()}
function end(){settings.save(S.score);mouseDown=false;S.mode='over';$('restart-game').hidden=true;document.exitPointerLock&&document.exitPointerLock();$('ov').style.display='flex';$('ov').querySelector('h1').textContent='CITY FALLEN';
 $('ov').querySelector('p').textContent=`You reached wave ${S.wave} with ${S.score} points. The city needs a hero.`;$('gt').textContent='CLICK TO RETRY'}
function reset(){mouseDown=false;S.cd=0;impacts.reset();for(const b of B)if(b.ownMaterial){b.mesh.material.dispose();b.mesh.material=b.baseMaterial;b.ownMaterial=false;b.damage=0;}bots.forEach(b=>{if(!b.boss)dronePool.push(b.m);else bossPool.push(b.m);});fx.forEach(e=>e.m.material.dispose());bots.concat(pb,eb,ms,fx).forEach(o=>scene.remove(o.m));bots.length=pb.length=eb.length=ms.length=fx.length=0;
 for(const key of Object.keys(keys))keys[key]=0;hero.rotation.set(0,Math.PI,0);hero.userData.rig.shotTimers.fill(0);hitTimer=0;$('boss-hud').hidden=true;
 Object.assign(S,{qcd:0,ecd:0,lastHit:0,grounded:true,hp:100,en:100,score:0,wave:0,phase:'bots',remaining:0,wait:1.5,fly:false,yaw:0,pitch:.1});pos.set(32,0,32);vel.set(0,0,0)}
// ---------- Input ----------
addEventListener('keydown',e=>{keys[e.code]=1;if(S.mode!=='play')return;
 if(e.code==='KeyP'||e.code==='Escape'){pauseGame();return;}
 if(e.code==='KeyF'&&!e.repeat)S.fly=!S.fly;
 if(e.code==='Space'&&!S.grounded)S.fly=true;
 if(e.code==='Space'&&S.grounded&&!S.fly)vel.y=11;
 if(e.code==='KeyQ')missiles();if(e.code==='KeyE')nova();e.preventDefault&&['Space'].includes(e.code)&&e.preventDefault()});
addEventListener('keyup',e=>keys[e.code]=0);
addEventListener('mousedown',e=>{if(e.button===0&&S.mode==='play'&&e.target===renderer.domElement){mouseDown=true;fireRepulsor();}});
addEventListener('mouseup',e=>{if(e.button===0)mouseDown=false;});
addEventListener('blur',()=>mouseDown=false);
addEventListener('contextmenu',e=>e.preventDefault());
addEventListener('mousemove',e=>{if(S.mode!=='play'||!(document.pointerLockElement||e.buttons&2))return;
 S.yaw-=e.movementX*.0022;S.pitch=cl(S.pitch-e.movementY*.0022,-1.3,1.3)});
function pauseGame(){if(S.mode!=='play')return;mouseDown=false;for(const key of Object.keys(keys))keys[key]=0;S.mode='menu';$('ov').style.display='flex';$('ov').querySelector('h1').textContent='PAUSED';$('gt').textContent='RESUME GAME';$('restart-game').hidden=false;document.exitPointerLock?.();}
const mobileControls=setupMobile({state:S,keys,aim:(x,y)=>{if(S.mode==='play'){S.yaw-=x*.004;S.pitch=cl(S.pitch-y*.004,-1.3,1.3);}},fire:held=>{mouseDown=held;if(held)fireRepulsor();},pause:pauseGame});
$('gt').onclick=async()=>{audio.start();if(!await mobileControls.enter())return;if(S.mode==='over')reset();mobileControls.clear();S.mode='play';$('ov').style.display='none';if(!mobileControls.mobile)try{const request=renderer.domElement.requestPointerLock();request?.catch(()=>{});}catch(_){}};
$('restart-game').onclick=()=>{reset();$('gt').click();};
addEventListener('blur',pauseGame);
document.addEventListener('pointerlockchange',()=>{if(!mobileControls.mobile&&!document.pointerLockElement)pauseGame();});
addEventListener('resize',()=>{renderer.setSize(innerWidth,innerHeight);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()});
// ---------- Abilities ----------
const hand=index=>hero.userData.rig.muzzles[index].getWorldPosition(V());
function aimDir(from){
 const direction=cam.getWorldDirection(V()),end=cam.position.clone().addScaledVector(direction,450);let nearest=1;
 for(const b of B){const t=segmentBox(cam.position,end,b);if(t!==null)nearest=Math.min(nearest,t);}
 for(const b of bots){const t=segmentSphere(cam.position,end,b.m.position,b.boss?13:2.65);if(t!==null)nearest=Math.min(nearest,t);}
 return cam.position.clone().lerp(end,nearest).sub(from).normalize();
}
const REPULSOR_ENERGY_COST=2;
function fireRepulsor(){if(S.cd>0||S.en<REPULSOR_ENERGY_COST)return;S.en-=REPULSOR_ENERGY_COST;S.cd=.1;audio.blast();const rig=hero.userData.rig,index=rig.nextHand;rig.nextHand=1-index;rig.shotTimers[index]=.28;const h=hand(index);bolt(pb,pM,h,aimDir(h),150,8);pb[pb.length-1].m.scale.set(.5,.5,9);}
function missiles(){if(S.qcd>0||S.en<25||!bots.length)return;S.en-=25;S.qcd=1.2;
 const c=pos.clone().setY(pos.y+1.6),t=bots.slice().sort((a,b)=>a.m.position.distanceTo(c)-b.m.position.distanceTo(c)).slice(0,4);
 t.forEach((b,i)=>{const d=V(rr(-1,1),rr(.2,1),rr(-1,1)).normalize();bolt(ms,pM,c,d,45,60,5);ms[ms.length-1].t=b;ms[ms.length-1].m.scale.set(1.5,1.5,5)})}
function nova(){if(S.ecd>0||S.en<40)return;S.en-=40;S.ecd=6;const c=pos.clone().setY(pos.y+1.5);boom(c,45,0x38e8ff);
 for(const b of bots.slice())if(b.m.position.distanceTo(c)<45)dmgBot(b,80);
 for(let i=eb.length-1;i>=0;i--)if(eb[i].m.position.distanceTo(c)<45){scene.remove(eb[i].m);eb.splice(i,1)}}
function dmgBot(b,d){if(!bots.includes(b))return;hitTimer=.15;b.hp-=d;boom(b.m.position,2,0xffaa33);if(b.hp<=0){const i=bots.indexOf(b);if(i<0)return;boom(b.m.position,7,0xff6a20);scene.remove(b.m);if(!b.boss)dronePool.push(b.m);else{bossPool.push(b.m);S.hp=Math.min(100,S.hp+35);S.en=100;}bots.splice(i,1);S.score+=b.boss?2000:100;
 if(!bots.length&&S.remaining===0){S.wait=3;S.phase=b.boss?'complete':'bossPending';banner(b.boss?'ULTRONIUM DEFEATED':'ULTRONIUM APPROACHING')}}}
// ---------- Update ----------
const rc=$('radar').getContext('2d');
function update(dt){
 const f=fwd(),fh=V(f.x,0,f.z).normalize(),rt=V(Math.cos(S.yaw),0,-Math.sin(S.yaw));
 let mv=V();if(keys.KeyW)mv.add(S.fly?f:fh);if(keys.KeyS)mv.sub(S.fly?f:fh);if(keys.KeyD)mv.add(rt);if(keys.KeyA)mv.sub(rt);
 if(keys.ArrowLeft)S.yaw+=dt*2;if(keys.ArrowRight)S.yaw-=dt*2;if(keys.ArrowUp)S.pitch=Math.min(1.3,S.pitch+dt*1.5);if(keys.ArrowDown)S.pitch=Math.max(-1.3,S.pitch-dt*1.5);
 let sp=S.fly?42:13;const boost=keys.ShiftLeft&&S.en>0&&mv.lengthSq()>0;if(boost){sp*=S.fly?2.2:1.6;S.en-=20*dt}
 mv.normalize().multiplyScalar(sp);
 if(S.fly){if(keys.Space)mv.y+=24;if(keys.KeyC)mv.y-=24;vel.lerp(mv,1-Math.exp(-4*dt))}
 else{vel.x+=(mv.x-vel.x)*(1-Math.exp(-9*dt));vel.z+=(mv.z-vel.z)*(1-Math.exp(-9*dt));vel.y-=30*dt}
 updateCityLife(dt,bots);
 const solids=nearbySolids(pos).concat(updateCityLife.colliders().map(c=>actorBounds(c.object,c.halfX,c.halfZ,c.bottom,c.top)),bots.map(botBounds));
 S.grounded=moveSolid(pos,vel,dt,solids);
 pos.x=cl(pos.x,-LIM,LIM);pos.z=cl(pos.z,-LIM,LIM);pos.y=Math.min(pos.y,230);
 if(S.grounded&&S.fly&&!keys.Space&&vel.y<=0.1&&pos.y<=.01||S.grounded&&S.fly&&!keys.Space&&pos.y>1)S.fly=false;
 S.en=cl(S.en+(boost?0:9)*dt,0,100);
 S.hp=Math.min(100,S.hp+(performance.now()-S.lastHit>3000?3:1)*dt);
 S.cd-=dt;S.qcd-=dt;S.ecd-=dt;
 $('weapon-status').textContent=S.en<REPULSOR_ENERGY_COST?'LOW ARC ENERGY · RECHARGING':mouseDown?'REPULSOR STREAM':'REPULSOR READY';
 
 // Match the control heading so forward movement and armor facing agree.
 hero.rotation.y=S.yaw+Math.PI;
 hero.rotation.x+=((S.fly?THREE.MathUtils.degToRad(80)*cl(Math.hypot(vel.x,vel.z)/25,0,1):0)-hero.rotation.x)*(1-Math.exp(-4*dt));
 animateHero(hero,dt,{speed:Math.hypot(vel.x,vel.z),fly:S.fly,grounded:S.grounded,boost,vertical:vel.y,turn:S.yaw,strafe:(keys.KeyD?1:0)-(keys.KeyA?1:0),firing:mouseDown,nova:S.ecd>5.4,missiles:S.qcd>.8,hit:performance.now()-S.lastHit<220});
 // camera
 const head=pos.clone().setY(pos.y+2.53);cam.position.copy(head).addScaledVector(f,-9).addScaledVector(rt,1.6).add(V(0,1,0));if(cam.position.y<1)cam.position.y=1;
 
 // Pull the camera in before it crosses a building wall.
 const desired=cam.position.clone();let cameraFraction=1;
 for(const b of B){const t=segmentBox(head,desired,b,.3);if(t!==null)cameraFraction=Math.min(cameraFraction,Math.max(.08,t-.03));}
 cam.position.copy(head).lerp(desired,cameraFraction);
 cam.fov+=( (boost&&S.fly?79:70)-cam.fov)*(1-Math.exp(-4*dt));cam.updateProjectionMatrix();
 cam.lookAt(head.clone().addScaledVector(f,25).addScaledVector(rt,1.2));
 if(mouseDown)fireRepulsor();
 // waves
 if(S.phase==='bots')while(S.remaining>0&&bots.length<20)spawnDrone();
 if(!bots.length){S.wait-=dt;if(S.wait<=0){if(S.phase==='bossPending')spawnBoss();else spawnWave();S.wait=99}}
 const hc=V(pos.x,pos.y+1.84,pos.z);
 // bots
 for(const b of bots){
  const p=b.m.position;b.retarget-=dt;
  if(b.retarget<=0){b.target=B[Math.floor(R()*B.length)];b.retarget=rr(10,18);}
  const q=b.target,cx=(q.x0+q.x1)/2,cz=(q.z0+q.z1)/2;
  b.orbit+=dt*.3*b.str;
  const destination=V(cx+Math.cos(b.orbit)*32,q.h+12+Math.sin(b.orbit)*7,cz+Math.sin(b.orbit)*32);
  if(b.boss)destination.set(cl(pos.x+Math.cos(b.orbit)*55,-LIM+20,LIM-20),Math.max(70,pos.y+20),cl(pos.z+Math.sin(b.orbit)*55,-LIM+20,LIM-20));
  const tv=destination.sub(p);const speed=(b.boss?14:18)*Math.min(1.8,1+(S.wave-1)*.08);if(tv.length()>speed)tv.setLength(speed);
  for(const other of bots)if(other!==b){const away=p.clone().sub(other.m.position),distance=away.length();if(distance<8&&distance>.01)tv.addScaledVector(away,(8-distance)/distance*2);}
  b.v.lerp(tv,1-Math.exp(-2*dt));p.addScaledVector(b.v,dt);
  const clearance=b.boss?16:4;for(const wall of B)if(p.x>wall.x0-clearance&&p.x<wall.x1+clearance&&p.z>wall.z0-clearance&&p.z<wall.z1+clearance&&p.y<wall.h+clearance)p.y=wall.h+clearance;
  const target=V(cx,q.h*.65,cz);// Face the travel heading; aiming remains independent of the flight pose.
  b.m.rotation.order='YXZ';
  const horizontalSpeed=Math.hypot(b.v.x,b.v.z);
  if(horizontalSpeed>.5){const heading=Math.atan2(b.v.x,b.v.z),difference=Math.atan2(Math.sin(heading-b.m.rotation.y),Math.cos(heading-b.m.rotation.y));b.m.rotation.y+=difference*(1-Math.exp(-5*dt));}
  b.m.rotation.x+=(THREE.MathUtils.degToRad(80)*cl(horizontalSpeed/10,0,1)-b.m.rotation.x)*(1-Math.exp(-4*dt));
  animateBot(b.m,performance.now()/1000,b.v.length());b.cd-=dt;
  if(b.cd<=0){b.cd=(b.boss?1.8:rr(2.8,5))/Math.min(2,1+(S.wave-1)*.12);const attackHero=b.boss||p.distanceTo(hc)<65&&R()<.15;
   if(attackHero)target.copy(hc).add(V(rr(-12,12),rr(-7,7),rr(-12,12)));
   const origin=p.clone().add(V(0,.5,0));bolt(eb,eM,origin,target.sub(origin).normalize(),b.boss?48:38,(b.boss?12:3)*Math.min(2,1+(S.wave-1)*.1),8);
  }
 }
 impacts.update(dt);
 // Resolve moving bots against the hero after their movement too.
 moveSolid(pos,vel,0,bots.map(botBounds));
 // Continuous collision: choose the nearest wall or target along each shot.
 for(const [list,friendly,missile] of [[pb,true,false],[ms,true,true],[eb,false,false]]){
  for(let i=list.length-1;i>=0;i--){const shot=list[i],start=shot.m.position.clone();shot.life-=dt;
   if(missile&&bots.includes(shot.t))shot.v.lerp(shot.t.m.position.clone().sub(start).normalize().multiplyScalar(70),1-Math.exp(-5*dt));
   const end=start.clone().addScaledVector(shot.v,dt);let fraction=1,wall=null,victim=null,hit=false;
   for(const building of B){const t=segmentBox(start,end,building);if(t!==null&&t<=fraction){fraction=t;wall=building;victim=null;hit=true;}}
   if(friendly){for(const enemy of bots){const t=segmentSphere(start,end,enemy.m.position,enemy.boss?13:2.65);if(t!==null&&t<fraction){fraction=t;victim=enemy;wall=null;hit=true;}}}
   else{const t=segmentSphere(start,end,hc,1.35);if(t!==null&&t<fraction){fraction=t;victim='hero';wall=null;hit=true;}}
   shot.m.position.copy(start).lerp(end,fraction);shot.m.lookAt(shot.m.position.clone().add(shot.v));
   if(hit){const impact=shot.m.position;impacts.burst(impact);boom(impact,missile?7:2,friendly?0x73eaff:0xff9b32);
    if(victim==='hero')hurt(shot.dmg);else if(victim){if(missile){for(const enemy of bots.slice())if(enemy.m.position.distanceTo(impact)<(enemy.boss?22:9))dmgBot(enemy,shot.dmg);}else dmgBot(victim,shot.dmg);}
    if(wall?.mesh&&!friendly){wall.damage=Math.min(1,wall.damage+.08);if(!wall.ownMaterial){wall.mesh.material=wall.baseMaterial.clone();wall.ownMaterial=true;}wall.mesh.material.color.copy(wall.baseMaterial.color).multiplyScalar(1-wall.damage*.7);wall.mesh.material.emissiveIntensity=.8*(1-wall.damage);}
   }
   if(hit||shot.life<=0||end.y<0){scene.remove(shot.m);list.splice(i,1);}
  }
 }
 for(let i=fx.length-1;i>=0;i--){const e=fx[i];e.t+=dt*2.2;e.m.scale.setScalar(.3+e.s*e.t);e.m.material.opacity=Math.max(0,.9-e.t);if(e.t>=1){scene.remove(e.m);e.m.material.dispose();fx.splice(i,1);}}
 hitTimer=Math.max(0,hitTimer-dt);$('hit-marker').style.opacity=hitTimer>0?1:0;
 $('mission-status').textContent=S.phase==='boss'?'OBJECTIVE / DEFEAT ULTRONIUM':S.phase==='bossPending'?'WARNING / ULTRONIUM INBOUND':S.phase==='complete'?'SECTOR SECURED / NEXT WAVE IN '+Math.ceil(S.wait)+'s':'OBJECTIVE / CLEAR THE SKYLINE';
 $('ability-status').textContent='MISSILES / '+(S.qcd>0?S.qcd.toFixed(1)+'s':S.en<25?'LOW ENERGY':'READY')+'  ·  NOVA / '+(S.ecd>0?S.ecd.toFixed(1)+'s':S.en<40?'LOW ENERGY':'READY')+'\nALT '+Math.round(pos.y)+' m  ·  SPEED '+Math.round(vel.length()*3.6)+' km/h';
 settings.save(S.score);
 // HUD
 $('hp').firstChild.style.width=cl(S.hp,0,100)+'%';$('en').firstChild.style.width=S.en+'%';$('wv').textContent=S.wave;$('sc').textContent=S.score;$('ec').textContent=bots.filter(b=>!b.boss).length+S.remaining;
 const targetEnemy=bots.reduce((nearest,b)=>!nearest||b.m.position.distanceToSquared(pos)<nearest.m.position.distanceToSquared(pos)?b:nearest,null);
 const marker=$('target-marker');marker.hidden=!targetEnemy;
 if(targetEnemy){const projected=targetEnemy.m.position.clone().project(cam),inFront=targetEnemy.m.position.clone().sub(cam.position).dot(cam.getWorldDirection(V()))>0;const x=inFront?cl(projected.x,-.85,.85):-Math.sign(projected.x||1)*.85,y=inFront?cl(projected.y,-.65,.65):0;
 marker.style.left=(50+x*50)+'%';marker.style.top=(50-y*50)+'%';marker.textContent=(targetEnemy.boss?'ULTRONIUM':'ULTRA BOT')+' · '+Math.round(targetEnemy.m.position.distanceTo(pos))+' m';}
 const boss=bots.find(b=>b.boss);$('boss-hud').hidden=!boss;if(boss){$('boss-fill').style.width=Math.max(0,boss.hp/boss.maxHp*100)+'%';$('boss-health').textContent=Math.ceil(boss.hp)+' / '+Math.ceil(boss.maxHp)+(boss.cd<.7?' · INCOMING FIRE':'');}
 rc.clearRect(0,0,140,140);rc.strokeStyle='#38e8ff55';rc.beginPath();rc.arc(70,70,35,0,6.3);rc.moveTo(70,0);rc.lineTo(70,140);rc.moveTo(0,70);rc.lineTo(140,70);rc.stroke();
 rc.fillStyle='#ff4040';for(const b of bots){const rx=b.m.position.x-pos.x,rz=b.m.position.z-pos.z,x=rx*rt.x+rz*rt.z,y=-(rx*fh.x+rz*fh.z),k=70/180,px=70+x*k,py=70+y*k;
  if(Math.hypot(px-70,py-70)<66)rc.fillRect(px-2,py-2,4,4)}
 rc.fillStyle='#38e8ff';rc.beginPath();rc.moveTo(70,63);rc.lineTo(75,76);rc.lineTo(65,76);rc.fill()}
let last=performance.now();
(function loop(){requestAnimationFrame(loop);const n=performance.now(),dt=Math.min(.05,(n-last)/1000);last=n;const daylight=cycleDayNight(dt);updateStreetLights(daylight);audio.update(S.mode==='play'&&S.fly,!!keys.ShiftLeft);if(S.mode==='play')update(dt);
 else if(S.wave===0){const orbit=n*.00008;cam.position.set(pos.x+Math.sin(orbit)*7,3.4,pos.z+Math.cos(orbit)*7);cam.lookAt(pos.x,1.5,pos.z)}updateReflections(dt,pos);renderer.render(scene,cam)})();
