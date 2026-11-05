// Keep articulated transforms, render repeated civilian/car parts in shared batches.
export function instanceActors(scene,roots){
 const T=window.THREE,batches=new Map();
 for(const root of roots){root.updateMatrixWorld(true);root.traverse(mesh=>{if(!mesh.isMesh)return;const key=mesh.geometry.uuid+mesh.material.uuid;if(!batches.has(key))batches.set(key,{geometry:mesh.geometry,material:mesh.material,parts:[]});batches.get(key).parts.push(mesh);});scene.remove(root);}
 for(const batch of batches.values()){batch.mesh=new T.InstancedMesh(batch.geometry,batch.material,batch.parts.length);batch.mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);batch.mesh.frustumCulled=false;scene.add(batch.mesh);}
 return ()=>{roots.forEach(root=>root.updateMatrixWorld(true));for(const batch of batches.values()){batch.parts.forEach((part,i)=>batch.mesh.setMatrixAt(i,part.matrixWorld));batch.mesh.instanceMatrix.needsUpdate=true;}};
}
