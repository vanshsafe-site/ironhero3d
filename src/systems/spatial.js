// Static world grid: query nearby collision bounds instead of every facade detail.
export function createSpatialIndex(boxes,size=32){
 const cells=new Map();
 for(const b of boxes)for(let x=Math.floor(b.x0/size);x<=Math.floor(b.x1/size);x++)for(let z=Math.floor(b.z0/size);z<=Math.floor(b.z1/size);z++){const key=x+','+z;if(!cells.has(key))cells.set(key,[]);cells.get(key).push(b);}
 return (position,radius=8)=>{const nearby=new Set();for(let x=Math.floor((position.x-radius)/size);x<=Math.floor((position.x+radius)/size);x++)for(let z=Math.floor((position.z-radius)/size);z<=Math.floor((position.z+radius)/size);z++)for(const b of cells.get(x+','+z)||[])if(position.x>b.x0-radius&&position.x<b.x1+radius&&position.z>b.z0-radius&&position.z<b.z1+radius)nearby.add(b);return [...nearby];};
}
