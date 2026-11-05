// Instanced street furniture adds detail without a draw call per prop.
export function dressStreets(scene){
 const T=window.THREE,sets={paint:[],metal:[],lamp:[],bench:[]};
 const lanes=[-224,-160,-96,-32,32,96,160,224];
 for(const lane of lanes){
  for(let p=-280;p<280;p+=10){sets.paint.push([lane,.025,p,.15,.025,4],[p,.025,lane,4,.025,.15]);}
  for(const cross of lanes)for(let stripe=-3;stripe<=3;stripe++){
   sets.paint.push([lane+stripe*1.4,.035,cross+10,.7,.025,3],[lane+10,.035,cross+stripe*1.4,3,.025,.7]);
  }
  for(let p=-250;p<260;p+=64)for(const side of [-1,1]){
   sets.metal.push([lane+side*9,3,p,.16,6,.16],[lane+side*8,6,p,2,.15,.18]);
   sets.lamp.push([lane+side*7.2,5.9,p,.9,.12,.5]);
   sets.bench.push([lane+side*11,.85,p+4,.65,.16,2.2],[lane+side*11.3,1.2,p+4,.12,.7,2.2]);
   for(const end of [-.8,.8])sets.metal.push([lane+side*11,.5,p+4+end,.1,.8,.1]);
  }
 }
 const materials={paint:new T.MeshStandardMaterial({color:0xc9be92,roughness:.9}),metal:new T.MeshStandardMaterial({color:0x354856,metalness:.7,roughness:.45}),lamp:new T.MeshStandardMaterial({color:0xffe8ba,emissive:0xffd390,emissiveIntensity:1.5}),bench:new T.MeshStandardMaterial({color:0x654c35,roughness:.8})};
 const dummy=new T.Object3D(),geo=new T.BoxGeometry(1,1,1);
 for(const [key,items] of Object.entries(sets)){const mesh=new T.InstancedMesh(geo,materials[key],items.length);items.forEach((p,i)=>{dummy.position.set(...p.slice(0,3));dummy.scale.set(...p.slice(3));dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);});mesh.userData.decorative=key==='paint';scene.add(mesh);}
 return daylight=>{materials.lamp.emissiveIntensity=.25+(1-daylight)*2;};
}
