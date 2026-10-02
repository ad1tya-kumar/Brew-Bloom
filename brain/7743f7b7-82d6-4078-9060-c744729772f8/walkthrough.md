# BhashaSetu AI — Hackathon Prototype Walkthrough

## 🏆 Project Overview
- **Project Name**: BhashaSetu AI (भाषासेतु AI)
- **Tagline**: *"Every Child Learns Best in Their Mother Tongue"*
- **Track**: Smart India Hackathon 2024 — Government of Jharkhand Track (Problem Statement #1628)
- **Theme**: EdTech / Digital India / Inclusive Foundational Education (NEP 2020 & UN SDG 4)
- **Project Location**: `C:\Users\Lenovo\.gemini\antigravity\scratch\bhashasetu-ai`

---

## 📁 Implemented Files

| File | Purpose | Size |
|---|---|---|
| [`index.html`](file:///C:/Users/Lenovo/.gemini/antigravity/scratch/bhashasetu-ai/index.html) | Semantic HTML5 structure with all 11 required sections, Google Fonts, and `data-i18n` bindings | 45 KB |
| [`styles.css`](file:///C:/Users/Lenovo/.gemini/antigravity/scratch/bhashasetu-ai/styles.css) | Govt-tech aesthetic, Navy/Saffron/Green palette, Sohrai/Khovar tribal patterns, responsive layout | 42 KB |
| [`translations.js`](file:///C:/Users/Lenovo/.gemini/antigravity/scratch/bhashasetu-ai/translations.js) | Full English & Hindi UI dictionaries, 5 classroom scenario presets across 11 languages, and vocabulary dataset | 56 KB |
| [`app.js`](file:///C:/Users/Lenovo/.gemini/antigravity/scratch/bhashasetu-ai/app.js) | Bilingual language switcher, online/offline mode toggle, interactive speech recognition & TTS, multi-stage loading pipeline, animated counters | 22 KB |
| [`start.bat`](file:///C:/Users/Lenovo/.gemini/antigravity/scratch/bhashasetu-ai/start.bat) | 1-click Windows batch launcher to open the prototype in default browser | 1 KB |
| [`README.md`](file:///C:/Users/Lenovo/.gemini/antigravity/scratch/bhashasetu-ai/README.md) | Project pitch, judging documentation, and usage instructions | 2 KB |

---

## 🔍 Key Sections & Interactive Functionality

### 1. Navigation Header & Global Language Toggle
- **Bilingual Switcher**: Clicking **🌐 हिन्दी / English** immediately toggles all headings, body text, badges, and input placeholders across the whole site.
- **Sohrai Tribal Border**: Decorative geometric top border reflecting Jharkhand's cultural heritage.
- **Responsive Drawer**: Collapsible menu for mobile and tablet screens.

### 2. Hero Section & Animated Script Marquee
- **Official SIH Badge**: `Government of Jharkhand • SIH 2024 Problem Statement #1628`.
- **Conceptual Name Options**: Interactive pill badges showing *BhashaSetu AI (भाषासेतु)*, *VaniVahini (वाणीवाहिनी)*, and *AksharSetu (अक्षरसेतु)*.
- **Classroom Simulation Card**: Shows real-time conversation between a Hindi-speaking teacher and a Santhali student in Ol Chiki script.
- **Infinite Animated Marquee**: Continuously scrolls slogans in Devanagari, Ol Chiki, Mundari, Ho, Kurukh, Bengali, Odia, Tamil, and Telugu.

### 3. Problem Statement & Reality Narrative
- **Ground Reality Narrative**: Highlights the language mismatch in rural primary classrooms (Dumka and West Singhbhum districts).
- **4 Visual Stat Cards**:
  - **38.4%**: Foundational literacy gap by Grade 3.
  - **8+**: Indigenous languages in Jharkhand lacking digital curriculum.
  - **74%**: Teachers reporting language disconnect as their #1 barrier.
  - **12,000+**: Zero-connectivity remote forest schools requiring offline Edge AI.

### 4. Solution Overview
- 4 Feature Cards with bespoke micro-interactions:
  1. *Real-Time Classroom Translation* (Speech-to-Speech & Speech-to-Text).
  2. *100% Offline Edge-First AI* (4-bit quantized IndicTrans2 & Whisper).
  3. *Multimodal Visual Flashcards* (Vocabulary paired with culturally resonant pictograms).
  4. *Low-Literacy Teacher Dashboard* (Icon-driven JCERT textbook lesson adapter).

### 5. LIVE INTERACTIVE DEMO (The Hackathon Star Feature)
- **Online vs Offline Toggle**:
  - *Offline Mode*: Displays `⚡ Offline Mode: 4-bit Quantized On-Device TFLite Model • 0 kbps internet • 310ms latency`.
  - *Online Mode*: Displays `☁️ Online Mode: IndicTrans2 Cloud Neural Pipeline • 850ms latency`.
- **5 Classroom Preset Scenarios**:
  - 🌅 Morning Greeting & Roll Call
  - 🔢 Math Addition Lesson (3 red apples + 2 green apples)
  - 🧼 Hygiene & Mid-Day Meal (Handwashing with soap)
  - 📖 Folk Story Introduction (Rabbit & Tiger in the jungle)
  - 🌧️ Science & Nature Observation (Rain clouds & water cycle)
- **Microphone Voice Input**: Animated multi-bar soundwave visualizer with live speech-to-text fallback simulation.
- **Multi-Step Processing Pipeline**: Visualizes acoustic normalization, transformer encoding, and synthetic speech generation.
- **Pedagogy Output Card**:
  - *Native Script Display*: True Ol Chiki glyphs for Santhali (`ᱡᱚᱛᱚ ᱠᱚᱜᱮ ᱥᱟᱹᱜᱩᱱ ᱥᱮᱛᱟᱜ...`), plus Warang Chiti for Ho, and Devanagari for Mundari and Kurukh.
  - *Devanagari Transliteration*: Secondary reading support for teachers.
  - *Teacher's Romanized Phonetic Guide*: Pronunciation assistance so non-tribal teachers can speak directly to students.
  - *Contextual Visual Flashcard*: Auto-matched icon and theme card.
  - *Audio Playback*: Browser Web Speech synthesis & Web Audio acoustic tone feedback.
  - *Clipboard Copy*: With floating toast confirmation.

### 6. How It Works & System Architecture
- Step-by-step visual flow (Teacher Speaks ➔ Network Sensing ➔ Vernacular Engine ➔ Multimodal Delivery).
- 4-layer dark-themed system architecture diagram (Acoustic Input, Network Router, IndicTrans2 Core, Multimodal Output).

### 7. Sovereign Indic Tech Stack
- Badges detailing **IndicTrans2** (AI4Bharat), **Whisper Indic ASR**, **TensorFlow Lite 4-bit**, **Bhashini NLTM API**, **PWA / Service Worker**, **IndexedDB / OPFS**, **eSpeak-NG / Web Speech**, and **JCERT Lesson Adapter**.

### 8. Impact & Social Outcomes
- Animated count-up numbers triggered on scroll:
  - **35,000+** Primary Schools in Jharkhand Targetable.
  - **1,800,000+** Tribal & Rural Students Empowered.
  - **3.2x** Comprehension & Attendance Increase.
  - **0 kbps** Bandwidth Required in Offline Mode.
- Policy alignment badges for **NEP 2020 §§4.11–4.13**, **UN SDG 4**, **NIPUN Bharat**, and **Digital India**.

### 9. Pitch Video & Team Section
- Cinema-styled video frame with custom play overlay, duration badges, and 4 video chapter jump buttons.
- 6 professionally styled team cards (AI/ML Engineer, Tribal Linguistics Lead, Edge Computing Specialist, UI/UX Designer, Cloud Architect, Field Validation Lead).

---

## 🚀 How to Open and Review
To launch the website immediately in your browser:
1. Open the file explorer at `C:\Users\Lenovo\.gemini\antigravity\scratch\bhashasetu-ai`.
2. Double-click [`start.bat`](file:///C:/Users/Lenovo/.gemini/antigravity/scratch/bhashasetu-ai/start.bat) or double-click [`index.html`](file:///C:/Users/Lenovo/.gemini/antigravity/scratch/bhashasetu-ai/index.html).
