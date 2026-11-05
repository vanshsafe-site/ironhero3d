// Upright hero volume; substeps prevent tunneling at boosted flight speeds.
export function moveSolid(position,velocity,dt,obstacles){
 const radius=.65,height=2.95;
 const steps=Math.max(1,Math.ceil(Math.hypot(velocity.x,velocity.y,velocity.z)*dt/.25));
 let grounded=false;
 for(let step=0;step<steps;step++){
  for(const axis of ['y','x','z']){
   const before=position[axis];position[axis]+=velocity[axis]*dt/steps;
   for(const b of obstacles){
    if(position.x+radius<=b.x0||position.x-radius>=b.x1||position.z+radius<=b.z0||position.z-radius>=b.z1||position.y+height<=b.y0||position.y>=b.y1)continue;
    if(axis==='y'){
     if(before>=b.y1-.001){position.y=b.y1;grounded=true;}
     else if(before+height<=b.y0+.001)position.y=b.y0-height;
     else continue;
    }else{
     // Step onto curbs without jumping, but never through a low ceiling.
     const rise=b.y1-position.y;
     if(velocity.y<=0&&rise>0&&rise<=.5){
      const clear=obstacles.every(o=>o===b||position.x+radius<=o.x0||position.x-radius>=o.x1||position.z+radius<=o.z0||position.z-radius>=o.z1||b.y1+height<=o.y0||b.y1>=o.y1);
      if(clear){position.y=b.y1;grounded=true;continue;}
     }
     const low=b[axis+'0']-radius,high=b[axis+'1']+radius;
     position[axis]=before<=low?low:before>=high?high:Math.abs(position[axis]-low)<Math.abs(position[axis]-high)?low:high;
    }
    velocity[axis]=0;
   }
  }
  if(position.y<=0){position.y=0;velocity.y=Math.max(0,velocity.y);grounded=true;}
 }
 return grounded;
}
export function actorBounds(object,halfX,halfZ,bottom,top){const p=object.position;return {x0:p.x-halfX,x1:p.x+halfX,z0:p.z-halfZ,z1:p.z+halfZ,y0:p.y+bottom,y1:p.y+top};}
