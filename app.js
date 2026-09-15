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
  salutation: "Hi Chinnu...",

  body: `Ninna nii mood konchem off ga undani telisi,
edho pedda solution ivvali ani kaadu...
just konchem smile cheyyinchali anipinchindi.
Nuvvu first time naatho cheppavu kada, nenu edichanu ani...
naaku appudu niku call chesi matladali anipinchindi,
but timing correct kaadu ani anipinchi em cheyalo tochaledu.
Anduke ee chinna thing chesa. 😊

Ninna anukunnattu Ganesha tho celebrate cheyyalekapoyav
ani baadha padaku.
Naaku kuda just text lo, matallo chepthe saripodu anipinchindi...
naa touch koncham undali anipinchindi.

Ela untadi ante...
Ganesha ♡ neetho matladithe baaguntundi kada,
rather than just this normal person nunchi oka message la. 😊

And ninna manam matladina,
share chesukunna konni vishayalu valla kuda try chesanu...
niku kastha relief iddham ani,
inka ibbandi petakudadhu ani kuda.

Em kaadu...
Mummy tho Navaratri chala baaga jarupukuntav ani naa feel.
Chala beautiful time spend chestav Mummy tho,
Amma blessings tho. ❤️

So ippudu aa sad mood ni konchem pakkana petti,
oka small smile ivvu.
Adhi chaalu. ♡

And yes...

Ee website motham complete chesi,
nuvvu last page varaku vachav ante,
at least naa chinna vision and thought waste kaaledu ani
anukuntunna. 😊

Last lo oka chinna mata...

Ila sudden ga chesi shock iddham ani matram kaadu.
Just... I feel you deserve to be happy.

Ninna naa valla niku konchem relief vachindo ledo naaku telidu...
but nuvvu nannu "Sanju" ani pilichinappudu,
adi naaku oka different kind of peace and happiness. ❤️

Take care, Chinnu.
And... konchem smile cheyyi. ♡`,

  closing: "Take care. Always be the same you. ♡",
  author: "Sanju ♡"
};

// =============================================================================
// 2. AUDIO ENGINE (sound.mp3 continuous loop only - click sounds removed)
// =============================================================================
class DivineAudioEngine {
  constructor() {
    this.audioElem = document.getElementById('bg-audio');
    this.isPlaying = false;
  }

  toggleSound() {
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

  // Click & synth audio removed per user request: only sound.mp3 plays
  playTempleBell() { }
  playFlameIgnite() { }
  playFlowerChime() { }
  playWaxSealOpen() { }
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

  // Clean up any stray flying flower clones immediately
  document.querySelectorAll('.flying-flower-clone').forEach(el => el.remove());

  const currentView = document.getElementById(`page-${AppState.currentPage}`);
  const nextView = document.getElementById(`page-${pageNumber}`);

  if (currentView) {
    currentView.classList.remove('active');
  }

  if (nextView) {
    nextView.classList.add('active');
    AppState.currentPage = pageNumber;
  }

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
      if (ParticleSystem) {
        const rect = leftDiya.getBoundingClientRect();
        ParticleSystem.burst(rect.left + 12, rect.top + 10, 15, '#ffa21f');
      }
    }, 600);

    // 1.2s -> Right diya lights up on steps
    setTimeout(() => {
      rightDiya.style.display = 'block';
      rightDiya.classList.add('lit');
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

    // 4.2s -> Complete Harathi Ritual: Ganesha in full glorious darshan!
    setTimeout(() => {
      AppState.harathiRitualDone = true;

      p1PromptText.innerHTML = `<span class="prompt-title">Ganapayya Darshanam labhinchindi... ♡</span><br><span class="prompt-subtitle">Ganapayya neekosam oka maata cheptaru anta...</span>`;
      p1FooterSubtext.textContent = "Tap to view Ganapayya's Note ♡";

      harathiBtn.classList.remove('disabled');
      harathiBtn.classList.add('pulse-glow');
      harathiBtn.innerHTML = `
        <span class="btn-lamp-icon">🌸</span>
        <span class="btn-text">Ganapayya Maata Vinu(Ganesha's Note)</span>
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
  const footerNote = bottomMsg ? bottomMsg.closest('.footer-note') : null;

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

      if (ParticleSystem) {
        const rect = item.getBoundingClientRect();
        ParticleSystem.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 12, '#ffd875');
      }
    });
  });

  offerBtn.addEventListener('click', () => {
    // If flower has already been offered and user clicks the next button
    if (AppState.flowerOffered) {
      goToPage(4);
      return;
    }

    if (!AppState.selectedFlower) return;
    AppState.flowerOffered = true;

    // 1. Capture source coordinates BEFORE modifying classes/styles
    const sourceEl = AppState.selectedFlower.element.querySelector('.flower-thumb') || AppState.selectedFlower.element;
    const srcRect = sourceEl.getBoundingClientRect();

    // 2. Compute Viewport & Ganesha's Sacred Lotus Feet Coordinates (at 82% height, down at pedestal steps)
    const viewportEl = document.querySelector('.app-viewport') || document.body;
    const vpRect = viewportEl.getBoundingClientRect();
    const destX = vpRect.left + vpRect.width * 0.5;
    const destY = vpRect.top + vpRect.height * 0.82; // Lord Ganesha's sacred feet on pedestal steps

    const startX = srcRect.width > 0 ? (srcRect.left + srcRect.width / 2) : destX;
    const startY = srcRect.height > 0 ? (srcRect.top + srcRect.height / 2) : (vpRect.top + vpRect.height * 0.78);

    // 3. Immediately clean previous clones and create single Flying Flower Clone
    document.querySelectorAll('.flying-flower-clone').forEach(el => el.remove());

    const clone = document.createElement('img');
    clone.src = AppState.selectedFlower.img;
    clone.alt = AppState.selectedFlower.name;
    clone.className = 'flying-flower-clone';
    clone.style.position = 'fixed';
    clone.style.left = `${startX - 24}px`;
    clone.style.top = `${startY - 24}px`;
    clone.style.width = '48px';
    clone.style.height = '48px';
    clone.style.opacity = '1';
    clone.style.zIndex = '1000';
    clone.style.transform = 'scale(1) rotate(0deg)';
    document.body.appendChild(clone);

    // 4. Hide flower selection tray and hide action button while flower is falling
    flowerSelectionWrapper.classList.add('faded-out');
    offerBtn.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    offerBtn.style.opacity = '0';
    offerBtn.style.pointerEvents = 'none';
    if (footerNote) {
      footerNote.style.transition = 'opacity 0.4s ease';
      footerNote.style.opacity = '0';
    }

    // 5. Flower glides smoothly down directly to Ganesha's sacred lotus feet
    requestAnimationFrame(() => {
      const deltaX = destX - startX;
      const deltaY = destY - startY;
      clone.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.92) rotate(360deg)`;
    });

    // 6. At 1.1s: Flower arrives and lands at Ganesha's sacred feet -> Golden burst
    setTimeout(() => {
      if (ParticleSystem) {
        ParticleSystem.burst(destX, destY, 35, '#ffd875');
      }

      // 7. At 1.8s (after resting at feet for ~0.7s): Flower fades out and dissolves completely
      setTimeout(() => {
        clone.style.opacity = '0';
        clone.style.filter = 'blur(6px) drop-shadow(0 0 20px #ffd875)';
        clone.style.transform = `translate(${destX - startX}px, ${destY - startY}px) scale(0.4) rotate(360deg)`;

        // 8. At 2.3s: Remove flower clone from DOM completely
        setTimeout(() => {
          if (clone.parentElement) {
            clone.remove();
          }
          flowerSelectionWrapper.style.display = 'none';

          // 9. ONLY THEN: Reveal the hover blessing card and the next proceed button!
          if (ParticleSystem) {
            ParticleSystem.burst(destX, vpRect.top + vpRect.height * 0.65, 25, '#ffd875');
          }

          flowerOfferedCard.classList.add('visible');

          offerBtn.classList.remove('disabled');
          offerBtn.classList.add('pulse-glow');
          offerBtnIcon.textContent = "💌";
          offerBtnText.textContent = "Idi naa daggara nundi... ♡ →";
          offerBtn.style.opacity = '1';
          offerBtn.style.pointerEvents = 'auto';

          if (bottomMsg) {
            bottomMsg.textContent = "A little note from a friend... ♡";
          }
          if (footerNote) {
            footerNote.style.opacity = '1';
          }
        }, 500);
      }, 700);
    }, 1100);
  });
}

// =============================================================================
// 8. PAGE 4: SEALED ENVELOPE, LETTER & USER WISH BOX
// =============================================================================
function setupPage4() {
  const waxSealBtn = document.getElementById('wax-seal-btn');
  const envelopeElem = document.getElementById('envelope-elem');
  const letterSheetElem = document.getElementById('letter-sheet-elem');
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

    if (ParticleSystem) {
      const rect = waxSealBtn.getBoundingClientRect();
      ParticleSystem.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 25, '#ffd875');
    }

    envelopeElem.classList.add('opened');
  });

  // Keep Smiling Button -> Open Celebration & Rating Overlay
  btnKeepSmiling.addEventListener('click', () => {
    if (ParticleSystem) {
      ParticleSystem.burst(window.innerWidth / 2, window.innerHeight * 0.4, 50, '#ffdf88');
      ParticleSystem.burst(window.innerWidth * 0.3, window.innerHeight * 0.6, 30, '#ff6b81');
      ParticleSystem.burst(window.innerWidth * 0.7, window.innerHeight * 0.6, 30, '#ffd875');
    }

    celebrationOverlay.classList.add('open');
    celebrationOverlay.setAttribute('aria-hidden', 'false');
  });

  // "Close & Read Again ♡" Button -> Closes modal and returns directly to the opened Letter page
  closeCelebrationBtn.addEventListener('click', () => {
    celebrationOverlay.classList.remove('open');
    celebrationOverlay.setAttribute('aria-hidden', 'true');
    goToPage(4);
    if (envelopeElem) {
      envelopeElem.classList.add('opened');
    }
    if (letterSheetElem) {
      letterSheetElem.scrollTop = 0;
    }
  });

  // "Relive the Journey" Button -> Full page reload/restart of index.html
  restartJourneyBtn.addEventListener('click', () => {
    celebrationOverlay.classList.remove('open');
    celebrationOverlay.setAttribute('aria-hidden', 'true');
    window.location.reload();
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
    wishConfirmMsg.textContent = "Thanks for your Beatiful Thoughts... ♡ ✨";
    userWishInput.value = "";

    if (ParticleSystem) {
      ParticleSystem.burst(window.innerWidth / 2, window.innerHeight * 0.5, 30, '#ffd875');
    }
  });

  // Edit Note Modal Handlers (if present in DOM)
  if (editNoteBtn && editModal) {
    editNoteBtn.addEventListener('click', () => {
      const note = getStoredNote();
      inputSalutation.value = note.salutation;
      inputLetterBody.value = note.body;
      inputAuthor.value = note.author;
      editModal.classList.add('open');
      editModal.setAttribute('aria-hidden', 'false');
    });

    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => {
        editModal.classList.remove('open');
        editModal.setAttribute('aria-hidden', 'true');
      });
    }

    if (saveNoteBtn) {
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

        if (ParticleSystem) {
          ParticleSystem.burst(window.innerWidth / 2, window.innerHeight * 0.5, 20);
        }
      });
    }

    if (resetDefaultBtn) {
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
  }
}

function getStoredNote() {
  return DEFAULT_NOTE;
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
  window.location.reload();
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
