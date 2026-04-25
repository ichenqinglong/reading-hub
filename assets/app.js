/**
 * Reading Hub — Shared Interactive Logic
 * Ghost Audio · Choice Selection · Scroll Reveal · Open Answer
 */

// ═══ Ghost Audio — Single-track mutual exclusion ═══
const audioCache = {};
let currentAudio = null;
let currentBtn = null;
let currentPara = null;

function getAudio(src) {
  if (!audioCache[src]) { audioCache[src] = new Audio(src); }
  return audioCache[src];
}

function stopAll() {
  if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; }
  if (currentBtn) currentBtn.classList.remove('playing');
  if (currentPara) currentPara.classList.remove('playing');
  currentAudio = null; currentBtn = null; currentPara = null;
}

// Paragraph ghost audio buttons
document.querySelectorAll('.ghost-audio__btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const src = btn.dataset.audioSrc;
    const para = btn.closest('.para');
    if (currentBtn === btn && currentAudio && !currentAudio.paused) { stopAll(); return; }
    stopAll();
    const audio = getAudio(src);
    audio.play();
    btn.classList.add('playing');
    if (para) { para.classList.add('playing'); currentPara = para; }
    currentAudio = audio; currentBtn = btn;
    audio.onended = () => stopAll();
  });
});

// Full audio button
const fullBtn = document.getElementById('full-audio-btn');
if (fullBtn) {
  fullBtn.addEventListener('click', () => {
    const src = fullBtn.dataset.audioSrc;
    if (currentBtn === fullBtn && currentAudio && !currentAudio.paused) { stopAll(); return; }
    stopAll();
    const audio = getAudio(src);
    audio.play();
    fullBtn.classList.add('playing');
    currentAudio = audio; currentBtn = fullBtn;
    audio.onended = () => stopAll();
  });
}

// ═══ Choice Selection — Elegant Interaction ═══
function selectChoice(el) {
  const question = el.closest('.question');
  if (question.dataset.answered) return;
  question.dataset.answered = 'true';
  const isCorrect = el.dataset.correct === 'true';
  el.classList.add('selected');
  setTimeout(() => {
    question.querySelectorAll('.choice').forEach(c => {
      if (c.dataset.correct === 'true') c.classList.add('correct');
      else if (c === el && !isCorrect) c.classList.add('incorrect');
    });
  }, 300);
}

// ═══ Open Answer Toggle ═══
function toggleAnswer(btn) {
  const content = btn.nextElementSibling;
  content.classList.toggle('show');
  btn.textContent = content.classList.contains('show') ? 'Hide Answer' : 'Show Suggested Answer';
}

// ═══ Scroll Reveal — IntersectionObserver ═══
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
