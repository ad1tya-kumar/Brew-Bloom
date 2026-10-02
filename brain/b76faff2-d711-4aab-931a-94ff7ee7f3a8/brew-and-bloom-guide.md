# ☕ Brew & Bloom Café — Online Food Ordering & Delivery Platform (v2.0)

## 📍 Project Location
```
C:\Users\Lenovo\.gemini\antigravity\scratch\brew-and-bloom\
```

---

## 🎨 Design System & High-Contrast Palette

| Token | Hex | Role |
|---|---|---|
| Deep Forest Green | `#073B32` | Primary brand tone, navbar on scroll, bestsellers bg, admin badges |
| Dark Espresso | `#172421` | Base dark background (Hero, Gallery, Footer), high contrast text |
| Vibrant Orange | `#FF7629` | Primary CTA buttons, Add-to-Cart, active route lines, highlights |
| Golden Yellow | `#FFC247` | Secondary CTA, Bestseller tags, stage progress accents |
| Warm Cream | `#FFF8EC` | Base menu section surface, drawer background |
| Fresh Mint | `#D9F3E5` | Veg indicators, distance badges, fresh tags |
| White | `#FFFFFF` | Card backgrounds, inputs, modal containers |
| Coral Pink & Lavender | `#FF6B6B` / `#E5DBFF` | Promo banners and special tags |

---

## 🗂️ Application Structure

| Path | Purpose |
|---|---|
| [`index.html`](file:///C:/Users/Lenovo/.gemini/antigravity/scratch/brew-and-bloom/index.html) | Storefront: Hero, Promo Banners, Dynamic Menu, Bestsellers, About, Gallery, Location Map, Cart Drawer & Checkout Modal |
| [`order-tracking.html`](file:///C:/Users/Lenovo/.gemini/antigravity/scratch/brew-and-bloom/order-tracking.html) | Customer Live Order Tracking: 6-stage timeline, interactive Leaflet map, remaining distance, ETA, Driver card, Demo ride simulator |
| [`admin.html`](file:///C:/Users/Lenovo/.gemini/antigravity/scratch/brew-and-bloom/admin.html) | Kitchen & Owner Dashboard: PIN authenticated (`brew2026`), live order cards, status updater, driver assignment, menu stock toggles, sales stats |
| [`driver.html`](file:///C:/Users/Lenovo/.gemini/antigravity/scratch/brew-and-bloom/driver.html) | Driver Fleet App: PIN authenticated (`driver2026`), active delivery task, Google Maps navigation, genuine device GPS broadcast (`watchPosition`) |
| [`js/config.js`](file:///C:/Users/Lenovo/.gemini/antigravity/scratch/brew-and-bloom/js/config.js) | Central configuration: café info, Haldia coordinates, delivery radius (10km), fees, taxes, Supabase & UPI settings |
| [`js/menu-data.js`](file:///C:/Users/Lenovo/.gemini/antigravity/scratch/brew-and-bloom/js/menu-data.js) | Complete menu data: Coffee, Tea, Cold Beverages, Quick Bites, Pizza & Pasta, Desserts with photos & prices |
| [`js/cart.js`](file:///C:/Users/Lenovo/.gemini/antigravity/scratch/brew-and-bloom/js/cart.js) | Reactive Cart Engine: Add/Remove, localStorage persistence, subtotal, 5% GST tax & distance delivery fee calculation |
| [`js/supabase-client.js`](file:///C:/Users/Lenovo/.gemini/antigravity/scratch/brew-and-bloom/js/supabase-client.js) | Backend client: Realtime Supabase integration with automatic, zero-crash LocalStorage Demo fallback |
| [`supabase-schema.sql`](file:///C:/Users/Lenovo/.gemini/antigravity/scratch/brew-and-bloom/supabase-schema.sql) | Ready-to-run PostgreSQL schema for Supabase: tables, RLS policies & Realtime publication |
| [`style.css`](file:///C:/Users/Lenovo/.gemini/antigravity/scratch/brew-and-bloom/style.css) | Complete unified responsive CSS |
| [`script.js`](file:///C:/Users/Lenovo/.gemini/antigravity/scratch/brew-and-bloom/script.js) | Frontend controller for the storefront |

---

## 🔐 Credentials & Default Access Codes

* **Admin Portal** ([`admin.html`](http://localhost:3000/admin.html)):
  * Passcode PIN: `brew2026`
* **Driver Portal** ([`driver.html`](http://localhost:3000/driver.html)):
  * Passcode PIN: `driver2026`

---

## 🛰️ Live Tracking vs. Demo Simulation

* **When backend is unconfigured (Demo Mode):**
  * Displays a prominent `⚠️ DEMO TRACKING — NOT LIVE GPS` badge.
  * Provides interactive controls: **Advance Stage →** and **Drive Scooter 🛵** which simulates real movement along the Haldia route.
* **When Supabase is connected (Live Mode):**
  * Displays `🟢 LIVE GPS TELEMETRY ACTIVE`.
  * The Driver partner opens `driver.html` on their phone, clicks **Start Live GPS Sharing**, which activates `navigator.geolocation.watchPosition` and streams real coordinates to `driver_locations` table in Supabase.
  * The customer's tracking map subscribes via Supabase Realtime and animates the driver's marker smoothly.

---

## 🗄️ Setting Up Supabase Backend (Optional)

1. Sign up free at [supabase.com](https://supabase.com) and create a project.
2. Go to **SQL Editor** → paste contents of [`supabase-schema.sql`](file:///C:/Users/Lenovo/.gemini/antigravity/scratch/brew-and-bloom/supabase-schema.sql) → click **Run**.
3. In Supabase Dashboard, go to **Project Settings** → **API**.
4. Open [`js/config.js`](file:///C:/Users/Lenovo/.gemini/antigravity/scratch/brew-and-bloom/js/config.js) and update:
   ```javascript
   supabase: {
     url: 'https://YOUR_PROJECT_ID.supabase.co',
     anonKey: 'YOUR_ANON_PUBLIC_KEY'
   }
   ```
5. If left empty, the application runs seamlessly in **LocalStorage Demo Mode** with complete functionality!

---

## 🚀 Deployment to Vercel

```powershell
cd C:\Users\Lenovo\.gemini\antigravity\scratch\brew-and-bloom

# 1. Test locally
npx serve . -l 3000

# 2. Deploy via Vercel CLI
vercel

# 3. For production release:
vercel --prod
```
The included `vercel.json` automatically configures static caching and security headers.
