export function detailCity(scene,buildings){
 const T=window.THREE,geo=new T.BoxGeometry(1,1,1),mat=new T.MeshStandardMaterial({color:0x647587,metalness:.55,roughness:.5});
 const parts=[],glass=[],equipment=[];
 for(const b of buildings){const w=b.x1-b.x0,d=b.z1-b.z0;if(w<3)continue;const x=(b.x0+b.x1)/2,z=(b.z0+b.z1)/2;
 // Recessed entrance, canopy, plinth, window mullions, and roof parapets.
 glass.push([x,1.8,z+d/2+.04,3.2,3.4,.12]);
 parts.push([x,3.7,z+d/2+.7,4.5,.25,1.7],[x,.6,z,w+.6,1.2,d+.6]);
 for(const side of [-1,1]){
 parts.push([x,b.h+1,z+side*d/2,w,.9,.25],[x+side*w/2,b.h+1,z,.25,.9,d]);
 for(let column=-w/2+2;column<w/2;column+=3.5)parts.push([x+column,b.h/2,z+side*(d/2+.08),.12,b.h,.18]);
 for(let column=-d/2+2;column<d/2;column+=3.5)parts.push([x+side*(w/2+.08),b.h/2,z+column,.18,b.h,.12]);
 for(let y=4;y<b.h-2;y+=4){
 parts.push([x,y,z+side*(d/2+.1),w,.12,.2],[x+side*(w/2+.1),y,z,.2,.12,d]);
 }
 }
 equipment.push([x+w*.25,b.h+1.2,z-d*.2,2,1.6,3]);
 for(let vent=0;vent<5;vent++)parts.push([x+w*.25,b.h+2.05,z-d*.2+(vent-2)*.5,1.8,.09,.12]);
 if(b.h>55)parts.push([x-w*.2,b.h+4,z, .12,8,.12]);
 parts.push([x,b.h+.4,z,w+1,.8,d+1],[x,b.h+1.5,z,w*.35,2.2,d*.35]);
 for(const side of [-1,1]){parts.push([x+side*w/2,b.h/2,z,.35,b.h,d+.3]);for(let y=5;y<b.h;y+=9)parts.push([x,y,z+side*d/2,w,.25,.35]);}
 }
 function batch(items,material){const inst=new T.InstancedMesh(geo,material,items.length),dummy=new T.Object3D();items.forEach((p,i)=>{dummy.position.set(...p.slice(0,3));dummy.scale.set(...p.slice(3));dummy.updateMatrix();inst.setMatrixAt(i,dummy.matrix);});scene.add(inst);}
 batch(parts,mat);batch(glass,new T.MeshStandardMaterial({color:0x21465c,metalness:.7,roughness:.18}));batch(equipment,new T.MeshStandardMaterial({color:0x394652,metalness:.6,roughness:.55}));
}
export function createImpacts(scene){
 const T=window.THREE,capacity=1200,positions=new Float32Array(capacity*3),velocities=new Float32Array(capacity*3),life=new Float32Array(capacity);positions.fill(-10000);
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(positions,3));const points=new T.Points(geo,new T.PointsMaterial({color:0xffb65b,size:.7,transparent:true,opacity:.85,depthWrite:false}));points.frustumCulled=false;scene.add(points);let cursor=0;
 return {burst(p){for(let n=0;n<28;n++){const i=cursor++%capacity,k=i*3;positions[k]=p.x;positions[k+1]=p.y;positions[k+2]=p.z;for(let a=0;a<3;a++)velocities[k+a]=(Math.random()-.5)*15;life[i]=.6+Math.random();}},update(dt){for(let i=0;i<capacity;i++)if(life[i]>0){life[i]-=dt;const k=i*3;velocities[k+1]-=12*dt;for(let a=0;a<3;a++)positions[k+a]+=velocities[k+a]*dt;if(life[i]<=0)positions[k+1]=-10000;}geo.attributes.position.needsUpdate=true;},reset(){life.fill(0);positions.fill(-10000);geo.attributes.position.needsUpdate=true;}};
}
