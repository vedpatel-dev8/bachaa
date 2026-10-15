'use strict';

/* =====================================================================
   ✏️  EDIT THIS PART TO MAKE IT YOURS
   Everything personal lives in CONFIG. You don't need to touch the rest.
   ===================================================================== */
const CONFIG = {
  herName: 'Yatu',
  myName: 'Ved',

  // Put your song at music/song.mp3. If the file isn't there, a soft
  // built-in melody plays instead, so the page always has music.
  musicFile: 'music/song.mp3',

  // Leave '' for a letter anyone can open. Or set a secret word she must type,
  // e.g. secretCode: 'forever', and give her a hint below.
  secretCode: '',
  secretHint: 'Hint: something I always promise you 💕',

  // Interactive apology messages (use {name} to insert her name)
  messages: [
    "I'm sorry for hurting you, {name}. Your feelings matter more to me than being right.",
    "You deserve to feel loved and respected every single day, and I fell short of that.",
    "I'm not only saying sorry. I'm promising to listen better and to think before I speak.",
    "Seeing you hurt because of me is one of the worst feelings in the world.",
    "You make my life brighter, softer and so much happier. I never want to dim that light.",
    "Take all the time you need. I'll be right here, loving you the whole time.",
    "I'm grateful for your patience, your heart and your love, {name}.",
    "Please let me make it up to you. I love you, today and always. 💗"
  ],

  // Photo gallery: drop your pictures into the photos/ folder, then match the names here.
  photos: [
    { src: 'photo1.jpg', caption: 'Us, being us 💕' },
    { src: 'photo2.jpg', caption: 'My favourite smile' },
    { src: 'photo3.jpg', caption: 'Where my heart lives' },
    { src: 'photo4.jpg', caption: 'Our happy place' },
    { src: 'photo5.jpg', caption: 'You + me = always' },
    { src: 'photo6.jpg', caption: 'My whole world' }
  ],

  // The secret love letter, one paragraph per line.
  // Tip: add a sentence or two about what really happened, in your own words.
  letter: [
    'My dearest {name},',
    "I keep thinking about the moment I hurt you, and it weighs on me more than I know how to say. You are the person I most want to protect in this world, and I failed at that when I hurt your feelings.",
    "There is no excuse that makes it okay. I wasn't as thoughtful, patient or kind as you deserve, and I'm truly sorry, not only for what happened but for how it made you feel.",
    "I want you to know that I hear you. Your feelings are never small to me. I will listen better, think before I speak, and show you with my actions, not just my words.",
    "Thank you for every time you've forgiven me, held my hand, and loved me even when I wasn't at my best. I never want to take that for granted.",
    "Whenever you're ready, I'm here: to talk, to listen, or simply to hold you.",
    'Forever yours,'
  ],

  // Little lines shown while the "No" button runs away 😄
  noTexts: ['No 😢', 'Are you sure? 🥺', 'Please? 💔', 'Think again 🥹', "Don't do this to me 😭", 'Pretty please? 🌸', 'Okay, I give up… say yes? 💗'],
  pleas: ['', 'Hey, come back here! 😆', 'I really am sorry 🥺', 'Look how big the Yes button is getting 💖', 'You know you want to 😘', "I'll bring chocolates! 🍫", 'Just click the pink one, love 💕']
};

/* =====================================================================
   Helpers
   ===================================================================== */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fill = (text) => text.replaceAll('{name}', CONFIG.herName);

document.title = 'For ' + CONFIG.herName + ' 💗';
$$('.her-name').forEach((el) => { el.textContent = CONFIG.herName; });
$$('.my-name').forEach((el) => { el.textContent = CONFIG.myName; });

/* =====================================================================
   Animated hearts
   ===================================================================== */
const HEARTS = ['💗', '💖', '💕', '💘', '🌸', '🩷', '❤️'];
const heartLayer = $('#hearts');
const randomHeart = () => HEARTS[Math.floor(Math.random() * HEARTS.length)];

function floatHeart() {
  if (reduceMotion || document.hidden || heartLayer.childElementCount > 45) return;
  const h = document.createElement('span');
  h.className = 'heart';
  h.textContent = randomHeart();
  h.style.left = Math.random() * 100 + 'vw';
  h.style.fontSize = 14 + Math.random() * 26 + 'px';
  h.style.animationDuration = 7 + Math.random() * 7 + 's';
  h.style.setProperty('--sway', Math.random() * 120 - 60 + 'px');
  h.style.setProperty('--rot', Math.random() * 60 - 30 + 'deg');
  heartLayer.appendChild(h);
  h.addEventListener('animationend', () => h.remove());
}
setInterval(floatHeart, 600);
for (let i = 0; i < 6; i++) setTimeout(floatHeart, i * 150);

function burst(x, y, count = 10) {
  if (reduceMotion) return;
  for (let i = 0; i < count; i++) {
    const h = document.createElement('span');
    h.className = 'burst-heart';
    h.textContent = randomHeart();
    const angle = Math.random() * Math.PI * 2;
    const dist = 60 + Math.random() * 110;
    h.style.left = x + 'px';
    h.style.top = y + 'px';
    h.style.fontSize = 16 + Math.random() * 18 + 'px';
    h.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
    h.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
    heartLayer.appendChild(h);
    h.addEventListener('animationend', () => h.remove());
  }
}

// Tap anywhere (except on controls) for a little burst of love
document.addEventListener('pointerdown', (e) => {
  if (e.target.closest('button, a, input, .lightbox')) return;
  burst(e.clientX, e.clientY, 6);
});

/* =====================================================================
   Background music (your mp3, or a soft built-in melody as backup)
   ===================================================================== */
const Synth = (() => {
  let ctx = null, master = null, timer = null, step = 0, next = 0, on = false;
  const STEP = 0.45;
  const bass = [130.81, 110.0, 87.31, 98.0];
  const chords = [
    [261.63, 329.63, 392.0],
    [220.0, 261.63, 329.63],
    [174.61, 220.0, 261.63],
    [196.0, 246.94, 293.66]
  ];
  const melody = [
    [659.25, 0, 0, 587.33, 0, 523.25, 0, 0],
    [440.0, 0, 523.25, 0, 659.25, 0, 0, 0],
    [523.25, 0, 0, 440.0, 0, 523.25, 587.33, 0],
    [587.33, 0, 0, 493.88, 0, 392.0, 0, 0]
  ];
  const pattern = [0, 1, 2, 1, 2, 1, 2, 1];

  function tone(freq, t, dur, vol, type = 'sine') {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(master);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  function schedule() {
    while (next < ctx.currentTime + 0.8) {
      const bar = Math.floor(step / 8) % 4;
      const s = step % 8;
      if (s === 0) tone(bass[bar], next, STEP * 7, 0.16, 'triangle');
      tone(chords[bar][pattern[s]], next, 1.1, 0.09);
      const m = melody[bar][s];
      if (m) {
        tone(m, next, 1.4, 0.1);
        tone(m * 2, next, 0.5, 0.025);
      }
      step++;
      next += STEP;
    }
  }

  function start() {
    if (on) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    if (!ctx) {
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0;
      const delay = ctx.createDelay();
      delay.delayTime.value = 0.32;
      const feedback = ctx.createGain();
      feedback.gain.value = 0.35;
      delay.connect(feedback);
      feedback.connect(delay);
      master.connect(ctx.destination);
      master.connect(delay);
      delay.connect(ctx.destination);
    }
    ctx.resume();
    on = true;
    next = ctx.currentTime + 0.1;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(0.9, ctx.currentTime, 0.4);
    schedule();
    timer = setInterval(schedule, 200);
  }

  function stop() {
    if (!on) return;
    on = false;
    clearInterval(timer);
    master.gain.setTargetAtTime(0, ctx.currentTime, 0.15);
  }

  return { start, stop };
})();

const audio = new Audio(CONFIG.musicFile);
audio.loop = true;
audio.volume = 0.65;
audio.preload = 'auto';

const musicBtn = $('#musicBtn');
let playing = false;
let useSynth = false;

audio.addEventListener('error', () => {
  useSynth = true;
  if (playing) Synth.start();
});

function updateMusicBtn() {
  musicBtn.textContent = playing ? '🎵' : '🔇';
  musicBtn.classList.toggle('playing', playing);
  musicBtn.classList.toggle('off', !playing);
  musicBtn.setAttribute('aria-pressed', String(playing));
}

async function startMusic() {
  playing = true;
  updateMusicBtn();
  if (!useSynth) {
    try {
      await audio.play();
      return;
    } catch (err) {
      useSynth = true; // song.mp3 missing or blocked: use the built-in melody
    }
  }
  Synth.start();
}

function stopMusic() {
  playing = false;
  audio.pause();
  Synth.stop();
  updateMusicBtn();
}

musicBtn.addEventListener('click', () => (playing ? stopMusic() : startMusic()));
updateMusicBtn();

/* =====================================================================
   Interactive apology messages
   ===================================================================== */
const msgs = CONFIG.messages.map(fill);
const msgText = $('#msgText');
const dotsBox = $('#dots');
let msgIndex = 0;
let typer = null;

function typeInto(el, text) {
  clearInterval(typer);
  if (reduceMotion) { el.textContent = text; return; }
  const chars = Array.from(text);
  let i = 0;
  el.textContent = '';
  typer = setInterval(() => {
    i++;
    el.textContent = chars.slice(0, i).join('');
    if (i >= chars.length) clearInterval(typer);
  }, 28);
}

function showMessage(i) {
  msgIndex = (i + msgs.length) % msgs.length;
  typeInto(msgText, msgs[msgIndex]);
  $$('.dot', dotsBox).forEach((d, k) => d.classList.toggle('active', k === msgIndex));
  $('#msgCount').textContent = msgIndex + 1 + ' / ' + msgs.length;
}

msgs.forEach((_, i) => {
  const d = document.createElement('button');
  d.type = 'button';
  d.className = 'dot';
  d.setAttribute('aria-label', 'Message ' + (i + 1));
  d.addEventListener('click', () => showMessage(i));
  dotsBox.appendChild(d);
});

$('#nextMsg').addEventListener('click', (e) => {
  showMessage(msgIndex + 1);
  burst(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2, 8);
});
$('#prevMsg').addEventListener('click', () => showMessage(msgIndex - 1));

/* =====================================================================
   Photo gallery + viewer
   ===================================================================== */
const gallery = $('#gallery');
const lightbox = $('#lightbox');
const lbImg = $('#lbImg');
const lbCap = $('#lbCap');

function openLightbox(src, caption) {
  lbImg.src = src;
  lbImg.alt = caption;
  lbCap.textContent = caption;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
}
function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  lbImg.removeAttribute('src');
}
lightbox.addEventListener('click', closeLightbox);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

CONFIG.photos.forEach((p) => {
  const fig = document.createElement('figure');
  fig.className = 'photo reveal';
  fig.tabIndex = 0;

  const img = new Image();
  img.alt = p.caption;
  img.loading = 'lazy';
  img.addEventListener('error', () => {
    img.remove();
    fig.classList.add('missing');
    const ph = document.createElement('div');
    ph.className = 'placeholder';
    ph.innerHTML = '<span>💗</span><small></small>';
    ph.querySelector('small').textContent = 'Add ' + p.src;
    fig.prepend(ph);
  });
  img.src = p.src;

  const cap = document.createElement('figcaption');
  cap.textContent = p.caption;
  fig.append(img, cap);

  const open = () => { if (!fig.classList.contains('missing')) openLightbox(p.src, p.caption); };
  fig.addEventListener('click', open);
  fig.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  gallery.appendChild(fig);
});

/* =====================================================================
   Secret love letter
   ===================================================================== */
const envelope = $('#envelope');
const letter = $('#letter');
const letterBody = $('#letterBody');
const lockForm = $('#lock');
const lockInput = $('#lockInput');
const lockMsg = $('#lockMsg');
let letterBuilt = false;

function buildLetter() {
  if (letterBuilt) return;
  letterBuilt = true;
  CONFIG.letter.forEach((line, i) => {
    const p = document.createElement('p');
    p.textContent = fill(line);
    p.style.animationDelay = 0.5 + i * 0.7 + 's';
    letterBody.appendChild(p);
  });
  const sig = document.createElement('p');
  sig.className = 'signature';
  sig.textContent = CONFIG.myName + ' 💗';
  sig.style.animationDelay = 0.5 + CONFIG.letter.length * 0.7 + 's';
  letterBody.appendChild(sig);
}

function openLetter() {
  if (envelope.classList.contains('open')) return;
  envelope.classList.add('open');
  buildLetter();
  const r = envelope.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height / 2, 14);
  setTimeout(() => {
    letter.classList.add('show');
    letter.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
  }, 700);
}

if (CONFIG.secretCode) {
  lockForm.classList.add('on');
  lockMsg.textContent = CONFIG.secretHint;
  $('#tapHint').textContent = 'Type the secret word to unlock it';
  envelope.addEventListener('click', () => lockInput.focus());
  lockForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (lockInput.value.trim().toLowerCase() === CONFIG.secretCode.toLowerCase()) {
      lockForm.classList.remove('on');
      lockMsg.textContent = 'Unlocked 💖';
      openLetter();
    } else {
      lockMsg.textContent = 'Hmm, not quite 💕 ' + CONFIG.secretHint;
    }
  });
} else {
  envelope.addEventListener('click', openLetter);
}

/* =====================================================================
   "Will you forgive me?" (the No button runs away)
   ===================================================================== */
const choices = $('#choices');
const yesBtn = $('#yesBtn');
const noBtn = $('#noBtn');
const plea = $('#plea');
let dodges = 0;

function dodge(e) {
  if (e && e.cancelable) e.preventDefault();
  dodges++;
  const box = choices.getBoundingClientRect();

  if (!noBtn.classList.contains('floating')) {
    const b = noBtn.getBoundingClientRect();
    noBtn.style.left = b.left - box.left + 'px';
    noBtn.style.top = b.top - box.top + 'px';
    noBtn.classList.add('floating');
    void noBtn.offsetWidth; // let the browser register the starting spot
  }

  const maxX = Math.max(0, box.width - noBtn.offsetWidth);
  const maxY = Math.max(0, box.height - noBtn.offsetHeight);
  noBtn.style.left = Math.random() * maxX + 'px';
  noBtn.style.top = Math.random() * maxY + 'px';

  noBtn.textContent = CONFIG.noTexts[Math.min(dodges, CONFIG.noTexts.length - 1)];
  plea.textContent = CONFIG.pleas[Math.min(dodges, CONFIG.pleas.length - 1)];
  yesBtn.style.transform = 'scale(' + Math.min(1 + dodges * 0.07, 1.6) + ')';
}

noBtn.addEventListener('mouseenter', dodge);
noBtn.addEventListener('touchstart', dodge, { passive: false });
noBtn.addEventListener('click', dodge);

const celebrateBox = $('#celebrate');
yesBtn.addEventListener('click', () => {
  celebrateBox.classList.add('open');
  let n = 0;
  const t = setInterval(() => {
    burst(Math.random() * window.innerWidth, window.innerHeight * (0.1 + Math.random() * 0.7), 12);
    if (++n > 12) clearInterval(t);
  }, 280);
});
$('#closeCelebrate').addEventListener('click', () => celebrateBox.classList.remove('open'));

/* =====================================================================
   Welcome gate + reveal-on-scroll
   ===================================================================== */
$('#enterBtn').addEventListener('click', (e) => {
  startMusic();
  burst(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2, 16);
  $('#site').classList.remove('hidden');
  showMessage(0);
  window.scrollTo(0, 0);
  const gate = $('#gate');
  gate.classList.add('leaving');
  document.body.classList.remove('locked');
  setTimeout(() => gate.remove(), 900);
});

const observer = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('visible');
          observer.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 })
  : null;

$$('.reveal').forEach((el) => (observer ? observer.observe(el) : el.classList.add('visible')));
