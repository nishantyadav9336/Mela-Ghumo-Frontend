const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const search = $('#search'), category = $('#category'), cards = $$('.card'), chips = $$('.chip');
let activeFilter = 'all', currentCard = null, toastTimer;
function toast(message){const t=$('#toast');t.textContent=message;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),2400)}
function applyFilters(){
 const query=search.value.trim().toLowerCase();
 const selected=category.value!=='all'?category.value:activeFilter;
 let count=0;
 cards.forEach(card=>{const text=(card.dataset.search+' '+card.innerText).toLowerCase();const show=(selected==='all'||card.dataset.category===selected)&&text.includes(query);card.hidden=!show;if(show)count++});
 $('#empty').hidden=count>0;
 chips.forEach(chip=>chip.classList.toggle('active',chip.dataset.filter===selected));
}
$('#searchButton').addEventListener('click',()=>{applyFilters();$('#explore').scrollIntoView({behavior:'smooth'})});
search.addEventListener('input',applyFilters);
category.addEventListener('change',()=>{activeFilter='all';applyFilters()});
chips.forEach(chip=>chip.addEventListener('click',()=>{activeFilter=chip.dataset.filter;category.value='all';applyFilters()}));
$$('.heart').forEach(btn=>btn.addEventListener('click',()=>{btn.classList.toggle('saved');btn.textContent=btn.classList.contains('saved')?'♥':'♡';const title=btn.closest('.card').querySelector('h3').textContent;toast(btn.classList.contains('saved')?`${title} saved to favourites`:`${title} removed from favourites`)}));
$$('[data-jump]').forEach(tile=>tile.addEventListener('click',()=>{activeFilter=tile.dataset.jump;category.value='all';applyFilters()}));
const dialog=$('#detailDialog');
$$('.details').forEach(btn=>btn.addEventListener('click',()=>{currentCard=btn.closest('.card');$('#dialogTitle').textContent=btn.dataset.title;$('#dialogPlace').textContent='📍 '+btn.dataset.place;$('#dialogInfo').textContent=btn.dataset.info;$('#saveFromDialog').textContent=currentCard.querySelector('.heart').classList.contains('saved')?'♥ Saved to favourites':'♡ Save this mela';dialog.showModal()}));
$('#closeDialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
$('#saveFromDialog').addEventListener('click',()=>{if(!currentCard)return;const heart=currentCard.querySelector('.heart');heart.classList.toggle('saved');heart.textContent=heart.classList.contains('saved')?'♥':'♡';$('#saveFromDialog').textContent=heart.classList.contains('saved')?'♥ Saved to favourites':'♡ Save this mela';toast(heart.classList.contains('saved')?'Mela saved to favourites':'Mela removed from favourites')});
$('#hamburger').addEventListener('click',()=>$('#nav').classList.toggle('open'));
$$('#nav a').forEach(a=>a.addEventListener('click',()=>$('#nav').classList.remove('open')));
$('#newsletter').addEventListener('submit',e=>{e.preventDefault();const email=$('#email').value.trim();if(email){$('#message').textContent=`Thanks! ${email} — demo signup successful (browser only).`;toast('Demo signup successful! Email server par send nahi hua.');e.target.reset()}});

// Lightweight walk-through 3D Dussehra mela (Three.js CDN required)
(function initVirtualMela(){
 const canvas=$('#melaCanvas'); if(!canvas || !window.THREE){if($('#gameHelp'))$('#gameHelp').textContent='3D mela load nahi hua. Internet connection check karke page refresh karein.';return;}
 const THREE=window.THREE, host=$('#melaGame');
 const scene=new THREE.Scene(); scene.background=new THREE.Color(0x17172d); scene.fog=new THREE.Fog(0x17172d,24,78);
 const camera=new THREE.PerspectiveCamera(68,1,.1,150); camera.position.set(0,1.7,10);
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true}); renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.7)); renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 scene.add(new THREE.HemisphereLight(0xbccfff,0x6d3d32,2.0));
 const moon=new THREE.DirectionalLight(0xffdfb0,2.2);moon.position.set(-10,18,8);moon.castShadow=true;scene.add(moon);
 const mat=(color,roughness=.8,emissive=null)=>new THREE.MeshStandardMaterial({color,roughness,...(emissive?{emissive:new THREE.Color(emissive),emissiveIntensity:.45}:{})});
 const ground=new THREE.Mesh(new THREE.PlaneGeometry(130,130),mat(0x453b4a));ground.rotation.x=-Math.PI/2;ground.position.y=-.08;ground.receiveShadow=true;scene.add(ground);
 const path=new THREE.Mesh(new THREE.PlaneGeometry(7,95),mat(0xb69b78));path.rotation.x=-Math.PI/2;path.position.set(0,.005,-28);scene.add(path);
 const addBox=(x,y,z,w,h,d,color,opts={})=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(color,.75,opts.glow));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;scene.add(m);return m;};
 const addCylinder=(x,y,z,rt,rb,h,color,seg=12)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg),mat(color));m.position.set(x,y,z);m.castShadow=true;scene.add(m);return m;};
 // Decorative strings and warm bulbs
 const bulbMat=new THREE.MeshStandardMaterial({color:0xffdc75,emissive:0xff9c32,emissiveIntensity:1.5});
 for(let side of [-1,1]){for(let i=0;i<10;i++){const z=5-i*7;addBox(side*7,3.8,z,.12,7.6,.12,0x593c36);const bulb=new THREE.Mesh(new THREE.SphereGeometry(.13,8,8),bulbMat);bulb.position.set(side*5.8,4.2,z-1);scene.add(bulb);}}
 // Stalls down both sides of the walkway
 const stallColors=[0xe45d45,0x3f9b8c,0xe8b44b,0x7954a7,0xd95f94,0x4c83bd];
 function makeStall(x,z,i){const c=stallColors[i%stallColors.length];addBox(x,.85,z,2.7,1.7,2.0,0x8d4d31);addBox(x,1.82,z,3.05,.22,2.25,c);const awning=addBox(x,2.12,z,3.15,.42,2.3,c);awning.rotation.z=.02;addBox(x,1.12,z+1.02,2.2,.72,.08,0x392a2d);addBox(x,1.55,z+1.08,2.1,.12,.1,0xffdc78,{glow:0xffb52b});
  const signCanvas=document.createElement('canvas');signCanvas.width=256;signCanvas.height=64;const ctx=signCanvas.getContext('2d');ctx.fillStyle='#fff3d6';ctx.fillRect(0,0,256,64);ctx.fillStyle='#35273a';ctx.font='bold 25px sans-serif';ctx.textAlign='center';ctx.fillText(['CHAAT CORNER','TOYS & GIFTS','JALebi HOUSE','GAMES ZONE','KULFI POINT','HANDICRAFTS'][i%6],128,41);const tex=new THREE.CanvasTexture(signCanvas);const sign=new THREE.Mesh(new THREE.PlaneGeometry(2.15,.53),new THREE.MeshBasicMaterial({map:tex}));sign.position.set(x,2.15,z+1.17);scene.add(sign);
 }
 for(let i=0;i<7;i++){const z=2-i*7.3;makeStall(-5.3,z,i);makeStall(5.3,z,i+2);}
 // Ferris wheel at the back of the fair
 const wheelGroup=new THREE.Group();wheelGroup.position.set(-7,4.5,-27);scene.add(wheelGroup);
 const ringMat=mat(0xffc35c,.35,0x9d531b);const ring=new THREE.Mesh(new THREE.TorusGeometry(3.25,.11,10,48),ringMat);wheelGroup.add(ring);
 const hub=new THREE.Mesh(new THREE.CylinderGeometry(.35,.35,.55,16),mat(0xffe1a0));hub.rotation.x=Math.PI/2;wheelGroup.add(hub);
 for(let i=0;i<12;i++){const a=i*Math.PI/6;const spoke=new THREE.Mesh(new THREE.BoxGeometry(.075,6.45,.08),mat(i%2?0xf8e4a0:0xff7657));spoke.rotation.z=a;wheelGroup.add(spoke);const pod=new THREE.Mesh(new THREE.BoxGeometry(.7,.6,.65),mat(stallColors[i%stallColors.length]));pod.position.set(Math.sin(a)*3.25,-Math.cos(a)*3.25,0);wheelGroup.add(pod);}
 addBox(-7,1.8,-27,.45,3.6,.55,0x72514a);addBox(-8.4,1.8,-27,.35,3.6,.45,0x72514a);
 // Ravan effigy, stage and a few animated fireworks
 addBox(0,.35,-34,8,.7,3,0x8b3f36);addBox(0,1.05,-34,7.4,.15,2.6,0xffd36c);
 const ravan=new THREE.Group();ravan.position.set(0,0,-34);scene.add(ravan);
 const gold=mat(0xf1b642), red=mat(0xc94a39), green=mat(0x298b66), dark=mat(0x4b2c3c);
 const torso=new THREE.Mesh(new THREE.CylinderGeometry(.65,.9,2.1,12),green);torso.position.y=2.2;ravan.add(torso);
 const head=new THREE.Mesh(new THREE.SphereGeometry(.68,14,12),gold);head.position.y=3.65;ravan.add(head);
 for(let i=0;i<9;i++){const a=(i/8-.5)*Math.PI*.88;const h=new THREE.Mesh(new THREE.SphereGeometry(.23,8,8),gold);h.position.set(Math.sin(a)*1.15,3.65+Math.cos(a)*.42,0);ravan.add(h);const crown=new THREE.Mesh(new THREE.ConeGeometry(.19,.42,7),red);crown.position.set(Math.sin(a)*1.15,4.0+Math.cos(a)*.42,0);ravan.add(crown);}
 const arm1=new THREE.Mesh(new THREE.CylinderGeometry(.15,.18,2.2,8),red);arm1.position.set(-1.05,2.45,0);arm1.rotation.z=-.8;ravan.add(arm1);const arm2=arm1.clone();arm2.position.x=1.05;arm2.rotation.z=.8;ravan.add(arm2);
 for(let i=0;i<2;i++){const leg=new THREE.Mesh(new THREE.CylinderGeometry(.22,.25,1.4,8),dark);leg.position.set(i? .42:-.42,.75,0);ravan.add(leg);}
 const fireworks=[];for(let i=0;i<70;i++){const p=new THREE.Mesh(new THREE.SphereGeometry(.055,5,5),new THREE.MeshBasicMaterial({color:[0xffd45b,0xff5f6d,0x65f2c0,0x8bbcff][i%4]}));scene.add(p);fireworks.push({mesh:p,angle:Math.random()*Math.PI*2,r:1+Math.random()*4,speed:.5+Math.random()*1.7,phase:Math.random()*Math.PI*2});}
 // Simple navigation
 let yaw=0,pitch=0,dragging=false,lastX=0,lastY=0;const keys={};let moveX=0,moveY=0;
 function resize(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}resize();window.addEventListener('resize',resize);
 window.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName))e.preventDefault();keys[e.key.toLowerCase()]=true;});window.addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
 canvas.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture?.(e.pointerId);});canvas.addEventListener('pointermove',e=>{if(!dragging)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;lastX=e.clientX;lastY=e.clientY;yaw-=dx*.004;pitch=Math.max(-.5,Math.min(.55,pitch+dy*.003));});canvas.addEventListener('pointerup',()=>dragging=false);canvas.addEventListener('pointercancel',()=>dragging=false);
 const joystick=$('#joystick'),stick=joystick?.querySelector('span');let joyActive=false;
 function joyMove(e){const r=joystick.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;let dx=e.clientX-cx,dy=e.clientY-cy;const len=Math.hypot(dx,dy),max=24;if(len>max){dx=dx/len*max;dy=dy/len*max;}moveX=dx/max;moveY=dy/max;if(stick)stick.style.transform=`translate(${dx}px,${dy}px)`;}
 joystick?.addEventListener('pointerdown',e=>{joyActive=true;joystick.setPointerCapture(e.pointerId);joyMove(e);});joystick?.addEventListener('pointermove',e=>{if(joyActive)joyMove(e);});const endJoy=()=>{joyActive=false;moveX=0;moveY=0;if(stick)stick.style.transform='translate(0,0)';};joystick?.addEventListener('pointerup',endJoy);joystick?.addEventListener('pointercancel',endJoy);
 $('#resetView')?.addEventListener('click',()=>{camera.position.set(0,1.7,10);yaw=0;pitch=0;toast('Virtual mela view reset ho gaya!');});
 const clock=new THREE.Clock();let elapsed=0;
 function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.04);elapsed+=dt;wheelGroup.rotation.z=Math.sin(elapsed*.65)*.05+elapsed*.18;
  let forward=(keys.w||keys.arrowup?1:0)-(keys.s||keys.arrowdown?1:0)-moveY;let sideways=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0)+moveX;const mag=Math.hypot(forward,sideways);if(mag>1){forward/=mag;sideways/=mag;}const speed=dt*5.2;camera.position.x+=(-Math.sin(yaw)*forward+Math.cos(yaw)*sideways)*speed;camera.position.z+=(-Math.cos(yaw)*forward-Math.sin(yaw)*sideways)*speed;camera.position.x=Math.max(-13,Math.min(13,camera.position.x));camera.position.z=Math.max(-42,Math.min(12,camera.position.z));camera.position.y=1.7;camera.rotation.order='YXZ';camera.rotation.y=yaw;camera.rotation.x=pitch;
  fireworks.forEach((f,i)=>{const cycle=(elapsed*f.speed+f.phase)%(Math.PI*2);const active=cycle<1.2;f.mesh.visible=active;if(active){const burst=cycle/1.2;const cx=(i%2?7:-7),cz=-29-(i%3)*3;f.mesh.position.set(cx+Math.cos(f.angle)*f.r*burst,5+Math.sin(f.angle)*f.r*burst,cz+Math.sin(f.angle*2)*f.r*.4*burst);}});
  $('#gamePosition').textContent=`Position: ${Math.round(camera.position.x)}, ${Math.round(camera.position.z)} · Explore karein`;renderer.render(scene,camera);
 }
 animate();
})();
