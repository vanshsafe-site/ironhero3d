// Articulated procedural armor. +Z faces forward; feet rest at Y=0.
export function buildHero() {
 const T=window.THREE, root=new T.Group(), body=new T.Group();root.add(body);
 const material=(color,metalness=.85,roughness=.28)=>new T.MeshStandardMaterial({color,metalness,roughness});
 const red=material(0x971c28),gold=material(0xd9a54b),dark=material(0x17212b),silver=material(0x667787);
 const glow=new T.MeshStandardMaterial({color:0xcaffff,emissive:0x39dfff,emissiveIntensity:2,metalness:.3,roughness:.18});
 const sphere=new T.SphereGeometry(1,48,32);
 function ell(parent,mat,x,y,z,sx,sy,sz){const m=new T.Mesh(sphere,mat);m.position.set(x,y,z);m.scale.set(sx,sy,sz);parent.add(m);return m;}
 function joint(parent,x,y,z){const g=new T.Group();g.position.set(x,y,z);parent.add(g);return g;}
 function ring(parent,x,y,z,r,mat){const m=new T.Mesh(new T.TorusGeometry(r,.018,12,48),mat);m.position.set(x,y,z);parent.add(m);return m;}
 function plate(parent,mat,points,depth,z){const shape=new T.Shape();points.forEach(([x,y],i)=>i?shape.lineTo(x,y):shape.moveTo(x,y));shape.closePath();const m=new T.Mesh(new T.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSegments:4,steps:1,bevelSize:.025,bevelThickness:.025,curveSegments:24}),mat);m.position.z=z;parent.add(m);return m;}
 // Raised collar, reactor retaining bolts, and overlapping rib armor.
 for(const side of [-1,1]){
 plate(body,gold,[[side*.12,2.06],[side*.39,2.05],[side*.45,1.99],[side*.16,1.99]],.025,.2);
 for(let n=0;n<4;n++)plate(body,red,[[side*.28,1.68-n*.1],[side*.41,1.72-n*.1],[side*.4,1.65-n*.1],[side*.29,1.61-n*.1]],.035,.17);
 for(let n=0;n<3;n++)ell(body,dark,side*.32,1.9-n*.045,.305,.085,.009,.012);
 }
 for(let n=0;n<8;n++){const a=n*Math.PI/4;ell(body,silver,Math.cos(a)*.145,1.84+Math.sin(a)*.145,.348,.012,.012,.012);}
 ring(body,0,1.84,.35,.083,silver);
 ell(body,dark,0,1.46,0,.4,.48,.23);
 ell(body,red,0,1.83,0,.51,.31,.27);
 for(const s of [-1,1]){
 plate(body,red,[[s*.05,1.94],[s*.42,2.02],[s*.5,1.8],[s*.25,1.69],[s*.07,1.75]],.08,.21);
 for(let i=0;i<3;i++)ell(body,gold,s*.29,1.56-i*.1,.12,.115,.055,.15);
 ell(body,red,s*.22,1.11,0,.23,.18,.24);
 for(let i=0;i<4;i++)ell(body,silver,s*.27,1.72+i*.055,-.245,.12,.012,.024);
 ell(body,red,s*.24,1.84,-.24,.19,.23,.1);
 }
 for(let i=0;i<3;i++)plate(body,i===2?gold:red,[[-.23,1.67-i*.15],[.23,1.67-i*.15],[.19,1.55-i*.15],[0,1.51-i*.15],[-.19,1.55-i*.15]],.06,.2);
 ring(body,0,1.84,.332,.125,gold);ell(body,glow,0,1.84,.34,.099,.099,.025);
 ell(body,dark,0,2.09,0,.115,.14,.12);
 const head=joint(body,0,2.25,0);ell(head,red,0,.05,0,.235,.29,.22);
 plate(head,gold,[[-.18,.22],[.18,.22],[.18,.03],[.12,-.17],[0,-.21],[-.12,-.17],[-.18,.03]],.035,.17);
 for(const s of [-1,1]){ell(head,glow,s*.09,.075,.221,.068,.018,.012);ell(head,silver,s*.225,.03,0,.027,.075,.075);}
 plate(head,dark,[[-.09,-.105],[.09,-.105],[.07,-.12],[-.07,-.12]],.008,.216);
 const arms=[],legs=[],jets=[],handJets=[],muzzles=[],palms=[];let muzzle;
 for(const s of [-1,1]){
 const arm=joint(body,s*.59,1.94,0);arms.push(arm);
 ell(arm,dark,0,-.06,0,.15,.16,.15);ell(arm,red,s*.045,0,0,.21,.17,.23);
 ell(arm,gold,0,-.27,0,.12,.23,.13);ell(arm,red,s*.045,-.25,0,.105,.19,.15);
 const elbow=joint(arm,0,-.46,0);arm.userData.elbow=elbow;ell(elbow,dark,0,0,0,.105,.11,.11);
 ell(elbow,red,0,-.2,0,.15,.21,.16);ell(elbow,gold,0,-.21,.142,.065,.14,.025);
 for(let n=0;n<3;n++){
 plate(elbow,red,[[-.12,-.07-n*.085],[.12,-.07-n*.085],[.1,-.13-n*.085],[-.1,-.13-n*.085]],.025,.14);
 ell(elbow,glow,.08,-.1-n*.055,.18,.012,.018,.009);
 }
 ring(arm,0,-.46,.105,.075,silver);
 const palm=joint(elbow,0,-.43,0);ell(palm,red,0,0,0,.12,.12,.075);
 ell(palm,glow,0,0,.077,.055,.055,.015);ring(palm,0,0,.084,.063,silver);
 for(let i=0;i<4;i++)ell(palm,gold,(i-1.5)*.049,-.11,.015,.022,.07,.035);
 ell(palm,red,s*.13,-.025,0,.04,.075,.045);
 for(let finger=0;finger<4;finger++)for(let knuckle=0;knuckle<2;knuckle++)ell(palm,red,(finger-1.5)*.049,-.08-knuckle*.06,.046,.022,.023,.018);
 const handJet=ell(palm,glow,0,-.03,.24,.045,.045,.18);handJet.visible=false;handJets.push(handJet);
 palms.push(palm);const emitter=joint(palm,0,0,.12);muzzles.push(emitter);if(s===1)muzzle=emitter;
 const leg=joint(body,s*.23,1.09,0);legs.push(leg);ell(leg,dark,0,-.06,0,.15,.16,.15);
 ell(leg,gold,0,-.24,0,.17,.26,.16);ell(leg,red,s*.04,-.22,.08,.14,.23,.13);
 const knee=joint(leg,0,-.49,0);leg.userData.knee=knee;ell(knee,dark,0,0,0,.125,.12,.13);ell(knee,red,0,0,.12,.145,.14,.08);
 ell(knee,red,0,-.24,0,.15,.25,.16);ell(knee,gold,0,-.23,.145,.06,.18,.025);
 ell(knee,red,0,-.48,.075,.17,.115,.26);
 plate(knee,red,[[-.12,-.09],[0,-.04],[.12,-.09],[.09,-.36],[0,-.43],[-.09,-.36]],.035,.16);
 for(let n=0;n<3;n++)ell(knee,silver,0,-.44+n*.045,.24,.09,.012,.018);
 ring(knee,0,0,.197,.065,gold);
 const jet=ell(knee,glow,0,-.59,0,.08,.25,.08);jets.push(jet);jet.visible=false;
 }
 root.userData.rig={body,head,arms,legs,jets,handJets,muzzle,muzzles,palms,shotTimers:[0,0],nextHand:0,time:0};
 // Taller silhouette, with the feet still anchored at ground level.
 root.scale.y=1.15;root.rotation.order='YXZ';return root;
}
