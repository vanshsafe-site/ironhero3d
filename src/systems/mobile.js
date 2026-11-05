export function setupMobile({state,keys,aim,fire,pause}){
 const mobile=matchMedia('(pointer:coarse)').matches,controls=document.getElementById('touch-controls'),gate=document.getElementById('mobile-gate');
 document.body.classList.toggle('mobile',mobile);
 const held=new Map();let stickId=null,lookId=null,lastX=0,lastY=0;
 const clear=()=>{for(const key of Object.keys(keys))keys[key]=0;held.clear();stickId=lookId=null;fire(false);document.getElementById('stick-knob').style.transform='translate(0,0)';};
 function check(){if(!mobile)return;const valid=!!document.fullscreenElement&&innerWidth>innerHeight;gate.hidden=valid;
 document.getElementById('gate-text').textContent=!document.fullscreenEnabled?'This browser cannot run this game in fullscreen. Open it in a mobile browser with fullscreen support.':innerHeight>=innerWidth?'Rotate your device to landscape to play.':'Fullscreen is required to play on mobile.';
 if(!valid&&state.mode==='play')pause();if(!valid)clear();}
 async function enter(){if(!mobile)return true;try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen();if(screen.orientation?.lock)await screen.orientation.lock('landscape').catch(()=>{});}catch{}check();return !!document.fullscreenElement&&innerWidth>innerHeight;}
 document.getElementById('enter-fullscreen').onclick=enter;
 const stick=document.getElementById('move-stick');
 function move(e){const r=stick.getBoundingClientRect(),dx=e.clientX-r.left-r.width/2,dy=e.clientY-r.top-r.height/2,length=Math.hypot(dx,dy),scale=Math.min(1,40/Math.max(1,length));keys.KeyA=dx< -12;keys.KeyD=dx>12;keys.KeyW=dy< -12;keys.KeyS=dy>12;document.getElementById('stick-knob').style.transform=`translate(${dx*scale}px,${dy*scale}px)`;}
 stick.onpointerdown=e=>{if(state.mode!=='play'||stickId!==null)return;stickId=e.pointerId;stick.setPointerCapture(e.pointerId);move(e);};stick.onpointermove=e=>{if(e.pointerId===stickId)move(e);};
 const releaseStick=e=>{if(e.pointerId!==stickId)return;stickId=null;for(const key of ['KeyA','KeyD','KeyW','KeyS'])keys[key]=0;document.getElementById('stick-knob').style.transform='translate(0,0)';};stick.onpointerup=stick.onpointercancel=stick.onlostpointercapture=releaseStick;
 const look=document.getElementById('look-pad');look.onpointerdown=e=>{if(state.mode!=='play'||lookId!==null)return;lookId=e.pointerId;lastX=e.clientX;lastY=e.clientY;look.setPointerCapture(e.pointerId);};look.onpointermove=e=>{if(e.pointerId!==lookId)return;aim(e.clientX-lastX,e.clientY-lastY);lastX=e.clientX;lastY=e.clientY;};look.onpointerup=look.onpointercancel=look.onlostpointercapture=e=>{if(e.pointerId===lookId)lookId=null;};
 controls.querySelectorAll('[data-key],[data-fire]').forEach(button=>{
 button.onpointerdown=e=>{e.preventDefault();if(state.mode!=='play')return;button.setPointerCapture(e.pointerId);const key=button.dataset.key;held.set(e.pointerId,key||'fire');if(key)dispatchEvent(new KeyboardEvent('keydown',{code:key}));else fire(true);};
 const release=e=>{const key=held.get(e.pointerId);if(!key)return;held.delete(e.pointerId);if(key==='fire')fire(false);else dispatchEvent(new KeyboardEvent('keyup',{code:key}));};button.onpointerup=button.onpointercancel=button.onlostpointercapture=release;
 });
 document.getElementById('pause-game').onclick=()=>{clear();pause();};
 addEventListener('resize',check);document.addEventListener('fullscreenchange',check);addEventListener('blur',clear);document.addEventListener('visibilitychange',()=>{if(document.hidden){clear();if(state.mode==='play')pause();}});
 check();return {mobile,enter,clear};
}
