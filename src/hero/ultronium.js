import { buildBot } from './bot.js';
// Unique heavy armor overlays retain the articulated drone skeleton.
export function buildUltronium(){
 const T=window.THREE,root=buildBot(),r=root.userData.rig;
 const alloy=new T.MeshStandardMaterial({color:0x3c4656,metalness:.9,roughness:.24}),trim=new T.MeshStandardMaterial({color:0xa78b59,metalness:.85,roughness:.3});
 const geometry=new T.SphereGeometry(1,48,32);
 function armor(parent,x,y,z,sx,sy,sz,material=alloy){const m=new T.Mesh(geometry,material);m.position.set(x,y,z);m.scale.set(sx,sy,sz);parent.add(m);}
 for(const sign of [-1,1]){
 armor(r.body,sign*.36,.3,.08,.48,.48,.37);
 for(let i=0;i<4;i++)armor(r.body,sign*.42,-.05-i*.14,.25,.18,.055,.12,trim);
 const arm=r.arms[sign===-1?0:1];armor(arm,sign*.05,0,0,.44,.3,.39);armor(arm,0,-.32,0,.23,.28,.22);
 // Elbow assembly is the nested group beneath the shoulder.
 const elbow=arm.children.find(c=>c.isGroup);if(elbow){armor(elbow,0,-.24,0,.3,.31,.28);armor(elbow,0,-.53,0,.25,.22,.22);}
 armor(r.legs[sign===-1?0:1],0,-.25,0,.29,.33,.27);armor(r.legs[sign===-1?0:1],0,-.85,0,.25,.3,.26);
 for(let i=0;i<5;i++)armor(arm,sign*.27,-.12-i*.065,.19,.026,.026,.026,trim);
 }
 root.scale.set(5.8,6.2,5.8);root.name='Ultronium';return root;
}
