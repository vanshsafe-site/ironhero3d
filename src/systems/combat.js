// Continuous collision queries return the first intersection along a shot (0..1).
export function segmentBox(a,b,box,padding=0){
 let near=0,far=1;
 for(const axis of ['x','y','z']){
  const delta=b[axis]-a[axis],lo=box[axis+'0']-padding,hi=box[axis+'1']+padding;
  if(Math.abs(delta)<1e-9){if(a[axis]<lo||a[axis]>hi)return null;continue;}
  let t0=(lo-a[axis])/delta,t1=(hi-a[axis])/delta;if(t0>t1)[t0,t1]=[t1,t0];
  near=Math.max(near,t0);far=Math.min(far,t1);if(near>far)return null;
 }
 return near;
}
export function segmentSphere(a,b,center,radius){
 const dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z,ox=a.x-center.x,oy=a.y-center.y,oz=a.z-center.z;
 const c=ox*ox+oy*oy+oz*oz-radius*radius;if(c<=0)return 0;
 const aa=dx*dx+dy*dy+dz*dz;if(aa<1e-9)return null;
 const bb=ox*dx+oy*dy+oz*dz,disc=bb*bb-aa*c;if(disc<0)return null;
 const t=(-bb-Math.sqrt(disc))/aa;return t>=0&&t<=1?t:null;
}
export function waveSize(wave){return 20*2**(wave-1);}
