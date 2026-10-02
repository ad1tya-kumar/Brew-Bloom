# BhashaSetu AI — SIH Hackathon Website

## Overview
A complete, production-quality single-page React application for the Smart India Hackathon (Government of Jharkhand track) showcasing an AI-powered vernacular pedagogy and real-time translation tool.

## Architecture Decision
**React + Vite** (no external paid APIs, all demo logic is local mock with realistic UX)

Directory: `C:\Users\Lenovo\.gemini\antigravity\scratch\bhashasetu-ai`

## Proposed Changes

### Project Structure
```
bhashasetu-ai/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css          ← Global styles, fonts, CSS variables, tribal patterns
    ├── i18n.js            ← EN/HI translation strings for site UI
    ├── data/
    │   ├── translations.js ← Mock translation dictionary
    │   └── teamData.js
    └── components/
        ├── Navbar.jsx
        ├── Hero.jsx
        ├── ProblemStatement.jsx
        ├── SolutionOverview.jsx
        ├── LiveDemo.jsx       ← Core interactive widget
        ├── HowItWorks.jsx
        ├── TechStack.jsx
        ├── Impact.jsx
        ├── VideoSection.jsx
        ├── Team.jsx
        └── Footer.jsx
```

### Key Technical Decisions
- **Color palette**: Deep navy `#0A2342`, Saffron `#FF6B35`, White `#FAFAFA`, Forest green `#1B4332`
- **Fonts**: Google Fonts — `Noto Sans` (multi-script Devanagari/Bengali/Tamil/Telugu/Odia support) + `Inter` for UI
- **Tribal pattern**: SVG-based Sohrai/geometric motif as CSS background-image
- **Translation mock**: Pre-mapped phrase dictionary for ~15 phrases × 10 languages
- **Animations**: CSS keyframes + Intersection Observer for scroll reveal
- **Language toggle**: React context switching EN ↔ HI site-wide

## Verification Plan
- `npm run dev` serves locally; visual check on all sections
- Confirm Hindi/Tamil/Bengali scripts render (not boxes)
- Demo translate button produces realistic output with loading state
- Mobile responsive check via DevTools
