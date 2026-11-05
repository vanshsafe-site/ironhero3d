import { instanceActors } from "./instance-actors.js";
// Shared meshes keep the street population bounded and inexpensive to animate.
export function createCityLife(scene){
 const T=window.THREE,cars=[],people=[],box=new T.BoxGeometry(1,1,1),sphere=new T.SphereGeometry(1,20,14),wheel=new T.CylinderGeometry(1,1,1,24);
 const mat=c=>new T.MeshStandardMaterial({color:c,roughness:.48,metalness:.15});
 const rubber=mat(0x12151b),chrome=mat(0x9da6b3),glass=new T.MeshStandardMaterial({color:0x39647b,metalness:.7,roughness:.12}),skin=mat(0xc98c65),pants=mat(0x253447);
 const eyeWhite=mat(0xf4eee6),iris=mat(0x25313b),lips=mat(0x874c42);
 const skinTones=[0xc98c65,0x8c593e,0xe2b494,0x654433].map(mat),hairColors=[0x211b19,0x513629,0xb18a52,0x55545a].map(mat);
 const paints=[0xa92c32,0xdaa438,0x26536e,0xe2e5e8,0x454958].map(mat),shirts=[0x2e7d8c,0xac5141,0xd4b67b,0x67609b].map(mat);
 const lamp=new T.MeshBasicMaterial({color:0xffeab5}),rear=new T.MeshBasicMaterial({color:0xef3030});
 function mesh(parent,geo,m,x,y,z,sx,sy,sz){const o=new T.Mesh(geo,m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);parent.add(o);return o;}
 function group(parent,x,y,z){const o=new T.Group();o.position.set(x,y,z);parent.add(o);return o;}
 const lanes=[-224,-160,-96,-32,32,96,160,224];
 for(let i=0;i<40;i++){
  const car=new T.Group(),paint=paints[i%paints.length],wheels=[];
  mesh(car,box,paint,0,.8,0,2.1,.65,4.4);mesh(car,sphere,paint,0,.93,1.5,1.04,.35,.75);
  mesh(car,box,glass,0,1.35,-.25,1.85,.65,2.15);mesh(car,box,paint,0,1.72,-.25,1.95,.12,2.2);
  for(const side of [-1,1]){
   mesh(car,box,paint,side*.94,1.35,-.3,.09,.7,.12);mesh(car,box,paint,side*.94,1.35,.8,.09,.7,.13);
   mesh(car,box,paint,side*1.14,1.25,.65,.24,.18,.3);
   mesh(car,box,chrome,side*1.065,.96,-.2,.035,.06,.25);
   mesh(car,box,lamp,side*.7,.9,2.22,.5,.22,.04);mesh(car,box,rear,side*.7,.9,-2.22,.5,.22,.04);
   for(const z of [-1.4,1.4]){const tire=mesh(car,wheel,rubber,side*1.04,.48,z,.43,.25,.43);tire.rotation.z=Math.PI/2;wheels.push(tire);const hub=mesh(car,wheel,chrome,side*1.18,.48,z,.24,.025,.24);hub.rotation.z=Math.PI/2;}
  }
  mesh(car,box,chrome,0,.65,2.23,1,.18,.06);
  const axis=i%2,dir=i%4<2?1:-1,lane=lanes[Math.floor(i/2)%8]+dir*3;
  car.position.set(axis?lane:-275+i*14,0,axis?-275+i*14:lane);car.rotation.y=axis?(dir>0?0:Math.PI):(dir>0?Math.PI/2:-Math.PI/2);scene.add(car);
  cars.push({car,axis,dir,speed:8+(i%5),wheels});
 }
 for(let i=0;i<100;i++){
  const root=new T.Group(),body=group(root,0,.96,0),arms=[],legs=[];
  const complexion=skinTones[i%skinTones.length],hair=hairColors[i%hairColors.length];
  // Adult stature matches the hero's approximately 2.9-unit silhouette.
  root.scale.setScalar(1.5);
  mesh(body,sphere,shirts[i%4],0,.3,0,.22,.34,.14);mesh(body,sphere,complexion,0,.82,0,.15,.19,.15);
  mesh(body,sphere,complexion,0,.63,0,.065,.11,.065);
  for(const side of [-1,1]){
   mesh(body,sphere,complexion,side*.15,.81,0,.035,.055,.035);
   mesh(body,sphere,eyeWhite,side*.061,.85,.133,.036,.023,.015);
   mesh(body,sphere,iris,side*.061,.85,.146,.014,.017,.006);
   mesh(body,sphere,hair,side*.061,.889,.132,.04,.009,.012);
   mesh(body,sphere,hair,side*.135,.9,-.01,.025,.085,.105);
  }
  mesh(body,sphere,complexion,0,.807,.151,.025,.043,.035);
  mesh(body,sphere,lips,0,.754,.139,.047,.009,.01);
  mesh(body,sphere,complexion,0,.714,.09,.077,.035,.055);
  // Raised collar, buttons, and belt give clothing readable structure.
  mesh(body,box,pants,0,.055,.015,.39,.05,.25);
  for(let button=0;button<3;button++)mesh(body,sphere,chrome,0,.42-button*.1,.143,.012,.012,.008);
  mesh(body,sphere,hair,0,.955,-.025,.155,.095,.14);
  for(const s of [-1,1]){
   const arm=group(body,s*.26,.54,0);arms.push(arm);mesh(arm,sphere,shirts[i%4],0,-.16,0,.075,.2,.08);mesh(arm,sphere,complexion,0,-.37,.04,.06,.15,.06);
   const hand=group(arm,0,-.535,.04);
   mesh(hand,sphere,complexion,0,0,0,.055,.065,.032);
   for(let finger=0;finger<4;finger++){
    const length=finger===0||finger===3?.065:.08;
    mesh(hand,sphere,complexion,(finger-1.5)*.024,-.065,0,.011,length/2,.013);
    mesh(hand,sphere,complexion,(finger-1.5)*.024,-.065-length/2,.007,.011,.014,.013);
   }
   mesh(hand,sphere,complexion,s*.06,-.015,.018,.021,.045,.02).rotation.z=s*.5;
   const leg=group(body,s*.12,0,0);legs.push(leg);mesh(leg,sphere,pants,0,-.24,0,.09,.28,.1);mesh(leg,sphere,pants,0,-.62,0,.075,.23,.08);mesh(leg,sphere,rubber,0,-.83,.065,.09,.07,.16);
  }
  const axis=i%2,lane=lanes[Math.floor(i/2)%8]+(i%4<2?6.5:-6.5),dir=i%3?1:-1;
  root.position.set(axis?lane:-270+(i*37)%540,0,axis?-270+(i*37)%540:lane);scene.add(root);people.push({root,body,arms,legs,axis,dir,phase:i,panic:0});
 }
 const syncInstances=instanceActors(scene,[...cars.map(c=>c.car),...people.map(p=>p.root)]);syncInstances();
 let time=0;
 const update=(dt,bots)=>{time+=dt;
  for(const c of cars){const key=c.axis?'z':'x';c.car.position[key]+=c.dir*c.speed*dt;if(Math.abs(c.car.position[key])>285)c.car.position[key]=-Math.sign(c.car.position[key])*285;c.wheels.forEach(w=>w.rotation.x+=c.dir*c.speed*dt/.43);}
  for(const p of people){const key=p.axis?'z':'x';let threat=null,dist=45*45;
   for(const bot of bots){const d=p.root.position.distanceToSquared(bot.m.position);if(d<dist){dist=d;threat=bot.m.position;}}
   if(threat){p.panic=4;p.dir=p.root.position[key]>=threat[key]?1:-1;}else p.panic=Math.max(0,p.panic-dt);
   const speed=p.panic>0?5.8:2.3;p.root.position[key]+=p.dir*speed*dt;
   if(Math.abs(p.root.position[key])>280){p.root.position[key]=Math.sign(p.root.position[key])*280;p.dir*=-1;}
   p.root.rotation.y=p.axis?(p.dir>0?0:Math.PI):(p.dir>0?Math.PI/2:-Math.PI/2);
   const stride=Math.sin(time*(p.panic>0?15:8)+p.phase);p.body.position.y=.96+Math.abs(stride)*.055;p.body.rotation.x=p.panic>0?.16:0;
   p.arms.forEach((a,i)=>a.rotation.x=stride*(i?1:-1)*.9-(p.panic>0?.35:0));p.legs.forEach((l,i)=>l.rotation.x=stride*(i?-1:1)*.65);
  }
 syncInstances();
 };
 update.colliders=()=>[
  ...cars.map(c=>({object:c.car,halfX:c.axis?1.25:2.3,halfZ:c.axis?2.3:1.25,bottom:0,top:1.8})),
  ...people.map(p=>({object:p.root,halfX:.5,halfZ:.5,bottom:0,top:3}))
 ];
 return update;
}
