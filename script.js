/* script.js - shared navigation + unlock logic + popups */
document.addEventListener('DOMContentLoaded', () => {
  const $ = id => document.getElementById(id);

  // popup holder
  function createPopup(){
    const p = document.createElement('div'); p.id = 'popup'; p.className = 'popup hidden'; document.body.appendChild(p); return p;
  }
  const popupEl = $('popup') || createPopup();

  function showPopup(message, type='ok', timeout=2400){
    const heading = type === 'ok' ? '💖 You did it!' : (type === 'fail' ? '😢 You tried!' : '💌 Info');
    popupEl.innerHTML = `<strong>${heading}</strong><div style="margin-top:8px">${message}</div>`;
    popupEl.classList.remove('hidden');
    setTimeout(()=> popupEl.classList.add('hidden'), timeout);
  }

  // progress storage helpers
  function getUnlocked(){ return Number(localStorage.getItem('lv_unlocked') || 1); }
  function setUnlocked(n){ localStorage.setItem('lv_unlocked', String(n)); refreshMenu(); }
  function getKeys(){ return Number(localStorage.getItem('lv_keys') || 0); }
  function addKey(n=1){ localStorage.setItem('lv_keys', String(getKeys()+n)); }

  function resetProgress(){
    localStorage.removeItem('lv_unlocked');
    localStorage.removeItem('lv_keys');
    setUnlocked(1);
    showPopup('Progress cleared — start again!','info');
  }

  function refreshMenu(){
    const unlocked = getUnlocked();
    document.querySelectorAll('.level-btn').forEach(btn => {
      const lvl = btn.dataset && btn.dataset.level;
      if (!lvl) return;
      if (lvl === 'final'){
        if (unlocked > 6) { btn.classList.remove('locked'); btn.classList.add('bright'); btn.href='final.html'; }
        else { btn.classList.add('locked'); }
        return;
      }
      const n = Number(lvl);
      if (n && n <= unlocked){
        btn.classList.remove('locked'); btn.classList.add('bright');
      } else {
        btn.classList.add('locked'); btn.classList.remove('bright');
      }
    });
  }

  // music controls (shared audio element on pages has id bgMusic)
  let musicPlaying = false;
  function playMusic(){ const a = document.querySelector('audio#bgMusic'); if (!a) return; a.play().catch(()=>{}); musicPlaying=true; toggleMusicBtn(true); }
  function pauseMusic(){ const a = document.querySelector('audio#bgMusic'); if (!a) return; a.pause(); musicPlaying=false; toggleMusicBtn(false); }
  function toggleMusicBtn(on){ const b = $('musicToggle'); if (!b) return; b.textContent = on ? 'Music: On 🎶' : 'Play Music'; }

  // wire up controls if present
  const mb = $('musicToggle'); if (mb) mb.addEventListener('click', ()=> musicPlaying ? pauseMusic() : playMusic());
  const reset = $('resetProgress'); if (reset) reset.addEventListener('click', ()=> { if (confirm('Reset all progress?')) resetProgress(); });

  // initial UI
  refreshMenu();

  // helper to open page with fade
  function fadeTo(url){
    document.body.classList.add('fade-out');
    setTimeout(()=> location.href = url, 480);
  }

  // intercept clicks on level buttons to warn if locked (optional safety)
  document.querySelectorAll('.level-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (btn.classList.contains('locked')) {
        e.preventDefault();
        showPopup("This level is locked — complete previous levels to unlock 💞",'info',1800);
      } else {
        // smooth fade navigation
        e.preventDefault();
        const dest = btn.getAttribute('href');
        fadeTo(dest);
      }
    });
  });

  // Expose small API so level pages can call when they complete
  window.LoveQuest = window.LoveQuest || {};
  window.LoveQuest.levelComplete = function(nextLevel){
    addKey(1);
    setUnlocked(Math.max(getUnlocked(), nextLevel));
    showPopup(`Ohh dear — you found a key! Level ${nextLevel} unlocked 💫`,'ok',2200);
    // after a short pause navigate to welcome so user sees unlocked state
    setTimeout(()=> fadeTo('welcome.html'), 1200);
  };
});