export function setupSettings(renderer){
 const mobile=matchMedia('(pointer:coarse)').matches;
 let quality=mobile?'performance':'balanced',best=0;
 try{quality=localStorage.getItem('iron-quality')||quality;best=Number(localStorage.getItem('iron-best'))||0;}catch{}
 if(!['performance','balanced','high'].includes(quality))quality='balanced';
 const select=document.getElementById('quality'),record=document.getElementById('best-score');select.value=quality;record.textContent=best.toLocaleString();
 const apply=()=>{quality=select.value;renderer.setPixelRatio(Math.min(devicePixelRatio,{performance:1,balanced:1.5,high:2}[quality]));try{localStorage.setItem('iron-quality',quality);}catch{}};select.onchange=apply;apply();
 return {get quality(){return quality;},save(score){if(score>best){best=score;record.textContent=best.toLocaleString();try{localStorage.setItem('iron-best',String(best));}catch{}}}};
}
