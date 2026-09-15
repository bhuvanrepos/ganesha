/**
 * AUTHENTIC 4-PAGE GANESHA INTERACTIVE EXPERIENCE
 * Complete logic, sound.mp3 audio loop, unobscured Ganesha face, flower offering to feet, and interactive user wish box.
 */

// =============================================================================
// 1. STATE & DATA
// =============================================================================
const AppState = {
  currentPage: 1,
  soundEnabled: false,
  harathiRitualDone: false,
  selectedFlower: null,
  flowerOffered: false,
  envelopeOpened: false,
  audioContext: null
};

const DEFAULT_NOTE = {
  salutation: "Hey...",
  body: `Ninna nee mood konchem off ga undani telisi,
edho pedda solution ivvali ani kaadu...
just konchem smile cheyyinchali anipinchindi.
Anduke ee chinna thing chesa. 😊

Ninna anukunnattu Ganesh Chaturthi
jaragaledu ani baadha padaku.
Oka roju sarigga jaragakapoyina,
nuvvu enjoy chesina moments anni
waste aipovu kada. ♡

So ippudu aa mood ni konchem pakkana petti,
oka small smile ivvu. Adhi chaalu. ♡

And yes...
ee website motham complete cheyyadaniki
nuvvu last page varaku vachav ante,
at least naa effort waste kaaledu. 😊`,
  closing: "Take care. Always be the same you. ♡",
  author: "A Friend ♡"
};

// =============================================================================
// 2. AUDIO ENGINE (sound.mp3 looping + synthesized divine bell / chimes)
// =============================================================================
class DivineAudioEngine {
  constructor() {
    this.audioElem = document.getElementById('bg-audio');
    this.ctx = null;
    this.isPlaying = false;
  }

  initSynth() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound() {
    this.initSynth();
    if (!this.isPlaying) {
      this.playBgMusic();
      return true;
    } else {
      this.pauseBgMusic();
      return false;
    }
  }

  playBgMusic() {
    if (this.audioElem) {
      this.audioElem.volume = 0.65;
      this.audioElem.play().then(() => {
        this.isPlaying = true;
        updateSoundButtonUI(true);
      }).catch(err => {
        console.log("Autoplay waiting for user gesture", err);
      });
    }
  }

  pauseBgMusic() {
    if (this.audioElem) {
      this.audioElem.pause();
      this.isPlaying = false;
      updateSoundButtonUI(false);
    }
  }

  restartBgMusic() {
    if (this.audioElem) {
      this.audioElem.currentTime = 0;
      this.playBgMusic();
    }
  }

  // Realistic Temple Bell synthesis (metallic multi-harmonic resonance)
  playTempleBell(volume = 0.7) {
    this.initSynth();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(volume * 0.45, now);
    masterGain.connect(this.ctx.destination);

    const freqs = [680, 1360, 2040, 2720, 3400, 4200];
    const decays = [3.5, 2.8, 2.2, 1.6, 1.1, 0.8];
    const amps = [1.0, 0.65, 0.45, 0.25, 0.15, 0.08];

    freqs.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(f + (Math.random() * 4 - 2), now);

      gain.gain.setValueAtTime(amps[i], now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + decays[i]);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + decays[i] + 0.1);
    });
  }

  // Flame lighting whoosh
  playFlameIgnite() {
    this.initSynth();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(340, now + 0.4);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.5);
  }

  // Flower Offering Chime
  playFlowerChime() {
    this.initSynth();
    if (!this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    const now = this.ctx.currentTime;

    notes.forEach((freq, index) => {
      const startTime = now + index * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.14, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 1.3);
    });
  }

  // Wax Seal Open
  playWaxSealOpen() {
    this.initSynth();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.12);

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);

    setTimeout(() => {
      this.playFlowerChime();
    }, 150);
  }
}

const AudioEngine = new DivineAudioEngine();

// =============================================================================
// 3. AMBIENT PARTICLES & GOLD DUST CANVAS
// =============================================================================
class AmbientParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.width = 0;
    this.height = 0;
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.createParticles(40);
    this.animate();
  }

  resize() {
    this.width = this.canvas.width = this.canvas.parentElement.clientWidth;
    this.height = this.canvas.height = this.canvas.parentElement.clientHeight;
  }

  createParticles(count) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 2.2 + 0.8,
        speedY: Math.random() * 0.5 + 0.2,
        speedX: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.7 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        isPetal: Math.random() > 0.85,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.03
      });
    }
  }

  burst(x, y, count = 25, color = '#ffd875') {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3.5 + 1.2;
      this.particles.push({
        x: x || this.width / 2,
        y: y || this.height / 2,
        radius: Math.random() * 2.5 + 1.2,
        speedX: Math.cos(angle) * speed,
        speedY: Math.sin(angle) * speed - 1.0,
        alpha: 1,
        life: 1,
        decay: Math.random() * 0.02 + 0.012,
        color: color,
        isBurst: true
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      if (p.isBurst) {
        p.x += p.speedX;
        p.y += p.speedY;
        p.speedY += 0.04;
        p.life -= p.decay;
        p.alpha = p.life;

        if (p.life <= 0) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = p.color || '#ffd875';
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = '#ffd875';
        this.ctx.globalAlpha = Math.max(0, p.alpha);
        this.ctx.fill();
        this.ctx.restore();
      } else {
        p.y -= p.speedY;
        p.x += Math.sin(p.y * 0.02) * 0.4 + p.speedX;
        p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.005;
        p.alpha = Math.max(0.15, Math.min(0.85, p.alpha));

        if (p.y < -10) {
          p.y = this.height + 10;
          p.x = Math.random() * this.width;
        }

        this.ctx.save();
        this.ctx.globalAlpha = p.alpha;

        if (p.isPetal) {
          p.rotation += p.rotationSpeed;
          this.ctx.translate(p.x, p.y);
          this.ctx.rotate(p.rotation);
          this.ctx.beginPath();
          this.ctx.ellipse(0, 0, p.radius * 2, p.radius, 0, 0, Math.PI * 2);
          this.ctx.fillStyle = '#ffcf70';
          this.ctx.shadowBlur = 6;
          this.ctx.shadowColor = '#ffaa33';
          this.ctx.fill();
        } else {
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          this.ctx.fillStyle = '#fff4bd';
          this.ctx.shadowBlur = 6;
          this.ctx.shadowColor = '#ffd875';
          this.ctx.fill();
        }
        this.ctx.restore();
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

let ParticleSystem;

// =============================================================================
// 4. NAVIGATION & PAGE TRANSITIONS
// =============================================================================
function goToPage(pageNumber) {
  if (pageNumber === AppState.currentPage) return;

  const currentView = document.getElementById(`page-${AppState.currentPage}`);
  const nextView = document.getElementById(`page-${pageNumber}`);

  if (currentView) {
    currentView.classList.remove('active');
  }

  if (nextView) {
    nextView.classList.add('active');
    AppState.currentPage = pageNumber;
  }

  AudioEngine.playTempleBell(0.4);

  if (ParticleSystem) {
    ParticleSystem.burst(window.innerWidth / 2, window.innerHeight * 0.4, 20);
  }
}

// =============================================================================
// 5. PAGE 1: HARATHI VELIGINCHU RITUAL & MANUAL PROCEED
// =============================================================================
function setupPage1() {
  const page1 = document.getElementById('page-1');
  const harathiBtn = document.getElementById('btn-harathi-action');
  const harathiBtnText = document.getElementById('harathi-btn-text');
  const p1PromptText = document.getElementById('p1-prompt-text');
  const p1FooterSubtext = document.getElementById('p1-footer-subtext');
  const leftDiya = document.getElementById('diya-left');
  const rightDiya = document.getElementById('diya-right');
  const divineHalo = document.getElementById('divine-halo');
  const p1IlluminatedBg = document.getElementById('p1-illuminated-bg');

  // Ensure diyas are hidden initially until Harathi ritual starts
  leftDiya.style.display = 'none';
  rightDiya.style.display = 'none';

  harathiBtn.addEventListener('click', () => {
    // If ritual has already completed, button navigates to Page 2
    if (AppState.harathiRitualDone) {
      goToPage(2);
      return;
    }

    // Start background sound.mp3
    AudioEngine.playBgMusic();

    // 0.0s -> Button state update
    harathiBtn.classList.remove('pulse-glow');
    harathiBtn.classList.add('disabled');
    harathiBtnText.textContent = "Harathi Veligindhi... ✨";

    // 0.6s -> Left diya lights up on steps
    setTimeout(() => {
      leftDiya.style.display = 'block';
      leftDiya.classList.add('lit');
      AudioEngine.playFlameIgnite();
      if (ParticleSystem) {
        const rect = leftDiya.getBoundingClientRect();
        ParticleSystem.burst(rect.left + 12, rect.top + 10, 15, '#ffa21f');
      }
    }, 600);

    // 1.2s -> Right diya lights up on steps
    setTimeout(() => {
      rightDiya.style.display = 'block';
      rightDiya.classList.add('lit');
      AudioEngine.playFlameIgnite();
      if (ParticleSystem) {
        const rect = rightDiya.getBoundingClientRect();
        ParticleSystem.burst(rect.left + 12, rect.top + 10, 15, '#ffa21f');
      }
    }, 1200);

    // 1.8s -> Golden divine halo radiates behind Ganesha
    setTimeout(() => {
      divineHalo.classList.add('radiating');
    }, 1800);

    // 2.2s -> Lord Ganesha becomes brightly illuminated
    // Immediately stop and hide the temporary flame overlays completely (only on page 1 silhouette)
    setTimeout(() => {
      p1IlluminatedBg.classList.add('visible');
      page1.classList.add('illuminated-active');
      leftDiya.classList.remove('lit');
      rightDiya.classList.remove('lit');
      leftDiya.style.display = 'none';
      rightDiya.style.display = 'none';
    }, 2200);

    // 3.0s -> Golden petals and embers burst upwards
    setTimeout(() => {
      if (ParticleSystem) {
        ParticleSystem.burst(window.innerWidth / 2, window.innerHeight * 0.6, 40, '#ffd875');
      }
    }, 3000);

    // 3.6s -> Divine temple bell resonates
    setTimeout(() => {
      AudioEngine.playTempleBell(1.0);
    }, 3600);

    // 4.2s -> Complete Harathi Ritual: Ganesha in full glorious darshan!
    setTimeout(() => {
      AppState.harathiRitualDone = true;

      p1PromptText.innerHTML = "Ganapayya Darshanam labhinchindi... ♡<br><span style='font-size:0.82rem; color:#ffd875;'>Ganapayya meekosam oka maata chepthunnaru...</span>";
      p1FooterSubtext.textContent = "Tap to view Ganapayya's Note ♡";

      harathiBtn.classList.remove('disabled');
      harathiBtn.classList.add('pulse-glow');
      harathiBtn.innerHTML = `
        <span class="btn-lamp-icon">🌼</span>
        <span class="btn-text">Ganapayya Maata Vinandi</span>
        <span class="btn-arrow-icon">→</span>
      `;
    }, 4200);
  });
}

// =============================================================================
// 6. PAGE 2: NA CHINNA MAATA...
// =============================================================================
function setupPage2() {
  const btnToPage3 = document.getElementById('btn-to-page-3');
  btnToPage3.addEventListener('click', () => {
    goToPage(3);
  });
}

// =============================================================================
// 7. PAGE 3: FLOWER OFFERING CEREMONY (CLEAN FEET TARGET & NO OVERLAPS)
// =============================================================================
function setupPage3() {
  const flowerTray = document.getElementById('flower-tray');
  const flowerItems = flowerTray.querySelectorAll('.flower-option-item');
  const flowerSelectionWrapper = document.getElementById('flower-selection-wrapper');
  const flowerOfferedCard = document.getElementById('flower-offered-card');
  const offerBtn = document.getElementById('btn-offer-flower');
  const offerBtnText = document.getElementById('offer-btn-text');
  const offerBtnIcon = document.getElementById('offer-btn-icon');
  const bottomMsg = document.getElementById('flower-bottom-msg');
  const feetZone = document.getElementById('feet-target-zone');

  flowerItems.forEach(item => {
    item.addEventListener('click', () => {
      if (AppState.flowerOffered) return;

      flowerItems.forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
      flowerTray.classList.add('has-selection');

      AppState.selectedFlower = {
        name: item.dataset.name,
        img: item.dataset.img,
        element: item
      };

      offerBtn.classList.remove('disabled');
      offerBtn.classList.add('pulse-glow');
      offerBtnText.textContent = `Offer ${AppState.selectedFlower.name}`;

      AudioEngine.playFlameIgnite();
      if (ParticleSystem) {
        const rect = item.getBoundingClientRect();
        ParticleSystem.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 12, '#ffd875');
      }
    });
  });

  offerBtn.addEventListener('click', () => {
    if (!AppState.selectedFlower || AppState.flowerOffered) {
      if (AppState.flowerOffered) {
        goToPage(4);
      }
      return;
    }
    AppState.flowerOffered = true;

    offerBtn.classList.remove('pulse-glow');
    offerBtn.classList.add('disabled');
    offerBtnText.textContent = `Offering ${AppState.selectedFlower.name}...`;

    // 1. Hide the flower selection options cleanly
    flowerSelectionWrapper.classList.add('faded-out');

    // 2. Create flying flower clone element
    const sourceEl = AppState.selectedFlower.element.querySelector('.flower-thumb');
    const srcRect = sourceEl.getBoundingClientRect();
    const destRect = feetZone.getBoundingClientRect();

    const clone = document.createElement('img');
    clone.src = AppState.selectedFlower.img;
    clone.className = 'flying-flower-clone';
    clone.style.left = `${srcRect.left}px`;
    clone.style.top = `${srcRect.top}px`;
    clone.style.width = `${srcRect.width}px`;
    clone.style.height = `${srcRect.height}px`;
    document.body.appendChild(clone);

    AudioEngine.playFlowerChime();

    // 3. Animate flight trajectory directly down to Ganesha's lotus feet
    requestAnimationFrame(() => {
      const deltaX = (destRect.left + destRect.width / 2) - (srcRect.left + srcRect.width / 2);
      const deltaY = (destRect.top + destRect.height / 2) - (srcRect.top + srcRect.height / 2);

      clone.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.8) rotate(360deg)`;
      clone.style.opacity = '1';
    });

    // 4. When flower lands at lotus feet (~1.2s)
    setTimeout(() => {
      AudioEngine.playTempleBell(0.85);

      if (ParticleSystem) {
        const dest = feetZone.getBoundingClientRect();
        ParticleSystem.burst(dest.left + dest.width / 2, dest.top + dest.height / 2, 35, '#ffd875');
      }

      // Fade and remove clone from DOM
      clone.style.opacity = '0';
      setTimeout(() => {
        if (clone && clone.parentNode) {
          clone.parentNode.removeChild(clone);
        }
      }, 400);

      // Cleanly reveal blessing hover card without overlap
      flowerSelectionWrapper.style.display = 'none';
      flowerOfferedCard.classList.add('visible');

      // Update button to proceed to Page 4
      offerBtn.classList.remove('disabled');
      offerBtn.classList.add('pulse-glow');
      offerBtnIcon.textContent = "💌";
      offerBtnText.textContent = "Idi naa daggara nundi... ♡ →";
      bottomMsg.textContent = "A little note from a friend... ♡";

      // Smooth auto transition to Page 4 after 3.2s
      setTimeout(() => {
        if (AppState.currentPage === 3) {
          goToPage(4);
        }
      }, 3200);
    }, 1200);
  });
}

// =============================================================================
// 8. PAGE 4: SEALED ENVELOPE, LETTER & USER WISH BOX
// =============================================================================
function setupPage4() {
  const waxSealBtn = document.getElementById('wax-seal-btn');
  const envelopeElem = document.getElementById('envelope-elem');
  const btnKeepSmiling = document.getElementById('btn-keep-smiling');
  const celebrationOverlay = document.getElementById('celebration-overlay');
  const closeCelebrationBtn = document.getElementById('close-celebration-btn');
  const restartJourneyBtn = document.getElementById('restart-journey-btn');

  // Letter Personalization Elements
  const editNoteBtn = document.getElementById('edit-note-btn');
  const editModal = document.getElementById('edit-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const saveNoteBtn = document.getElementById('save-note-btn');
  const resetDefaultBtn = document.getElementById('reset-default-btn');

  const inputSalutation = document.getElementById('input-salutation');
  const inputLetterBody = document.getElementById('input-letter-body');
  const inputAuthor = document.getElementById('input-author');

  // Rating Feedback Elements
  const ratingChips = document.querySelectorAll('.rating-chip-btn');
  const ratingResponseMsg = document.getElementById('rating-response-msg');

  // User Wish Box Elements
  const userWishInput = document.getElementById('user-wish-input');
  const sendWishBtn = document.getElementById('send-wish-btn');
  const wishConfirmMsg = document.getElementById('wish-confirm-msg');

  loadPersonalNote();

  // Wax Seal Tap / Open Letter
  waxSealBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (AppState.envelopeOpened) return;
    AppState.envelopeOpened = true;

    AudioEngine.playWaxSealOpen();

    if (ParticleSystem) {
      const rect = waxSealBtn.getBoundingClientRect();
      ParticleSystem.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 25, '#ffd875');
    }

    envelopeElem.classList.add('opened');
  });

  // Keep Smiling Button -> Open Celebration & Rating Overlay
  btnKeepSmiling.addEventListener('click', () => {
    AudioEngine.playTempleBell(1.0);
    AudioEngine.playFlowerChime();

    if (ParticleSystem) {
      ParticleSystem.burst(window.innerWidth / 2, window.innerHeight * 0.4, 50, '#ffdf88');
      ParticleSystem.burst(window.innerWidth * 0.3, window.innerHeight * 0.6, 30, '#ff6b81');
      ParticleSystem.burst(window.innerWidth * 0.7, window.innerHeight * 0.6, 30, '#ffd875');
    }

    celebrationOverlay.classList.add('open');
    celebrationOverlay.setAttribute('aria-hidden', 'false');
  });

  closeCelebrationBtn.addEventListener('click', () => {
    celebrationOverlay.classList.remove('open');
    celebrationOverlay.setAttribute('aria-hidden', 'true');
  });

  // Restart Journey (Full Reset to Page 1 Silhouette Initial State)
  restartJourneyBtn.addEventListener('click', () => {
    celebrationOverlay.classList.remove('open');
    celebrationOverlay.setAttribute('aria-hidden', 'true');
    resetExperience();
  });

  // Rating Chips Feedback Handling
  const ratingReplies = {
    normal: "Prathi roju mana kosam kaakapoyina, manam santoshamga undocchu. Be happy! 🌸",
    good: "Mee mukham meeda chinna chirunavvu chusthe chaalu! Have a blessed day! 🌼",
    perfect: "Mee santosham eh maaku mukhyam! May Ganesha bless you always! ✨"
  };

  ratingChips.forEach(chip => {
    chip.addEventListener('click', () => {
      ratingChips.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      const rating = chip.dataset.rating;
      ratingResponseMsg.textContent = ratingReplies[rating] || "Thank you so much! ♡";
      AudioEngine.playFlowerChime();

      if (ParticleSystem) {
        const rect = chip.getBoundingClientRect();
        ParticleSystem.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 15, '#ffd875');
      }
    });
  });

  // Interactive Wish / Note Submission
  sendWishBtn.addEventListener('click', () => {
    const text = userWishInput.value.trim();
    if (!text) {
      wishConfirmMsg.textContent = "Please write a thought or wish first ♡";
      return;
    }

    localStorage.setItem('ganesha_user_reply_wish', text);
    wishConfirmMsg.textContent = "Mee manasulo maata Ganapayya daggara cherindi... ♡ ✨";
    userWishInput.value = "";
    AudioEngine.playFlowerChime();

    if (ParticleSystem) {
      ParticleSystem.burst(window.innerWidth / 2, window.innerHeight * 0.5, 30, '#ffd875');
    }
  });

  // Edit Note Modal Handlers
  editNoteBtn.addEventListener('click', () => {
    const note = getStoredNote();
    inputSalutation.value = note.salutation;
    inputLetterBody.value = note.body;
    inputAuthor.value = note.author;
    editModal.classList.add('open');
    editModal.setAttribute('aria-hidden', 'false');
  });

  closeModalBtn.addEventListener('click', () => {
    editModal.classList.remove('open');
    editModal.setAttribute('aria-hidden', 'true');
  });

  saveNoteBtn.addEventListener('click', () => {
    const updatedNote = {
      salutation: inputSalutation.value.trim() || DEFAULT_NOTE.salutation,
      body: inputLetterBody.value.trim() || DEFAULT_NOTE.body,
      closing: DEFAULT_NOTE.closing,
      author: inputAuthor.value.trim() || DEFAULT_NOTE.author
    };
    localStorage.setItem('ganesha_custom_note', JSON.stringify(updatedNote));
    renderNoteText(updatedNote);
    editModal.classList.remove('open');
    editModal.setAttribute('aria-hidden', 'true');

    AudioEngine.playFlowerChime();
    if (ParticleSystem) {
      ParticleSystem.burst(window.innerWidth / 2, window.innerHeight * 0.5, 20);
    }
  });

  resetDefaultBtn.addEventListener('click', () => {
    localStorage.removeItem('ganesha_custom_note');
    renderNoteText(DEFAULT_NOTE);
    inputSalutation.value = DEFAULT_NOTE.salutation;
    inputLetterBody.value = DEFAULT_NOTE.body;
    inputAuthor.value = DEFAULT_NOTE.author;
    editModal.classList.remove('open');
    editModal.setAttribute('aria-hidden', 'true');
  });
}

function getStoredNote() {
  try {
    const saved = localStorage.getItem('ganesha_custom_note');
    return saved ? JSON.parse(saved) : DEFAULT_NOTE;
  } catch (e) {
    return DEFAULT_NOTE;
  }
}

function renderNoteText(note) {
  const displayContainer = document.getElementById('letter-display-text');
  const paragraphs = note.body.split('\n\n');

  let bodyHtml = `<p class="letter-salutation">${escapeHtml(note.salutation)}</p>`;
  paragraphs.forEach(para => {
    bodyHtml += `<p class="letter-para">${escapeHtml(para).replace(/\n/g, '<br>')}</p>`;
  });
  bodyHtml += `<p class="letter-closing">${escapeHtml(note.closing)}</p>`;
  bodyHtml += `
    <div class="letter-signature">
      <span class="sign-line">—</span>
      <span class="sign-author" id="letter-author-name">${escapeHtml(note.author)}</span>
    </div>
  `;

  displayContainer.innerHTML = bodyHtml;
}

function loadPersonalNote() {
  const note = getStoredNote();
  renderNoteText(note);
}

function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Complete Experience Reset: Returns smoothly to Page 1 Welcome Silhouette Shot
function resetExperience() {
  AppState.currentPage = 1;
  AppState.harathiRitualDone = false;
  AppState.selectedFlower = null;
  AppState.flowerOffered = false;
  AppState.envelopeOpened = false;

  // Clean up any lingering flying flower clones
  document.querySelectorAll('.flying-flower-clone').forEach(el => el.remove());

  // Reset Page 1 to initial dark silhouette state
  const page1 = document.getElementById('page-1');
  page1.classList.remove('illuminated-active');
  document.getElementById('p1-illuminated-bg').classList.remove('visible');
  document.getElementById('divine-halo').classList.remove('radiating');
  const leftDiya = document.getElementById('diya-left');
  const rightDiya = document.getElementById('diya-right');
  leftDiya.classList.remove('lit');
  rightDiya.classList.remove('lit');
  leftDiya.style.display = 'none';
  rightDiya.style.display = 'none';

  const p1PromptText = document.getElementById('p1-prompt-text');
  p1PromptText.innerHTML = "Oka chinna nimisham...<br>ikkada undu. ♡";
  document.getElementById('p1-footer-subtext').textContent = "Let's begin... ♡";

  const harathiBtn = document.getElementById('btn-harathi-action');
  harathiBtn.classList.remove('disabled');
  harathiBtn.classList.add('pulse-glow');
  harathiBtn.innerHTML = `
    <span class="btn-lamp-icon">🪔</span>
    <span class="btn-text" id="harathi-btn-text">Harathi Veliginchu</span>
    <span class="btn-arrow-icon">→</span>
  `;

  // Reset Page 3
  const flowerSelectionWrapper = document.getElementById('flower-selection-wrapper');
  if (flowerSelectionWrapper) {
    flowerSelectionWrapper.style.display = '';
    flowerSelectionWrapper.classList.remove('faded-out');
  }
  const flowerOfferedCard = document.getElementById('flower-offered-card');
  if (flowerOfferedCard) {
    flowerOfferedCard.classList.remove('visible');
  }

  const flowerTray = document.getElementById('flower-tray');
  flowerTray.classList.remove('has-selection');
  flowerTray.querySelectorAll('.flower-option-item').forEach(i => i.classList.remove('selected'));
  const offerBtn = document.getElementById('btn-offer-flower');
  offerBtn.classList.add('disabled');
  offerBtn.classList.remove('pulse-glow');
  document.getElementById('offer-btn-icon').textContent = '🌸';
  document.getElementById('offer-btn-text').textContent = 'Offer This Flower';
  document.getElementById('flower-bottom-msg').textContent = 'Chinna pani... Pedda santosham...';

  // Reset Page 4
  document.getElementById('envelope-elem').classList.remove('opened');

  // Reset Rating feedback selection & Wish Toast
  document.querySelectorAll('.rating-chip-btn').forEach(c => c.classList.remove('selected'));
  document.getElementById('rating-response-msg').textContent = '';
  document.getElementById('wish-confirm-msg').textContent = '';

  // Restart sound.mp3 from beginning
  AudioEngine.restartBgMusic();

  // Navigate back to Page 1
  goToPage(1);
}

// =============================================================================
// 9. HEADER SOUND BUTTON & HANGING BELLS
// =============================================================================
function setupGlobalControls() {
  const soundBtn = document.getElementById('sound-toggle-btn');
  soundBtn.addEventListener('click', () => {
    AudioEngine.toggleSound();
  });

  document.querySelectorAll('.hanging-bell-decor').forEach(bell => {
    bell.addEventListener('click', () => {
      bell.style.transform = 'scale(1.3) rotate(-15deg)';
      AudioEngine.playTempleBell(0.9);
      if (ParticleSystem) {
        const rect = bell.getBoundingClientRect();
        ParticleSystem.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 10, '#ffd875');
      }
      setTimeout(() => {
        bell.style.transform = '';
      }, 350);
    });
  });
}

function updateSoundButtonUI(isPlaying) {
  const soundBtn = document.getElementById('sound-toggle-btn');
  const text = soundBtn.querySelector('.sound-text');
  if (isPlaying) {
    soundBtn.classList.add('playing');
    text.textContent = 'Pause Sound';
  } else {
    soundBtn.classList.remove('playing');
    text.textContent = 'Play Sound';
  }
}

// =============================================================================
// 10. INITIALIZATION
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
  ParticleSystem = new AmbientParticleSystem('ambient-canvas');
  setupGlobalControls();
  setupPage1();
  setupPage2();
  setupPage3();
  setupPage4();
});
