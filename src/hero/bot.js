// Shared geometry and materials keep a full wave of armored drones affordable.
const T=window.THREE;
const mats={armor:new T.MeshStandardMaterial({color:0x8394a7,metalness:.9,roughness:.3}),dark:new T.MeshStandardMaterial({color:0x18212b,metalness:.8,roughness:.4}),edge:new T.MeshStandardMaterial({color:0xc5d1dc,metalness:.95,roughness:.22}),glow:new T.MeshStandardMaterial({color:0xff5533,emissive:0xff2108,emissiveIntensity:2})};
const sphere=new T.SphereGeometry(1,20,14),box=new T.BoxGeometry(1,1,1),ring=new T.TorusGeometry(1,.16,8,24);
function mesh(parent,geo,mat,x,y,z,sx,sy,sz){const m=new T.Mesh(geo,mats[mat]);m.position.set(x,y,z);m.scale.set(sx,sy,sz);parent.add(m);return m;}
const ell=(p,m,x,y,z,a,b,c)=>mesh(p,sphere,m,x,y,z,a,b,c);
const panel=(p,m,x,y,z,a,b,c)=>mesh(p,box,m,x,y,z,a,b,c);
function joint(p,x,y,z){const g=new T.Group();g.position.set(x,y,z);p.add(g);return g;}
export function buildBot(){
 const root=new T.Group(),body=joint(root,0,0,0),arms=[],legs=[],jets=[];
 ell(body,'dark',0,0,0,.47,.72,.28);
 ell(body,'armor',0,.28,0,.64,.47,.34);
 for(const s of [-1,1]){
 const chest=panel(body,'armor',s*.29,.32,.29,.49,.36,.16);chest.rotation.z=s*.22;
 panel(body,'edge',s*.31,.51,.36,.4,.045,.035).rotation.z=s*.22;
 for(let i=0;i<4;i++){panel(body,'dark',s*.35,.36-i*.07,.387,.2,.025,.025);ell(body,'armor',s*.4,-.15-i*.12,0,.16,.055,.25);}
 ell(body,'armor',s*.22,-.64,0,.28,.22,.27);
 ell(body,'dark',s*.28,.25,-.31,.22,.36,.16);
 for(let i=0;i<3;i++)panel(body,'edge',s*.28,.39-i*.14,-.46,.29,.035,.035);
 }
 for(let i=0;i<3;i++)panel(body,'armor',0,-.15-i*.15,.27,.4-i*.05,.105,.12);
 mesh(body,ring,'edge',0,.26,.42,.15,.15,.15);ell(body,'glow',0,.26,.42,.105,.105,.04);
 ell(body,'dark',0,.82,0,.14,.22,.14);
 const head=joint(body,0,1.07,0);ell(head,'armor',0,.09,0,.3,.38,.25);
 ell(head,'dark',0,.02,.2,.24,.23,.08);
 for(const s of [-1,1]){
 const brow=panel(head,'edge',s*.13,.16,.252,.24,.075,.07);brow.rotation.z=s*.22;
 panel(head,'glow',s*.125,.095,.277,.18,.035,.025).rotation.z=s*.18;
 ell(head,'armor',s*.22,-.08,.18,.075,.18,.1);
 ell(head,'dark',s*.29,.05,0,.045,.12,.12);
 mesh(head,ring,'edge',s*.29,.05,.08,.06,.06,.06);
 }
 panel(head,'armor',0,.02,.28,.075,.15,.08);
 ell(head,'edge',0,-.21,.16,.17,.07,.09);
 for(let i=0;i<5;i++)panel(head,'edge',(i-2)*.047,-.115,.277,.022,.075,.025);
 for(const s of [-1,1]){
 const arm=joint(body,s*.68,.55,0);arms.push(arm);
 ell(arm,'dark',0,-.08,0,.19,.21,.19);ell(arm,'armor',s*.05,.01,0,.29,.22,.3);
 panel(arm,'edge',s*.05,.13,.17,.3,.045,.18);
 ell(arm,'dark',0,-.34,0,.13,.28,.14);ell(arm,'armor',s*.045,-.32,.055,.15,.24,.17);
 const elbow=joint(arm,0,-.59,0);ell(elbow,'edge',0,0,0,.14,.14,.14);
 ell(elbow,'armor',0,-.24,0,.2,.26,.19);
 for(let i=0;i<3;i++)panel(elbow,'dark',0,-.13-i*.09,.18,.22,.035,.04);
 ell(elbow,'dark',0,-.53,0,.16,.14,.12);
 ell(elbow,'glow',0,-.51,.12,.065,.065,.025);
 for(let i=0;i<4;i++)ell(elbow,'edge',(i-1.5)*.07,-.64,.035,.03,.09,.045);
 const leg=joint(body,s*.27,-.72,0);legs.push(leg);
 ell(leg,'dark',0,-.25,0,.17,.3,.17);ell(leg,'armor',0,-.25,.08,.2,.28,.18);
 ell(leg,'edge',0,-.55,.11,.18,.15,.13);
 ell(leg,'armor',0,-.85,0,.16,.29,.18);
 panel(leg,'edge',0,-.85,.17,.09,.35,.04);
 ell(leg,'dark',0,-1.13,.08,.19,.12,.29);
 const jet=ell(leg,'glow',0,-1.33,-.02,.085,.23,.085);jets.push(jet);
 }
 root.scale.set(1.5,1.725,1.5);root.userData.rig={body,arms,legs,jets,phase:Math.random()*Math.PI*2};return root;
}
export function animateBot(bot,time,speed){const r=bot.userData.rig,t=time+r.phase;
 r.body.position.y=Math.sin(t*2.8)*.045;
 r.arms.forEach((a,i)=>{a.rotation.x=-.2+Math.sin(t*2+i)*.09;a.rotation.z=(i?1:-1)*.13;});
 r.legs.forEach((l,i)=>{l.rotation.x=.12+Math.sin(t*2+i)*.06;});
 r.jets.forEach(j=>{j.scale.y=(.2+Math.min(speed/100,.25))*(1+.15*Math.sin(t*32));});
}
