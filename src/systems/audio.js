// Decode local effects once; reuse buffers for overlapping repulsor shots.
export function createAudio(){
 const music=new Audio(new URL('../../soundtrack.mp3',import.meta.url).href);music.loop=true;music.volume=.4;
 const status=document.getElementById('music-status'),toggle=document.getElementById('music-toggle');
 let context,master,flightGain,flightSource,flightBuffer,blastBuffer,loading,musicStarted=false,enabled=true,wantsFlight=false,boosting=false;
 const shots=new Set();
 function syncFlight(){
  if(!context||!flightBuffer)return;
  if(wantsFlight&&enabled&&!flightSource){flightSource=context.createBufferSource();flightSource.buffer=flightBuffer;flightSource.loop=true;flightSource.connect(flightGain);flightSource.start();}
  if((!wantsFlight||!enabled)&&flightSource){flightSource.stop();flightSource.disconnect();flightSource=null;}
  flightGain.gain.setTargetAtTime(boosting?.45:.3,context.currentTime,.12);
  if(flightSource)flightSource.playbackRate.setTargetAtTime(boosting?1.12:1,context.currentTime,.15);
 }
 function startEffects(){
  if(!context){context=new AudioContext();master=context.createGain();master.gain.value=enabled?1:0;master.connect(context.destination);flightGain=context.createGain();flightGain.connect(master);}
  context.resume().catch(()=>{});
  if(!loading){
   const decode=async path=>{const response=await fetch(new URL(path,import.meta.url));if(!response.ok)throw new Error('Audio file unavailable');return context.decodeAudioData(await response.arrayBuffer());};
   loading=Promise.allSettled([
    decode('../../flying sound effect.mp3').then(buffer=>{flightBuffer=buffer;syncFlight();}),
    decode('../../blaster-sound-effect.mp3').then(buffer=>{blastBuffer=buffer;})
   ]).then(results=>{if(results.some(r=>r.status==='rejected'))status.textContent='One or more sound effects could not load. Reload to retry.';});
  }
 }
 toggle.onclick=()=>{music.muted=!music.muted;toggle.textContent=music.muted?'Unmute music':'Mute music';toggle.setAttribute('aria-pressed',String(music.muted));};
 document.getElementById('sfx-toggle').onclick=e=>{enabled=!enabled;e.target.textContent=enabled?'Effects: on':'Effects: off';if(master)master.gain.setTargetAtTime(enabled?1:0,context.currentTime,.03);syncFlight();};
 document.addEventListener('visibilitychange',()=>{if(document.hidden){wantsFlight=false;syncFlight();}});
 return {
  start(){startEffects();if(!musicStarted){musicStarted=true;music.play().catch(()=>{musicStarted=false;status.textContent='Music could not start. Resume the game to retry.';});}},
  blast(){if(!context||!enabled||!blastBuffer)return;
   // Bound overlapping voices during sustained fire.
   if(shots.size>=6){const oldest=shots.values().next().value;oldest.stop();shots.delete(oldest);}
   const source=context.createBufferSource(),gain=context.createGain();source.buffer=blastBuffer;gain.gain.value=.28;source.connect(gain).connect(master);shots.add(source);source.onended=()=>{shots.delete(source);source.disconnect();gain.disconnect();};source.start();
  },
  update(flying,boost){wantsFlight=flying;boosting=boost;syncFlight();}
 };
}
