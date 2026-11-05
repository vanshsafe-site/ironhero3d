// Starts at noon; a full blue / sunset / night / sunrise cycle takes 120 s.
export function createDayNight(scene,sun,hemisphere){
 const T=window.THREE,night=new T.Color(0x060d26),day=new T.Color(0x409be8),orange=new T.Color(0xf58245),white=new T.Color(0xfff2df);let elapsed=0;
 function disc(color,radius){const material=new T.MeshBasicMaterial({color,transparent:true,fog:false,depthWrite:false});const mesh=new T.Mesh(new T.SphereGeometry(radius,32,24),material);scene.add(mesh);return mesh;}
 const solar=disc(0xffe9a3,23),lunar=disc(0xdce8ff,16);
 // Shallow darker lunar patches follow the moon as it crosses the sky.
 for(const [x,y,r] of [[-5,4,3],[4,-3,4],[5,7,2],[-6,-7,2]]){const crater=new T.Mesh(new T.SphereGeometry(r,12,8),new T.MeshBasicMaterial({color:0x9baec9,transparent:true,fog:false,depthWrite:false}));crater.position.set(x,y,Math.sqrt(256-x*x-y*y)-1);lunar.add(crater);}
 const smooth=(a,b,x)=>{const t=T.MathUtils.clamp((x-a)/(b-a),0,1);return t*t*(3-2*t);};
 return dt=>{elapsed+=dt;const phase=elapsed*Math.PI/60,elevation=Math.cos(phase),light=smooth(-.2,.45,elevation),sunset=Math.max(0,1-Math.abs(elevation)/.45);
 scene.background.copy(night).lerp(day,light).lerp(orange,sunset*.9);scene.fog.color.copy(scene.background);
 sun.intensity=.2+light*1.7;sun.color.copy(orange).lerp(white,1-sunset);sun.position.set(Math.sin(phase)*250,Math.max(30,elevation*250),-180);
 hemisphere.intensity=.5+light*.95;
 solar.position.set(Math.sin(phase)*650,elevation*600,-600);solar.material.opacity=smooth(-.12,.15,elevation);solar.visible=solar.material.opacity>.001;
 lunar.position.set(-Math.sin(phase)*650,-elevation*600,-600);const moonlight=1-smooth(-.15,.12,elevation);lunar.visible=moonlight>.001;lunar.material.opacity=moonlight;lunar.children.forEach(c=>c.material.opacity=moonlight);
 // Existing star field fades out in daylight; impact particles remain unaffected.
 for(const object of scene.children)if(object.isPoints&&object.material.fog===false){object.material.transparent=true;object.material.opacity=1-light;}
 return light;
 };
}
