// Blended whole-body poses with per-hand recoil and frame-rate independent easing.
export function animateHero(hero,dt,state={}) {
 const r=hero.userData.rig;r.time+=dt;const t=r.time,blend=1-Math.exp(-11*dt);
 const move=(o,key,target)=>o.rotation[key]+=(target-o.rotation[key])*blend;
 const stride=Math.min((state.speed||0)/13,1);
 r.gait=(r.gait||0)+dt*(state.boost?15:10)*Math.max(.2,stride);
 const phase=r.gait,breath=Math.sin(t*2.1),air=!!state.fly;
 const yaw=state.turn||0,delta=r.lastYaw===undefined?0:Math.atan2(Math.sin(yaw-r.lastYaw),Math.cos(yaw-r.lastYaw));r.lastYaw=yaw;
 const bank=Math.max(-.32,Math.min(.32,-delta/Math.max(dt,.001)*.1-(state.strafe||0)*.12));
 if(state.grounded&&!r.wasGrounded)r.landing=.24;
 r.wasGrounded=state.grounded;r.landing=Math.max(0,(r.landing||0)-dt);
 const landing=r.landing/.24;
 const bob=air?Math.sin(t*2.8)*.045:Math.abs(Math.sin(phase))*stride*.055;
 r.body.position.y+=(bob+breath*.009-landing*.12-r.body.position.y)*blend;
 move(r.body,'x',state.hit?-.2:air?0:stride*.1+landing*.15);
 move(r.body,'z',air?bank:Math.sin(phase)*stride*.035);
 move(r.body,'y',air?Math.sin(t*1.2)*.025:Math.sin(phase)*stride*.065);
 r.arms.forEach((arm,i)=>{
  const sign=i?1:-1,swing=Math.sin(phase)*sign;
  r.shotTimers[i]=Math.max(0,r.shotTimers[i]-dt);
  const recoil=r.shotTimers[i]/.28;
  let x=swing*stride*.85+breath*.018,z=-sign*(.2+stride*.045),elbow=-.15-stride*.7,palm=0;
  if(!state.grounded){x=-.3;elbow=-.55;z=-sign*.3;}
  if(air){x=.04+Math.sin(t*2+i)*.025;z=-sign*.16+bank*.15;elbow=-.06;palm=Math.PI/2;}
  if(recoil>0){
   // Cancel the body's flight pitch so the firing arm still reaches forward.
   x=-1.3-recoil*.16-(air?hero.rotation.x:0);
   z=-sign*.24;elbow=-.16-recoil*.12;palm=1.46;
  }
  if(state.missiles){z=-sign*.55;elbow=-1;x=-.25;}
  if(state.nova){z=-sign*1.25;x=-.35;elbow=-.2;palm=.4;}
  const handJet=r.handJets[i];
  handJet.visible=air&&recoil===0&&!state.nova&&!state.missiles;
  handJet.scale.z=(state.boost?.3:.18)*(1+.12*Math.sin(t*38+i));
  move(arm,'x',x);move(arm,'z',z);move(arm.userData.elbow,'x',elbow);move(r.palms[i],'x',palm);
 });
 r.legs.forEach((leg,i)=>{
  const sign=i?1:-1,swing=Math.sin(phase)*sign;
  let hip=swing*stride*.7,knee=Math.max(0,-swing)*stride*1.1+landing*.65;
  if(!state.grounded){hip=-.35-sign*.12;knee=.65+sign*.15;}
  if(air){hip=state.boost?.08:.14+sign*.07+Math.sin(t*2+i)*.035;knee=state.boost?.12:.3+Math.max(0,-(state.vertical||0))*.008;}
  move(leg,'x',hip);move(leg,'z',air?sign*.06-bank*.2:0);move(leg.userData.knee,'x',knee);
 });
 r.jets.forEach(j=>{j.visible=air;j.scale.y=(state.boost?.5:.25)*(1+.12*Math.sin(t*40));});
 move(r.head,'y',state.firing?0:air?-bank*.5:Math.sin(t*.7)*.09);
 move(r.head,'x',air?-hero.rotation.x*.55:Math.sin(t*1.1)*.025);
}
