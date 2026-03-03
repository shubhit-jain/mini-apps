'use strict';
// ═══════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════
const CW = 640, CH = 480, TILE = 40;
const WORLD_W = 80, WORLD_H = 12;
const GRAV = 900, MOVE = 170, JUMP = 460;
const CREEP_SPEED = 55, MAX_CREEP = 3, GAME_SEC = 90;
const PW = 26, PH = 62; // player bounding box (half-width, height)

const B = { AIR:0, GRASS:1, DIRT:2, STONE:3, BEDROCK:4, COAL:5, DIAMOND:6, WOOD:7, LEAVES:8 };
// seconds to break per block type
const HARD = [0, 0.9, 1.2, 2.8, 99, 2.8, 4.5, 1.6, 0.5];
const BCOLOR = ['','#5a9e2e','#7d5019','#808080','#2d2d2d','#424242','#00bcd4','#8b4513','#4caf50'];

// ═══════════════════════════════════════════════════════
// PIXEL-ART TEXTURE BAKER  (8×8 → scaled to TILE at draw)
// ═══════════════════════════════════════════════════════
const TEX = {};
function bake(pal, rows) {
  const N = 8;
  const c = document.createElement('canvas'); c.width = c.height = N;
  const x = c.getContext('2d'), img = x.createImageData(N, N);
  for (let r = 0; r < N; r++) for (let k = 0; k < N; k++) {
    const h = pal[parseInt(rows[r][k], 16)];
    const i = (r*N+k)*4;
    img.data[i]   = parseInt(h.slice(1,3),16);
    img.data[i+1] = parseInt(h.slice(3,5),16);
    img.data[i+2] = parseInt(h.slice(5,7),16);
    img.data[i+3] = 255;
  }
  x.putImageData(img,0,0); return c;
}
function bakeAll() {
  TEX[B.GRASS] = bake(
    ['#5a9e2e','#78c43e','#4a7a24','#8b5e19','#a87340','#7a4d14','#c4904a','#6b4315'],
    ['01021012','20102001','34563465','56345634','43564356','65435643','34565346','56343654']);
  TEX[B.DIRT] = bake(
    ['#7d5019','#a87340','#6a4010','#c4904a','#8f6228'],
    ['01020413','20134024','41302041','34041320','02413024','10342140','24130402','43024213']);
  TEX[B.STONE] = bake(
    ['#808080','#686868','#989898','#707070','#585858','#b0b0b0'],
    ['02130521','15024013','30251402','41305024','02413150','53041302','14502031','30124053']);
  TEX[B.BEDROCK] = bake(
    ['#2d2d2d','#1a1a1a','#3a3a3a','#444444','#121212'],
    ['02140320','31024031','42310142','20431204','13042310','04213043','31040231','20314302']);
  TEX[B.COAL] = bake(
    ['#808080','#686868','#989898','#1a1a1a','#2d2d2d'],
    ['00100010','01033010','03440300','13443010','00334100','01033010','10100101','01010010']);
  TEX[B.DIAMOND] = bake(
    ['#808080','#686868','#989898','#00bcd4','#00acc1','#80deea'],
    ['00100010','01033010','03553300','13554510','00354100','01433010','10100101','01010010']);
  TEX[B.WOOD] = bake(
    ['#7d4c12','#9e6420','#5c3409','#b07830'],
    ['01230101','10012310','23101023','30123012','01230101','10012310','23101023','30123012']);
  TEX[B.LEAVES] = bake(
    ['#2e7d32','#388e3c','#43a047','#1b5e20','#4caf50'],
    ['12031421','40124012','21403240','02140214','14024021','40124012','21401240','13214021']);
}

// ═══════════════════════════════════════════════════════
// WORLD
// ═══════════════════════════════════════════════════════
let world = new Uint8Array(WORLD_W * WORLD_H);
const get = (x,y) => (x<0||x>=WORLD_W||y<0||y>=WORLD_H) ? B.BEDROCK : world[y*WORLD_W+x];
const set = (x,y,t) => { if(x>=0&&x<WORLD_W&&y>=0&&y<WORLD_H) world[y*WORLD_W+x]=t; };
const solid = (x,y) => { const t=get(x,y); return t!==B.AIR&&t!==B.LEAVES; };

function genWorld() {
  world.fill(B.AIR);
  const H = [];
  let h = 4;
  for (let x=0; x<WORLD_W; x++) {
    h += Math.round((Math.random()-0.5)*1.8);
    H[x] = Math.max(3, Math.min(6, h));
  }
  for (let x=0; x<WORLD_W; x++) {
    const s = H[x];
    set(x, WORLD_H-1, B.BEDROCK);
    set(x, s, B.GRASS);
    for (let y=s+1; y<=s+3&&y<WORLD_H-1; y++) set(x,y,B.DIRT);
    for (let y=s+4; y<WORLD_H-1; y++) set(x,y,B.STONE);
  }
  // Ores
  let diamonds = 0;
  for (let x=1; x<WORLD_W-1; x++) for (let y=1; y<WORLD_H-1; y++) {
    if (get(x,y)!==B.STONE) continue;
    const r = Math.random();
    if (r<0.07) set(x,y,B.COAL);
    else if (r<0.075 && y>=WORLD_H-5) { set(x,y,B.DIAMOND); diamonds++; }
  }
  // Guarantee minimum diamonds
  while (diamonds < 8) {
    const x = 2+Math.floor(Math.random()*(WORLD_W-4));
    const y = WORLD_H-3 + Math.floor(Math.random()*2);
    if (get(x,y)===B.STONE) { set(x,y,B.DIAMOND); diamonds++; }
  }
  // Trees
  for (let x=2; x<WORLD_W-2; x++) {
    const s = H[x];
    if (get(x,s)===B.GRASS && Math.random()<0.13 && get(x-1,s-1)===B.AIR && get(x+1,s-1)===B.AIR) {
      for (let y=s-1; y>=s-3; y--) set(x,y,B.WOOD);
      for (let dx=-1; dx<=1; dx++) for (let dy=-4; dy<=-2; dy++)
        if (get(x+dx,s+dy)===B.AIR) set(x+dx,s+dy,B.LEAVES);
    }
  }
}

// ═══════════════════════════════════════════════════════
// AUDIO
// ═══════════════════════════════════════════════════════
let _ac = null;
function ac() {
  if (!_ac) _ac = new (window.AudioContext||window.webkitAudioContext)();
  if (_ac.state==='suspended') _ac.resume();
  return _ac;
}
function tone(f,t,d,v,delay=0) {
  try {
    const c=ac(), o=c.createOscillator(), g=c.createGain();
    o.connect(g); g.connect(c.destination);
    o.type=t; o.frequency.value=f;
    g.gain.setValueAtTime(v, c.currentTime+delay);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime+delay+d);
    o.start(c.currentTime+delay); o.stop(c.currentTime+delay+d+0.01);
  } catch(_){}
}
const sfxDig     = () => tone(120,'square',0.07,0.18);
const sfxBreak   = () => { tone(200,'square',0.09,0.18); tone(140,'square',0.07,0.12,0.06); };
const sfxCollect = () => { tone(880,'sine',0.1,0.22); tone(1175,'sine',0.12,0.18,0.08); };
const sfxJump    = () => { tone(300,'sine',0.08,0.18); tone(420,'sine',0.06,0.12,0.05); };
const sfxHurt    = () => tone(160,'sawtooth',0.3,0.25);
const sfxExplode = () => { tone(80,'sawtooth',0.5,0.3); tone(55,'square',0.4,0.22,0.1); };

// Background music – ambient Minecraft-style C minor loop
const Music = (() => {
  const mel = [[130,0.8],[0,0.3],[155,0.4],[174,0.6],[0,0.2],[196,0.5],[220,1.0],[0,0.4],
               [174,0.4],[155,0.6],[0,0.3],[130,0.5],[110,0.8],[0,0.5],[130,1.2],[0,0.6]];
  const DUR = mel.reduce((s,[,d])=>s+d,0);
  let playing=false, master=null, timer=null;
  function loop() {
    if (!playing) return;
    const c=ac(); let t=c.currentTime+0.05;
    for (const [f,d] of mel) {
      if (f>0) {
        const o=c.createOscillator(), g=c.createGain();
        o.connect(g); g.connect(master);
        o.type='sine'; o.frequency.value=f;
        g.gain.setValueAtTime(0.14,t);
        g.gain.exponentialRampToValueAtTime(0.001,t+d*0.88);
        o.start(t); o.stop(t+d);
      }
      t+=d;
    }
    timer = setTimeout(loop,(DUR-0.2)*1000);
  }
  return {
    start() { if(playing)return; playing=true; const c=ac(); master=c.createGain(); master.gain.value=1; master.connect(c.destination); loop(); },
    stop()  { playing=false; clearTimeout(timer); if(master){master.disconnect();master=null;} },
    toggle(){ if(playing)this.stop(); else this.start(); return playing; },
    isOn()  { return playing; },
  };
})();

// ═══════════════════════════════════════════════════════
// GAME STATE
// ═══════════════════════════════════════════════════════
let state = 'menu'; // menu | playing | gameover
let camX = 0, timeLeft = GAME_SEC, digTimer = 0, spawnTimer = 10;
let musicOn = false;

const player = { x:0, y:0, vx:0, vy:0, onGround:false, facing:1,
  walkFrame:0, walkTimer:0, health:3, invTimer:0, breakTarget:null, score:0 };

let creepers=[], items=[], particles=[];

function spawnPlayer() {
  // Place on surface near center
  const bx = Math.floor(WORLD_W/2);
  let by = 0;
  while (by<WORLD_H && get(bx,by)===B.AIR) by++;
  player.x = bx*TILE + TILE/2;
  player.y = by*TILE - 2;
  player.vx=0; player.vy=0; player.onGround=false;
  player.health=3; player.invTimer=0; player.breakTarget=null; player.score=0;
  player.walkFrame=0; player.walkTimer=0; player.facing=1;
}

function spawnCreeper() {
  if (creepers.filter(c=>!c.dead).length >= MAX_CREEP) return;
  const side = Math.random()<0.5 ? -1 : 1;
  let px = player.x + side*(8+Math.random()*12)*TILE;
  px = Math.max(TILE, Math.min((WORLD_W-1)*TILE, px));
  const bx = Math.floor(px/TILE);
  let by=0; while(by<WORLD_H && get(bx,by)===B.AIR) by++;
  creepers.push({ x:bx*TILE+TILE/2, y:by*TILE-2, vx:side*-CREEP_SPEED, vy:0,
    onGround:false, facing:-side, explodeTimer:0, flashTimer:0, dead:false });
}

function startGame() {
  genWorld(); spawnPlayer();
  creepers=[]; items=[]; particles=[];
  timeLeft=GAME_SEC; spawnTimer=8; digTimer=0;
  state='playing';
  spawnCreeper(); spawnCreeper();
  Music.start(); musicOn=true;
}
function resetGame() { Music.stop(); musicOn=false; state='menu'; }

// ═══════════════════════════════════════════════════════
// PHYSICS (shared)
// ═══════════════════════════════════════════════════════
function physEnt(e, dt, hw, ph) {
  e.vy = Math.min(e.vy + GRAV*dt, 700);
  // X
  e.x += e.vx*dt;
  const top = e.y-ph+4, bot = e.y-4;
  if (e.vx>0) {
    const bx=Math.floor((e.x+hw)/TILE);
    if (solid(bx,Math.floor(top/TILE))||solid(bx,Math.floor(bot/TILE))) { e.x=bx*TILE-hw; e.vx=0; }
  } else if (e.vx<0) {
    const bx=Math.floor((e.x-hw)/TILE);
    if (solid(bx,Math.floor(top/TILE))||solid(bx,Math.floor(bot/TILE))) { e.x=(bx+1)*TILE+hw; e.vx=0; }
  }
  e.x = Math.max(hw, Math.min(WORLD_W*TILE-hw, e.x));
  // Y
  e.y += e.vy*dt;
  const c1=Math.floor((e.x-hw+2)/TILE), c2=Math.floor((e.x+hw-2)/TILE);
  e.onGround = false;
  if (e.vy>0) {
    const by=Math.floor(e.y/TILE);
    if (solid(c1,by)||solid(c2,by)) { e.y=by*TILE; e.vy=0; e.onGround=true; }
  } else if (e.vy<0) {
    const by=Math.floor((e.y-ph)/TILE);
    if (solid(c1,by)||solid(c2,by)) { e.y=(by+1)*TILE+ph; e.vy=0; }
  }
}

// ═══════════════════════════════════════════════════════
// MINING
// ═══════════════════════════════════════════════════════
let mouseHeld=false, mouseWX=0, mouseWY=0;

function updateMining(dt) {
  const mining = keys['KeyE']||keys['KeyZ']||btns.mine||mouseHeld;
  if (!mining) { player.breakTarget=null; digTimer=0; return; }

  // Target: mouse position (world) or block in front
  let tbx, tby;
  if (mouseHeld) {
    tbx=Math.floor(mouseWX/TILE); tby=Math.floor(mouseWY/TILE);
  } else {
    tbx=Math.floor(player.x/TILE)+player.facing;
    tby=Math.floor((player.y-PH*0.55)/TILE);
    if (get(tbx,tby)===B.AIR) {
      const fy=Math.floor((player.y-6)/TILE);
      tby = get(tbx,fy)!==B.AIR ? fy : Math.floor((player.y-PH*0.85)/TILE);
    }
  }
  const type=get(tbx,tby);
  if (type===B.AIR||type===B.BEDROCK) { player.breakTarget=null; return; }

  // Range check (4 tiles)
  const dist=Math.hypot((tbx+0.5)*TILE-player.x, (tby+0.5)*TILE-(player.y-PH/2));
  if (dist>4*TILE) { player.breakTarget=null; return; }

  if (!player.breakTarget||player.breakTarget.bx!==tbx||player.breakTarget.by!==tby) {
    player.breakTarget={bx:tbx, by:tby, progress:0}; digTimer=0;
  }
  player.breakTarget.progress += dt/HARD[type];

  digTimer-=dt;
  if (digTimer<=0) { sfxDig(); digTimer=0.2; }

  if (player.breakTarget.progress>=1) {
    breakBlock(tbx,tby); player.breakTarget=null; digTimer=0;
  }
}

function breakBlock(bx,by) {
  const t=get(bx,by); set(bx,by,B.AIR);
  sfxBreak();
  // Particles
  for (let i=0;i<7;i++) particles.push({
    x:bx*TILE+TILE/2, y:by*TILE+TILE/2,
    vx:(Math.random()-0.5)*220, vy:Math.random()*-220-60,
    life:0.7, maxLife:0.7, color:BCOLOR[t]||'#888', size:3+Math.random()*4
  });
  if (t===B.DIAMOND) {
    items.push({x:bx*TILE+TILE/2, y:by*TILE, vy:-180, t:0, collected:false});
  }
  player.score += t===B.DIAMOND ? 0 : 1; // diamonds scored on collect
}

// ═══════════════════════════════════════════════════════
// UPDATE
// ═══════════════════════════════════════════════════════
function update(dt) {
  // ── Timer ──
  timeLeft -= dt;
  if (timeLeft<=0) { timeLeft=0; endGame(); return; }

  // ── Player ──
  player.vx=0;
  if (keys['ArrowLeft']||keys['KeyA']||btns.left)  { player.vx=-MOVE; player.facing=-1; }
  if (keys['ArrowRight']||keys['KeyD']||btns.right) { player.vx= MOVE; player.facing= 1; }
  if ((btns.jump)&&player.onGround) { player.vy=-JUMP; player.onGround=false; sfxJump(); }
  physEnt(player, dt, PW/2, PH);
  if (player.invTimer>0) player.invTimer-=dt;

  // Walk animation
  if (player.vx!==0&&player.onGround) {
    player.walkTimer+=dt;
    if (player.walkTimer>0.14) { player.walkTimer=0; player.walkFrame^=1; }
  } else player.walkFrame=0;

  updateMining(dt);

  // ── Creepers ──
  spawnTimer-=dt;
  if (spawnTimer<=0) { spawnCreeper(); spawnTimer=12+Math.random()*6; }

  for (const cr of creepers) {
    if (cr.dead) continue;
    if (cr.explodeTimer>0) {
      cr.explodeTimer-=dt; cr.flashTimer-=dt;
      if (cr.explodeTimer<=0) cr.dead=true;
      continue;
    }
    const dx=player.x-cr.x, dist=Math.abs(dx);
    cr.vx = dist<7*TILE ? Math.sign(dx)*CREEP_SPEED*1.6 : cr.facing*CREEP_SPEED;
    cr.facing=Math.sign(cr.vx)||cr.facing;
    // Wall/gap turn
    const fx=Math.floor((cr.x+cr.facing*18)/TILE), fy=Math.floor(cr.y/TILE);
    if (solid(fx,fy-1)||(cr.onGround&&!solid(fx,fy))) { cr.facing*=-1; cr.vx*=-1; }
    physEnt(cr, dt, 13, 52);
    // Hit player
    if (player.invTimer<=0) {
      const px=Math.abs(cr.x-player.x), py=Math.abs(cr.y-player.y);
      if (px<28&&py<56) {
        player.health--; player.invTimer=1.8;
        cr.explodeTimer=0.6; cr.flashTimer=0.6;
        sfxHurt(); sfxExplode();
        for (let i=0;i<12;i++) particles.push({
          x:cr.x, y:cr.y-26,
          vx:(Math.random()-0.5)*350, vy:Math.random()*-280-80,
          life:0.8, maxLife:0.8, color:'#7cbb4e', size:4+Math.random()*5
        });
        if (player.health<=0) { endGame(); return; }
      }
    }
  }
  creepers=creepers.filter(c=>!c.dead);

  // ── Items ──
  for (const it of items) {
    if (it.collected) continue;
    it.t+=dt; it.vy+=GRAV*dt*0.5;
    it.y+=it.vy*dt;
    const by=Math.floor(it.y/TILE), bx=Math.floor(it.x/TILE);
    if (solid(bx,by)) { it.y=by*TILE; it.vy=-120; }
    if (Math.abs(it.x-player.x)<32&&Math.abs(it.y-player.y)<60) {
      it.collected=true; player.score+=10; sfxCollect();
    }
  }
  items=items.filter(i=>!i.collected);

  // ── Particles ──
  for (const p of particles) { p.x+=p.vx*dt; p.y+=p.vy*dt; p.vy+=GRAV*dt*0.25; p.life-=dt; }
  particles=particles.filter(p=>p.life>0);

  // ── Camera ──
  camX=Math.max(0, Math.min(player.x-CW/2, WORLD_W*TILE-CW));
}

function endGame() {
  const hs=parseInt(localStorage.getItem('mc_hs')||'0');
  if (player.score>hs) localStorage.setItem('mc_hs', player.score);
  state='gameover';
}

// ═══════════════════════════════════════════════════════
// RENDERING
// ═══════════════════════════════════════════════════════
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
canvas.width=CW; canvas.height=CH;

function fitCanvas() {
  const s=Math.min(window.innerWidth/CW, window.innerHeight/CH);
  canvas.style.width=Math.round(CW*s)+'px';
  canvas.style.height=Math.round(CH*s)+'px';
}

function drawSky() {
  const t=state==='playing' ? 1-(timeLeft/GAME_SEC) : 0;
  const r=Math.round(135-t*115), g=Math.round(206-t*191), b=Math.round(235-t*210);
  const grad=ctx.createLinearGradient(0,0,0,CH);
  grad.addColorStop(0,`rgb(${r},${g},${b})`);
  grad.addColorStop(1,`rgb(${Math.round(r*0.6)},${Math.round(g*0.7)},${Math.round(b*0.8)})`);
  ctx.fillStyle=grad; ctx.fillRect(0,0,CW,CH);

  // Sun/moon
  if (t<0.65) {
    const sx=50+t*(CW-100), sy=30+Math.sin(t*Math.PI)*20;
    ctx.fillStyle=`rgba(255,220,50,${1-t*1.3})`;
    ctx.beginPath(); ctx.arc(sx,sy,18,0,Math.PI*2); ctx.fill();
    // Sun rays
    ctx.strokeStyle=`rgba(255,240,100,${0.5*(1-t*1.5)})`;
    ctx.lineWidth=2;
    for (let i=0;i<8;i++) {
      const a=i*Math.PI/4, r1=22, r2=30;
      ctx.beginPath(); ctx.moveTo(sx+Math.cos(a)*r1,sy+Math.sin(a)*r1);
      ctx.lineTo(sx+Math.cos(a)*r2,sy+Math.sin(a)*r2); ctx.stroke();
    }
  }
  if (t>0.5) {
    const alpha=Math.min(1,(t-0.5)/0.2);
    ctx.fillStyle=`rgba(220,225,255,${alpha})`;
    ctx.beginPath(); ctx.arc(CW-70,25,14,0,Math.PI*2); ctx.fill();
    // Stars
    ctx.fillStyle=`rgba(255,255,255,${alpha})`;
    [[80,18],[200,12],[350,22],[490,8],[560,30],[130,38],[440,15],[30,45],[620,10]].forEach(([x,y])=>ctx.fillRect(x,y,2,2));
  }
  // Clouds
  if (t<0.6) {
    ctx.fillStyle=`rgba(255,255,255,${0.7*(1-t/0.6)})`;
    [[80,45,60,16],[280,35,80,18],[500,50,50,14],[180,60,40,12]].forEach(([cx,cy,cw,ch])=>{
      ctx.beginPath(); ctx.ellipse(cx,cy,cw,ch,0,0,Math.PI*2); ctx.fill();
    });
  }
}

function drawWorld() {
  const sx0=Math.max(0,Math.floor(camX/TILE));
  const sx1=Math.min(WORLD_W,sx0+Math.ceil(CW/TILE)+2);
  ctx.imageSmoothingEnabled=false;
  for (let by=0;by<WORLD_H;by++) {
    for (let bx=sx0;bx<sx1;bx++) {
      const t=get(bx,by); if(t===B.AIR) continue;
      const sx=bx*TILE-camX, sy=by*TILE;
      if (TEX[t]) ctx.drawImage(TEX[t],sx,sy,TILE,TILE);
      else { ctx.fillStyle=BCOLOR[t]||'#888'; ctx.fillRect(sx,sy,TILE,TILE); }
      // Subtle grid
      ctx.strokeStyle='rgba(0,0,0,0.1)'; ctx.lineWidth=0.5;
      ctx.strokeRect(sx+0.5,sy+0.5,TILE-1,TILE-1);
      // Mining overlay
      if (player.breakTarget&&player.breakTarget.bx===bx&&player.breakTarget.by===by) {
        const p=player.breakTarget.progress;
        ctx.fillStyle=`rgba(0,0,0,${p*0.72})`; ctx.fillRect(sx,sy,TILE,TILE);
        ctx.strokeStyle=`rgba(255,255,255,${p*0.6})`; ctx.lineWidth=1.5;
        const cr=(v)=>v*TILE;
        if(p>0.2){ctx.beginPath();ctx.moveTo(sx+cr(0.2),sy+cr(0.1));ctx.lineTo(sx+cr(0.6),sy+cr(0.5));ctx.stroke();}
        if(p>0.45){ctx.beginPath();ctx.moveTo(sx+cr(0.7),sy+cr(0.15));ctx.lineTo(sx+cr(0.4),sy+cr(0.7));ctx.stroke();}
        if(p>0.7){ctx.beginPath();ctx.moveTo(sx+cr(0.1),sy+cr(0.6));ctx.lineTo(sx+cr(0.8),sy+cr(0.4));ctx.stroke();}
      }
    }
  }
}

function drawSteve(x, y, facing, frame, hurt) {
  if (hurt&&Math.floor(Date.now()/80)%2===0) return;
  const sx=x-camX, sy=y;
  ctx.save();
  if (facing<0) { ctx.translate(sx*2,0); ctx.scale(-1,1); }
  const px=sx-14;
  // Head
  ctx.fillStyle='#f5c185'; ctx.fillRect(px+4,sy-62,24,22);
  ctx.fillStyle='#5c3d1e'; ctx.fillRect(px+4,sy-62,24,7);
  // Eyes
  ctx.fillStyle='#2c2c2c';
  ctx.fillRect(px+7,sy-51,6,7); ctx.fillRect(px+19,sy-51,6,7);
  // Body (blue shirt)
  ctx.fillStyle='#3d5afe'; ctx.fillRect(px+2,sy-40,24,18);
  // Arms
  ctx.fillStyle='#f5c185';
  ctx.fillRect(px-4,sy-39,6,14); ctx.fillRect(px+26,sy-39,6,14);
  // Shirt detail
  ctx.fillStyle='#1565c0'; ctx.fillRect(px+9,sy-36,10,4);
  // Legs
  const l1=frame?8:0, l2=frame?0:8;
  ctx.fillStyle='#1565c0'; ctx.fillRect(px+2,sy-22,10,22-l1);
  ctx.fillStyle='#0d47a1'; ctx.fillRect(px+14,sy-22,10,22-l2);
  ctx.restore();
}

function drawCreeper(cr) {
  const sx=cr.x-camX, sy=cr.y;
  const flash=cr.flashTimer>0&&Math.floor(Date.now()/60)%2===0;
  if (flash) { ctx.fillStyle='rgba(255,255,200,0.7)'; ctx.fillRect(sx-16,sy-55,32,56); }
  ctx.save();
  if (cr.facing<0) { ctx.translate(sx*2,0); ctx.scale(-1,1); }
  const px=sx-12;
  ctx.fillStyle='#4caf50'; ctx.fillRect(px,sy-54,24,54);
  ctx.fillStyle='#388e3c';
  for(let r=0;r<6;r++) for(let k=0;k<3;k++) if((r+k)%2===0) ctx.fillRect(px+k*8,sy-54+r*9,7,8);
  // Face
  ctx.fillStyle='#1b5e20';
  ctx.fillRect(px+3,sy-48,7,8); ctx.fillRect(px+14,sy-48,7,8); // eyes
  ctx.fillRect(px+10,sy-37,5,5); // nose
  ctx.fillRect(px+4,sy-29,5,5); ctx.fillRect(px+9,sy-24,7,5); ctx.fillRect(px+16,sy-29,5,5); // mouth
  ctx.restore();
}

function drawDiamondItem(it) {
  const bob=Math.sin(it.t*3.5)*5;
  const sx=it.x-camX, sy=it.y-16+bob;
  ctx.save(); ctx.translate(sx,sy); ctx.rotate(it.t*1.8);
  ctx.fillStyle='#00e5ff'; ctx.strokeStyle='#0097a7'; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(0,-10); ctx.lineTo(9,0); ctx.lineTo(0,10); ctx.lineTo(-9,0); ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.restore();
}

function drawParticles() {
  for (const p of particles) {
    ctx.globalAlpha=p.life/p.maxLife;
    ctx.fillStyle=p.color;
    ctx.fillRect(p.x-camX-p.size/2, p.y-p.size/2, p.size, p.size);
  }
  ctx.globalAlpha=1;
}

function drawHUD() {
  // Hearts
  for (let i=0;i<player.maxHealth;i++) {
    ctx.font='22px serif';
    ctx.fillText(i<player.health?'❤️':'🖤', 10+i*28, 30);
  }
  // Score badge
  ctx.fillStyle='rgba(0,0,0,0.55)'; ctx.fillRect(CW/2-65,6,130,26);
  ctx.strokeStyle='rgba(255,255,255,0.2)'; ctx.lineWidth=1; ctx.strokeRect(CW/2-65,6,130,26);
  ctx.fillStyle='#00e5ff'; ctx.font='bold 13px "Courier New",monospace';
  ctx.textAlign='center'; ctx.fillText(`◆ ${player.score} pts`, CW/2, 24); ctx.textAlign='left';
  // Timer
  const secs=Math.ceil(timeLeft), m=Math.floor(secs/60), s=(secs%60).toString().padStart(2,'0');
  ctx.fillStyle='rgba(0,0,0,0.55)'; ctx.fillRect(CW-88,6,82,26);
  ctx.strokeStyle='rgba(255,255,255,0.2)'; ctx.lineWidth=1; ctx.strokeRect(CW-88,6,82,26);
  ctx.fillStyle=timeLeft<15?'#ff5555':'white'; ctx.font='bold 13px "Courier New",monospace';
  ctx.textAlign='right'; ctx.fillText(`⏱ ${m}:${s}`, CW-6, 24); ctx.textAlign='left';
  // Music toggle
  ctx.fillStyle='rgba(0,0,0,0.45)'; ctx.fillRect(CW-46,CH-38,38,30);
  ctx.font='18px serif'; ctx.textAlign='center';
  ctx.fillText(musicOn?'🎵':'🔇', CW-27, CH-17); ctx.textAlign='left';
  // Mining bar
  if (player.breakTarget) {
    const p=player.breakTarget.progress;
    ctx.fillStyle='rgba(0,0,0,0.55)'; ctx.fillRect(CW/2-65,CH-30,130,14);
    ctx.fillStyle='#F59E0B'; ctx.fillRect(CW/2-65,CH-30,130*p,14);
    ctx.strokeStyle='#aaa'; ctx.lineWidth=1; ctx.strokeRect(CW/2-65,CH-30,130,14);
    ctx.fillStyle='white'; ctx.font='10px "Courier New",monospace';
    ctx.textAlign='center'; ctx.fillText('Mining...', CW/2, CH-20); ctx.textAlign='left';
  }
}

// Mobile button layout
const BTNS_DEF = {
  left:  {x:14, y:CH-80, w:60, h:60},
  right: {x:82, y:CH-80, w:60, h:60},
  jump:  {x:CW-82, y:CH-80, w:60, h:60},
  mine:  {x:CW-150, y:CH-80, w:60, h:60},
};
const BTN_LABELS = {left:'←',right:'→',jump:'↑',mine:'⛏'};

function drawMobileControls() {
  ctx.save();
  Object.entries(BTNS_DEF).forEach(([name,b])=>{
    const active=btns[name];
    ctx.fillStyle=active?'rgba(255,255,255,0.3)':'rgba(0,0,0,0.3)';
    ctx.strokeStyle='rgba(255,255,255,0.55)'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.roundRect(b.x,b.y,b.w,b.h,10); ctx.fill(); ctx.stroke();
    ctx.fillStyle='white'; ctx.font='bold 26px sans-serif'; ctx.textAlign='center';
    ctx.fillText(BTN_LABELS[name], b.x+b.w/2, b.y+b.h/2+10);
  });
  ctx.textAlign='left'; ctx.restore();
}

function renderMenu() {
  drawSky();
  // Decorative ground strip
  for (let i=0;i<16;i++) {
    ctx.imageSmoothingEnabled=false;
    if(TEX[B.GRASS]) ctx.drawImage(TEX[B.GRASS],i*40,CH-80,40,40);
    if(TEX[B.DIRT])  ctx.drawImage(TEX[B.DIRT], i*40,CH-40,40,40);
  }
  // Title panel
  ctx.fillStyle='rgba(0,0,0,0.62)'; ctx.fillRect(CW/2-190,60,380,300);
  ctx.strokeStyle='#5a9e2e'; ctx.lineWidth=3; ctx.strokeRect(CW/2-190,60,380,300);
  // Title shadow
  ctx.fillStyle='#2d5e16'; ctx.font='bold 38px "Press Start 2P","Courier New",monospace';
  ctx.textAlign='center'; ctx.fillText('MINECRAFT',CW/2+2,126);
  ctx.fillStyle='#7cbb4e'; ctx.fillText('MINECRAFT',CW/2,124);
  ctx.fillStyle='#aaa'; ctx.font='bold 11px "Press Start 2P","Courier New",monospace';
  ctx.fillText('MINI ADVENTURE',CW/2,152);
  // Info
  ctx.fillStyle='white'; ctx.font='12px "Courier New",monospace';
  ctx.fillText('Mine • Collect ◆ Diamonds • Dodge Creepers',CW/2,192);
  ctx.fillStyle='#7c8896'; ctx.fillText('90 seconds · collect as many ◆ as possible',CW/2,214);
  // High score
  const hs=parseInt(localStorage.getItem('mc_hs')||'0');
  ctx.fillStyle='#fbbf24'; ctx.font='bold 13px "Courier New",monospace';
  ctx.fillText(`★ Best Score: ${hs} pts`,CW/2,244);
  // Controls hint
  ctx.fillStyle='#7c8896'; ctx.font='11px "Courier New",monospace';
  ctx.fillText('WASD / ← → ↑  |  E / click = Mine',CW/2,272);
  // Play button
  const hy=btnHover(CW/2-90,296,180,44);
  ctx.fillStyle=hy?'#7cbb4e':'#5a9e2e';
  ctx.fillRect(CW/2-90,296,180,44);
  ctx.strokeStyle='#2d5e16'; ctx.lineWidth=2; ctx.strokeRect(CW/2-90,296,180,44);
  ctx.fillStyle='white'; ctx.font='bold 16px "Courier New",monospace';
  ctx.fillText('▶  PLAY',CW/2,324);
  ctx.textAlign='left';
}

function renderGameOver() {
  // Freeze world render behind overlay
  drawSky(); drawWorld();
  ctx.fillStyle='rgba(0,0,0,0.72)'; ctx.fillRect(0,0,CW,CH);
  ctx.fillStyle='rgba(80,0,0,0.85)'; ctx.fillRect(CW/2-170,90,340,310);
  ctx.strokeStyle='#b71c1c'; ctx.lineWidth=3; ctx.strokeRect(CW/2-170,90,340,310);
  ctx.fillStyle='#ef5350'; ctx.font='bold 28px "Press Start 2P","Courier New",monospace';
  ctx.textAlign='center'; ctx.fillText('GAME OVER',CW/2,140);
  ctx.fillStyle='white'; ctx.font='bold 18px "Courier New",monospace';
  ctx.fillText(`Score: ${player.score} pts`,CW/2,180);
  const hs=parseInt(localStorage.getItem('mc_hs')||'0');
  if (player.score>=hs&&player.score>0) {
    ctx.fillStyle='#fbbf24'; ctx.font='bold 14px "Courier New",monospace';
    ctx.fillText('✦ NEW BEST! ✦',CW/2,210);
  } else {
    ctx.fillStyle='#888'; ctx.font='13px "Courier New",monospace';
    ctx.fillText(`Best: ${hs} pts`,CW/2,210);
  }
  ctx.fillStyle='#00e5ff'; ctx.font='bold 14px "Courier New",monospace';
  const diams=Math.floor(player.score/10);
  ctx.fillText(`◆ ${diams} Diamond${diams!==1?'s':''}`,CW/2,240);
  ctx.fillStyle='#aaa'; ctx.font='12px "Courier New",monospace';
  ctx.fillText(`Blocks mined: ${player.score-diams*10}`,CW/2,265);
  // Buttons
  const hy1=btnHover(CW/2-80,295,160,42);
  ctx.fillStyle=hy1?'#5a9e2e':'#3d7a21';
  ctx.fillRect(CW/2-80,295,160,42);
  ctx.strokeStyle='#2d5e16'; ctx.lineWidth=2; ctx.strokeRect(CW/2-80,295,160,42);
  ctx.fillStyle='white'; ctx.font='bold 14px "Courier New",monospace';
  ctx.fillText('PLAY AGAIN',CW/2,322);
  const hy2=btnHover(CW/2-80,347,160,38);
  ctx.fillStyle=hy2?'rgba(80,80,80,0.8)':'rgba(40,40,40,0.8)';
  ctx.fillRect(CW/2-80,347,160,38);
  ctx.strokeStyle='#555'; ctx.lineWidth=1; ctx.strokeRect(CW/2-80,347,160,38);
  ctx.fillStyle='#aaa'; ctx.font='bold 12px "Courier New",monospace';
  ctx.fillText('⌂ HOME',CW/2,371);
  ctx.textAlign='left';
}

// ═══════════════════════════════════════════════════════
// MAIN RENDER
// ═══════════════════════════════════════════════════════
function render() {
  ctx.clearRect(0,0,CW,CH);
  if (state==='menu') { renderMenu(); return; }
  if (state==='gameover') { renderGameOver(); return; }
  // Playing
  drawSky();
  drawWorld();
  drawParticles();
  items.forEach(it=>drawDiamondItem(it));
  creepers.forEach(cr=>drawCreeper(cr));
  drawSteve(player.x, player.y, player.facing, player.walkFrame, player.invTimer>0);
  drawHUD();
  if (isMobile) drawMobileControls();
}

// ═══════════════════════════════════════════════════════
// INPUT
// ═══════════════════════════════════════════════════════
const keys = {};
const btns = {left:false,right:false,jump:false,mine:false};
const isMobile = 'ontouchstart' in window;
let mouseX=0, mouseY=0;

function btnHover(bx,by,bw,bh) {
  return mouseX>=bx&&mouseX<=bx+bw&&mouseY>=by&&mouseY<=by+bh;
}
function canvasPos(e) {
  const r=canvas.getBoundingClientRect();
  const s=CW/r.width;
  return {x:(e.clientX-r.left)*s, y:(e.clientY-r.top)*s};
}
function handleClick(cx,cy) {
  if (state==='menu') {
    if (btnHover(CW/2-90,296,180,44)) startGame();
    return;
  }
  if (state==='gameover') {
    if (btnHover(CW/2-80,295,160,42)) startGame();
    if (btnHover(CW/2-80,347,160,38)) resetGame();
    return;
  }
  // Music toggle
  if (cx>=CW-46&&cx<=CW-8&&cy>=CH-38&&cy<=CH-8) { musicOn=Music.toggle(); return; }
  // Mine click
  mouseHeld=true; mouseWX=cx+camX; mouseWY=cy;
}

document.addEventListener('keydown', e=>{
  keys[e.code]=true;
  if (state==='playing') {
    if (e.code==='Space'||e.code==='ArrowUp'||e.code==='KeyW') {
      if (player.onGround) { player.vy=-JUMP; player.onGround=false; sfxJump(); }
    }
  }
  if ((e.code==='Space'||e.code==='Enter')&&state==='menu') startGame();
  if ((e.code==='Space'||e.code==='Enter')&&state==='gameover') startGame();
  if (e.code==='KeyM') { musicOn=Music.toggle(); }
  if (['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)) e.preventDefault();
});
document.addEventListener('keyup', e=>{ keys[e.code]=false; });

canvas.addEventListener('mousedown', e=>{
  const {x,y}=canvasPos(e); mouseX=x; mouseY=y;
  handleClick(x,y);
});
canvas.addEventListener('mouseup', ()=>{ mouseHeld=false; mouseWX=0; mouseWY=0; });
canvas.addEventListener('mousemove', e=>{
  const {x,y}=canvasPos(e); mouseX=x; mouseY=y;
  if (mouseHeld&&state==='playing') { mouseWX=x+camX; mouseWY=y; }
});

// Touch
function applyTouches(e) {
  e.preventDefault();
  const r=canvas.getBoundingClientRect(), s=CW/r.width;
  btns.left=btns.right=btns.jump=btns.mine=false;
  for (const t of e.touches) {
    const tx=(t.clientX-r.left)*s, ty=(t.clientY-r.top)*s;
    Object.entries(BTNS_DEF).forEach(([name,b])=>{
      if(tx>=b.x&&tx<=b.x+b.w&&ty>=b.y&&ty<=b.y+b.h) btns[name]=true;
    });
  }
}
canvas.addEventListener('touchstart',  e=>{ if(e.touches.length===1){const {x,y}=canvasPos(e.touches[0]); handleClick(x,y);} applyTouches(e); },{passive:false});
canvas.addEventListener('touchmove',   applyTouches,{passive:false});
canvas.addEventListener('touchend',    applyTouches,{passive:false});
canvas.addEventListener('touchcancel', applyTouches,{passive:false});

// Jump on touch jump btn
canvas.addEventListener('touchstart', e=>{
  const r=canvas.getBoundingClientRect(), s=CW/r.width;
  for (const t of e.touches) {
    const tx=(t.clientX-r.left)*s, ty=(t.clientY-r.top)*s;
    const b=BTNS_DEF.jump;
    if(tx>=b.x&&tx<=b.x+b.w&&ty>=b.y&&ty<=b.y+b.h&&player.onGround&&state==='playing'){
      player.vy=-JUMP; player.onGround=false; sfxJump();
    }
  }
},{passive:false});

// ═══════════════════════════════════════════════════════
// GAME LOOP
// ═══════════════════════════════════════════════════════
let last=0;
function loop(ts) {
  const dt=Math.min((ts-last)/1000, 0.05); last=ts;
  if (state==='playing') update(dt);
  render();
  requestAnimationFrame(loop);
}

// ── INIT ──
bakeAll();
window.addEventListener('resize', fitCanvas); fitCanvas();
requestAnimationFrame(ts=>{ last=ts; requestAnimationFrame(loop); });
