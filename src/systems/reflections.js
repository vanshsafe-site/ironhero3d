// One local reflection probe shared by glass; six low-resolution views at 5 Hz.
export function createReflections(renderer,scene,buildings,settings){
 const T=window.THREE,target=new T.WebGLCubeRenderTarget(128,{generateMipmaps:true,minFilter:T.LinearMipmapLinearFilter});
 const probe=new T.CubeCamera(.2,450,target);scene.add(probe);
 const glass=new T.MeshStandardMaterial({color:0xb2d5e6,metalness:1,roughness:.08,envMap:target.texture,envMapIntensity:1.1});
 const panels=[],geo=new T.PlaneGeometry(1,1);
 for(const b of buildings){const w=b.x1-b.x0,d=b.z1-b.z0;if(w<3)continue;
 for(const side of [-1,1]){const panel=new T.Mesh(geo,glass);panel.scale.set(w*.85,Math.min(15,b.h-3),1);panel.position.set((b.x0+b.x1)/2,panel.scale.y/2+1.5,side>0?b.z1+.13:b.z0-.13);if(side<0)panel.rotation.y=Math.PI;scene.add(panel);panels.push(panel);}}
 let elapsed=1;
 return (dt,position)=>{elapsed+=dt;const interval=settings.quality==='high'?.3:settings.quality==='balanced'?1:3;if(elapsed<interval)return;elapsed=0;
 let closest=null,distance=Infinity;for(const p of panels){const d=p.position.distanceToSquared(position);if(d<distance){distance=d;closest=p;}}
 if(!closest)return;probe.position.copy(closest.position);probe.position.y=Math.max(2,Math.min(closest.position.y*2,position.y+1.7));probe.position.z+=closest.rotation.y?-.3:.3;
 panels.forEach(p=>p.visible=false);try{probe.update(renderer,scene);}finally{panels.forEach(p=>p.visible=true);}
 };
}
