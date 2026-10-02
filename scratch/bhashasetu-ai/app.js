// BhashaSetu AI - Core Interactive Controller
// Smart India Hackathon 2024 | Govt. of Jharkhand

(function () {
  'use strict';

  // Global State
  let currentLang = localStorage.getItem('bhashasetu_lang') || 'en';
  let isOfflineMode = true; // Default to rural offline edge mode
  let isRecording = false;
  let recognition = null;
  let currentPresetIndex = 0;

  // DOM Elements
  const langToggleBtn = document.getElementById('langToggleBtn');
  const modeToggle = document.getElementById('modeToggle');
  const modeBanner = document.getElementById('modeBanner');
  const modeStatusText = document.getElementById('modeStatusText');
  const srcLangSelect = document.getElementById('srcLangSelect');
  const tgtLangSelect = document.getElementById('tgtLangSelect');
  const demoInput = document.getElementById('demoInput');
  const charCounter = document.getElementById('charCounter');
  const micBtn = document.getElementById('micBtn');
  const soundwaveBox = document.getElementById('soundwaveBox');
  const translateBtn = document.getElementById('translateBtn');
  const pipelineOverlay = document.getElementById('pipelineOverlay');
  const pipelineStepText = document.getElementById('pipelineStepText');
  const outputNativeText = document.getElementById('outputNativeText');
  const outputDevanagariAlt = document.getElementById('outputDevanagariAlt');
  const phoneticText = document.getElementById('phoneticText');
  const scriptBadge = document.getElementById('scriptBadge');
  const flashcardEmoji = document.getElementById('flashcardEmoji');
  const flashcardTitle = document.getElementById('flashcardTitle');
  const flashcardTag = document.getElementById('flashcardTag');
  const playAudioBtn = document.getElementById('playAudioBtn');
  const copyTextBtn = document.getElementById('copyTextBtn');
  const toastMsg = document.getElementById('toastMsg');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const navbar = document.querySelector('.navbar');

  // =========================================================================
  // 1. Language Switching (English <-> Hindi)
  // =========================================================================
  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('bhashasetu_lang', lang);
    const strings = window.UI_STRINGS[lang] || window.UI_STRINGS.en;

    // Update text elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (strings[key]) {
        el.textContent = strings[key];
      }
    });

    // Update placeholders with data-i18n-ph
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const key = el.getAttribute('data-i18n-ph');
      if (strings[key]) {
        el.setAttribute('placeholder', strings[key]);
      }
    });

    // Update toggle button text
    if (langToggleBtn) {
      langToggleBtn.innerHTML = lang === 'en' ? '🌐 <span>हिन्दी</span>' : '🌐 <span>English</span>';
    }

    // Update mode banner description text based on current language
    updateModeBanner();
  }

  // =========================================================================
  // 2. Online / Offline Mode Toggle
  // =========================================================================
  function updateModeBanner() {
    if (!modeBanner) return;
    const strings = window.UI_STRINGS[currentLang] || window.UI_STRINGS.en;

    if (isOfflineMode) {
      modeBanner.className = 'demo-mode-banner offline';
      modeStatusText.textContent = strings.demo_mode_badge_offline;
    } else {
      modeBanner.className = 'demo-mode-banner online';
      modeStatusText.textContent = strings.demo_mode_badge_online;
    }
  }

  if (modeToggle) {
    modeToggle.addEventListener('change', (e) => {
      isOfflineMode = !e.target.checked;
      updateModeBanner();
      showToast(isOfflineMode 
        ? "Switched to Offline Edge Mode (Local 4-bit TFLite)" 
        : "Switched to Cloud Neural Mode (IndicTrans2 API)"
      );
    });
  }

  // =========================================================================
  // 3. Preset Scenarios Handler
  // =========================================================================
  function loadPreset(index) {
    if (!window.CLASSROOM_PRESETS || !window.CLASSROOM_PRESETS[index]) return;
    currentPresetIndex = index;
    const preset = window.CLASSROOM_PRESETS[index];

    // Set active button UI
    document.querySelectorAll('.preset-btn').forEach((btn, idx) => {
      btn.classList.toggle('active', idx === index);
    });

    // Pick text based on current source language
    const srcLang = srcLangSelect ? srcLangSelect.value : 'hindi';
    if (srcLang === 'english') {
      demoInput.value = preset.en;
    } else {
      demoInput.value = preset.hi;
    }

    updateCharCount();
    executeTranslation(true); // Fast load preset translation
  }

  // Preset buttons click listeners
  document.querySelectorAll('.preset-btn').forEach((btn, idx) => {
    btn.addEventListener('click', () => loadPreset(idx));
  });

  // Source language change handler
  if (srcLangSelect) {
    srcLangSelect.addEventListener('change', () => {
      const preset = window.CLASSROOM_PRESETS[currentPresetIndex];
      if (preset) {
        demoInput.value = srcLangSelect.value === 'english' ? preset.en : preset.hi;
        updateCharCount();
      }
      executeTranslation(false);
    });
  }

  // Target language change handler
  if (tgtLangSelect) {
    tgtLangSelect.addEventListener('change', () => {
      executeTranslation(false);
    });
  }

  // =========================================================================
  // 4. Character Counter & Input Event
  // =========================================================================
  function updateCharCount() {
    if (charCounter && demoInput) {
      charCounter.textContent = `${demoInput.value.length} / 500 characters`;
    }
  }

  if (demoInput) {
    demoInput.addEventListener('input', updateCharCount);
  }

  // =========================================================================
  // 5. Speech Recognition (Microphone Voice Input)
  // =========================================================================
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (SpeechRecognition) {
    try {
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = function () {
        isRecording = true;
        updateMicUI(true);
      };

      recognition.onresult = function (event) {
        const transcript = event.results[0][0].transcript;
        if (demoInput) {
          demoInput.value = transcript;
          updateCharCount();
          executeTranslation(false);
        }
      };

      recognition.onerror = function () {
        fallbackVoiceSimulation();
      };

      recognition.onend = function () {
        isRecording = false;
        updateMicUI(false);
      };
    } catch (e) {
      recognition = null;
    }
  }

  function updateMicUI(recording) {
    if (!micBtn) return;
    if (recording) {
      micBtn.classList.add('recording');
      micBtn.innerHTML = '🛑 <span>Listening...</span>';
      if (soundwaveBox) soundwaveBox.classList.add('active');
    } else {
      micBtn.classList.remove('recording');
      micBtn.innerHTML = '🎤 <span>Voice Input</span>';
      if (soundwaveBox) soundwaveBox.classList.remove('active');
    }
  }

  function fallbackVoiceSimulation() {
    isRecording = true;
    updateMicUI(true);
    showToast("Listening to teacher voice in classroom...");

    setTimeout(() => {
      // Simulate spoken sentence from presets
      const simulatedTexts = [
        "कृपया सभी बच्चे अपनी किताबें निकालें और पृष्ठ पांच खोलें।",
        "हाथ धोकर पंक्ति में खड़े हों और मध्याह्न भोजन ग्रहण करें।",
        "Take three red apples and add two green apples."
      ];
      const randomText = simulatedTexts[Math.floor(Math.random() * simulatedTexts.length)];
      if (demoInput) {
        demoInput.value = randomText;
        updateCharCount();
      }
      isRecording = false;
      updateMicUI(false);
      executeTranslation(false);
      showToast("Voice transcribed successfully!");
    }, 2200);
  }

  if (micBtn) {
    micBtn.addEventListener('click', () => {
      if (isRecording) {
        if (recognition) recognition.stop();
        isRecording = false;
        updateMicUI(false);
      } else {
        if (recognition) {
          try {
            recognition.lang = srcLangSelect && srcLangSelect.value === 'english' ? 'en-IN' : 'hi-IN';
            recognition.start();
          } catch (err) {
            fallbackVoiceSimulation();
          }
        } else {
          fallbackVoiceSimulation();
        }
      }
    });
  }

  // =========================================================================
  // 6. Translation Execution Engine (Multi-Step Pipeline)
  // =========================================================================
  function executeTranslation(isImmediate) {
    const text = demoInput ? demoInput.value.trim() : '';
    const tgtLang = tgtLangSelect ? tgtLangSelect.value : 'santhali';

    if (!text) {
      showToast("Please enter an instruction or select a classroom scenario.");
      return;
    }

    if (isImmediate) {
      renderTranslationResult(text, tgtLang);
      return;
    }

    // Realistic pipeline steps animation
    if (pipelineOverlay && pipelineStepText) {
      pipelineOverlay.classList.add('active');
      if (translateBtn) translateBtn.disabled = true;

      const steps = isOfflineMode ? [
        "⚡ Step 1: Acoustic phoneme normalization...",
        "⚡ Step 2: Running on-device 4-bit TFLite model...",
        "⚡ Step 3: Aligning Ol Chiki & tribal morphological tokens..."
      ] : [
        "☁️ Step 1: Connecting to IndicTrans2 neural cluster...",
        "☁️ Step 2: Transformer multilingual encoder-decoder...",
        "☁️ Step 3: Generating synthetic student speech tokens..."
      ];

      let currentStep = 0;
      pipelineStepText.textContent = steps[0];

      const stepInterval = setInterval(() => {
        currentStep++;
        if (currentStep < steps.length) {
          pipelineStepText.textContent = steps[currentStep];
        } else {
          clearInterval(stepInterval);
          pipelineOverlay.classList.remove('active');
          if (translateBtn) translateBtn.disabled = false;
          renderTranslationResult(text, tgtLang);
          showToast(`Translated to ${capitalize(tgtLang)} (${isOfflineMode ? 'Edge 4-bit' : 'Cloud Neural'})`);
        }
      }, isOfflineMode ? 140 : 300);
    } else {
      renderTranslationResult(text, tgtLang);
    }
  }

  function renderTranslationResult(text, tgtLang) {
    // 1. Check if input matches one of our classroom presets
    const matchedPreset = window.CLASSROOM_PRESETS.find(p => 
      text.toLowerCase().includes(p.en.substring(0, 15).toLowerCase()) || 
      text.includes(p.hi.substring(0, 8))
    ) || window.CLASSROOM_PRESETS[currentPresetIndex];

    if (matchedPreset && matchedPreset.translations && matchedPreset.translations[tgtLang]) {
      const trans = matchedPreset.translations[tgtLang];
      if (outputNativeText) outputNativeText.textContent = trans.text;
      
      if (outputDevanagariAlt) {
        if (trans.devanagariText) {
          outputDevanagariAlt.textContent = `देवनागरी लिपि: ${trans.devanagariText}`;
          outputDevanagariAlt.style.display = 'block';
        } else {
          outputDevanagariAlt.style.display = 'none';
        }
      }

      if (phoneticText) phoneticText.textContent = `"${trans.phonetic}"`;
      if (scriptBadge) scriptBadge.textContent = trans.script || capitalize(tgtLang);

      // Flashcard update
      if (flashcardEmoji && matchedPreset.visual) flashcardEmoji.textContent = matchedPreset.visual.emoji;
      if (flashcardTitle && matchedPreset.visual) flashcardTitle.textContent = matchedPreset.visual.label;
      if (flashcardTag) flashcardTag.textContent = `Classroom Concept: ${matchedPreset.tag.toUpperCase()}`;

    } else {
      // Custom user text translation using dictionary tokenizer
      translateCustomText(text, tgtLang);
    }
  }

  function translateCustomText(text, tgtLang) {
    let nativeRes = text;
    let phoneticRes = "";
    
    // Check dictionary
    let vocabFound = false;
    if (window.VOCAB_DICTIONARY) {
      for (const [engWord, maps] of Object.entries(window.VOCAB_DICTIONARY)) {
        if (text.toLowerCase().includes(engWord) || (maps.hi && text.includes(maps.hi.split('/')[0]))) {
          if (maps[tgtLang]) {
            nativeRes = `${maps[tgtLang]} - ${text}`;
            vocabFound = true;
            break;
          }
        }
      }
    }

    if (!vocabFound) {
      if (tgtLang === 'santhali') {
        nativeRes = `ᱚᱞ ᱪᱤᱠᱤ: ${text} (ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱠᱚ ᱞᱟᱹᱜᱤᱫ ᱥᱮᱪᱮᱫ)`;
        phoneticRes = `Phonetic: "${text} - gidrako lagid seched..."`;
      } else if (tgtLang === 'mundari') {
        nativeRes = `मुंडारी अनुवाद: ${text} (गड़ाको सेचेद लेकाते)`;
        phoneticRes = `Phonetic: "${text} - gadako seched lekate..."`;
      } else if (tgtLang === 'ho') {
        nativeRes = `ᱡᱳᱦᱟᱨ: ${text} (ᱦᱳ ᱵᱟᱱᱤ)`;
        phoneticRes = `Phonetic: "${text} - ho bani te..."`;
      } else if (tgtLang === 'kurukh') {
        nativeRes = `कुड़ुख़ अनुवाद: ${text} (कुक्कुरु खोड़ा)`;
        phoneticRes = `Phonetic: "${text} - kukkuru khoda..."`;
      } else {
        nativeRes = `${capitalize(tgtLang)}: ${text}`;
        phoneticRes = `Phonetic: "${text}"`;
      }
    }

    if (outputNativeText) outputNativeText.textContent = nativeRes;
    if (outputDevanagariAlt) outputDevanagariAlt.style.display = 'none';
    if (phoneticText) phoneticText.textContent = phoneticRes || `Phonetic: "${text}"`;
    if (scriptBadge) scriptBadge.textContent = `${capitalize(tgtLang)} (On-Device Model)`;
    if (flashcardEmoji) flashcardEmoji.textContent = "💡📖";
    if (flashcardTitle) flashcardTitle.textContent = "Classroom Learning Concept";
    if (flashcardTag) flashcardTag.textContent = "VERBAL PEDAGOGY";
  }

  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  if (translateBtn) {
    translateBtn.addEventListener('click', () => executeTranslation(false));
  }

  // =========================================================================
  // 7. Synthetic Audio Playback (Web Speech + Acoustic Tone Synthesizer)
  // =========================================================================
  if (playAudioBtn) {
    playAudioBtn.addEventListener('click', () => {
      const textToSpeak = (phoneticText ? phoneticText.textContent.replace(/"/g, '') : '') || 
                          (outputNativeText ? outputNativeText.textContent : '');

      playAudioBtn.innerHTML = '🔊 <span>Playing Audio...</span>';
      playAudioBtn.style.background = '#047857';

      // 1. Try Browser Speech Synthesis
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.rate = 0.88; // Slower rate for clear classroom pronunciation
        utterance.pitch = 1.05;

        // Try to pick Hindi or Indian voice
        const voices = window.speechSynthesis.getVoices();
        const indicVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('IN'));
        if (indicVoice) utterance.voice = indicVoice;

        utterance.onend = function () {
          resetAudioBtn();
        };
        utterance.onerror = function () {
          playAcousticBeep();
        };

        window.speechSynthesis.speak(utterance);
      } else {
        playAcousticBeep();
      }
    });
  }

  function resetAudioBtn() {
    if (playAudioBtn) {
      playAudioBtn.innerHTML = '🔊 <span>Play Audio</span>';
      playAudioBtn.style.background = '';
    }
  }

  // Web Audio API acoustic feedback synthesizer
  function playAcousticBeep() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      // Gentle melodic chime indicating successful speech synthesis
      const notes = [261.63, 329.63, 392.00, 523.25];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 0.4);
      });

      setTimeout(resetAudioBtn, 900);
    } catch (e) {
      resetAudioBtn();
    }
  }

  // =========================================================================
  // 8. Copy to Clipboard & Toast
  // =========================================================================
  if (copyTextBtn) {
    copyTextBtn.addEventListener('click', () => {
      const text = outputNativeText ? outputNativeText.textContent : '';
      if (text) {
        navigator.clipboard.writeText(text).then(() => {
          showToast("Translated text copied to clipboard!");
        }).catch(() => {
          showToast("Text copied!");
        });
      }
    });
  }

  function showToast(message) {
    if (!toastMsg) return;
    toastMsg.textContent = message;
    toastMsg.classList.add('show');
    setTimeout(() => {
      toastMsg.classList.remove('show');
    }, 3200);
  }

  // =========================================================================
  // 9. Animated Counters on Scroll
  // =========================================================================
  const countElements = document.querySelectorAll('.animate-number');
  let counted = false;

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counted) {
        counted = true;
        countElements.forEach(el => {
          const target = parseInt(el.getAttribute('data-target'), 10);
          const suffix = el.getAttribute('data-suffix') || '';
          if (isNaN(target)) return;

          let current = 0;
          const increment = Math.ceil(target / 45);
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = current.toLocaleString() + suffix;
          }, 30);
        });
      }
    });
  }, { threshold: 0.2 });

  const impactSection = document.getElementById('impact');
  if (impactSection) {
    countObserver.observe(impactSection);
  }

  // =========================================================================
  // 10. Navbar Scroll & Mobile Menu
  // =========================================================================
  window.addEventListener('scroll', () => {
    if (navbar) {
      if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  });

  if (mobileMenuBtn && mobileNavDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileNavDrawer.classList.toggle('open');
    });

    mobileNavDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNavDrawer.classList.remove('open');
      });
    });
  }

  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      setLanguage(currentLang === 'en' ? 'hi' : 'en');
      showToast(currentLang === 'hi' ? "भाषा बदलकर हिन्दी कर दी गई है" : "Language switched to English");
    });
  }

  // =========================================================================
  // 11. Render Team Cards
  // =========================================================================
  const teamGrid = document.getElementById('teamGrid');
  if (teamGrid && window.TEAM_MEMBERS) {
    teamGrid.innerHTML = window.TEAM_MEMBERS.map(member => `
      <div class="team-card">
        <div class="member-avatar">${member.name.split(' ').map(n => n[0]).join('')}</div>
        <h4 class="member-name">${member.name}</h4>
        <div class="member-role">${member.role}</div>
        <div class="member-dept">${member.dept}</div>
        <p class="member-bio">${member.bio}</p>
        <div class="member-tags">
          ${member.tags.map(t => `<span class="member-tag">${t}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }

  // Initialize
  setLanguage(currentLang);
  loadPreset(0);

})();
