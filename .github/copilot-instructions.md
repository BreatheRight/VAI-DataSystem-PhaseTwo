# VAI Data System Phase Two - AI Agent Instructions

You are an expert full-stack engineer working on the **Van Alen Institute Public Art Impact Measurement System** Phase Two. This system captures public engagement data for community art installations via a mobile-first survey app and provides analytics through an admin dashboard.

## 🏗️ Architecture Overview

### Hybrid Stack Philosophy
This codebase implements a **pragmatic hybrid UI strategy**:
- **Admin Dashboard** (Dashboard, Table View, Settings): Material UI 5.14.20 for data-heavy analytics
- **Event Manager**: Tailwind CSS for brand-aligned CRUD operations
- **Public Survey & Landing**: Tailwind CSS exclusively with VAI Neo-Brutalist design

**Why?** MUI provides robust data grids and modals for desktop admin workflows, while Tailwind delivers pixel-perfect brand alignment for public touchpoints. DO NOT attempt to "standardize" on one framework without explicit approval.

### Service Boundaries
```
┌─────────────────┐    JWT Bearer Token    ┌──────────────────┐
│ React + Vite    │ ◄─────────────────────► │ Flask API        │
│ (frontend/)     │   axios (apiClient.js)  │ (backend/app/)   │
│                 │                          │                  │
│ • Public Survey │                          │ • /submit-survey │
│ • Admin Dashboard│                         │ • /installations │
│ • Event Manager │                          │ • /get-survey... │
└─────────────────┘                          └──────────────────┘
                                                      │
                                                      ▼
                                              ┌──────────────┐
                                              │  Firestore   │
                                              │              │
                                              │ • users      │
                                              │ • surveys... │
                                              │ • installations│
                                              └──────────────┘
```

## 🔐 Critical Security Patterns

### Authentication Flow
1. User signs up/logs in via Firebase Auth (`frontend/src/pages/LoginNew.jsx`)
2. Firebase returns JWT, stored in `localStorage.jwtToken`
3. `apiClient.js` interceptor auto-attaches `Authorization: Bearer <token>` to ALL requests
4. Backend routes verify token via `firebase_admin.auth.verify_id_token()` (see `backend/app/routes.py:113-135`)

**Admin-only routes requiring token verification:**
- `/get-survey-responses`
- `/generate-report`
- `/installations` (GET/POST/PUT/DELETE)
- `/survey-questions` (GET/POST/PUT/DELETE)

**NEVER skip token verification on admin endpoints.** Public routes like `/submit-survey` intentionally remain open.

### Environment Variables
**Frontend (Vite):** All env vars prefixed `VITE_*` (NOT `REACT_APP_`)
```bash
VITE_API_BASE_URL=http://localhost:5000  # Flask backend URL
VITE_API_KEY=...                         # Firebase config
VITE_AUTH_DOMAIN=...
VITE_PROJECT_ID=...
```

**Backend (Flask):**
```bash
FIREBASE_KEY_PATH=backend/app/firebase_key.json  # Service account
FRONTEND_URL=http://localhost:5173               # CORS whitelist
```

## 🎨 UI/UX Conventions

### VAI Brand System (Tailwind Config)
```javascript
// tailwind.config.js
colors: {
  vai: {
    black: "#121212",    // Primary text
    orange: "#FF710F",   // CTA buttons, accents
    white: "#FFFFFF",    // Backgrounds
    grayLight: "#E1E0E1" // Borders, dividers
  }
}
fontFamily: {
  sans: ["Hanken Grotesk"],  // Headings
  heading: ["Inter"]          // Body text
}
```

**Examples in the codebase:**
- `frontend/src/pages/LandingPageNew.jsx`: `className="font-inter"`
- `frontend/src/components/SurveyCardStack.jsx`: `className="font-hanken text-6xl"`

### Icon Usage
- **Lucide React icons** are functional UI (Edit2, Trash2, ArrowRight for navigation)
- **NO decorative emojis** per VAI branding guidelines
- See `frontend/src/REFERENCE-ONLY/UserPersonas.jsx` for pure-typography patterns

## 🔧 Developer Workflows

### Local Setup Commands
```bash
# Backend (Python 3.12+)
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt
python run.py  # Starts Flask on :5000

# Frontend (Node 18+)
cd frontend
npm install
npm run dev  # Starts Vite on :5173
```

### Running Tests
```bash
# Backend (pytest)
cd backend
pytest tests/test_routes_basic.py  # Smoke tests for critical routes

# Frontend (Vitest - not yet fully wired)
cd frontend
npm test  # Commented out in CI, see .github/workflows/ci.yml
```

### Data Seeding
```bash
cd backend
python scripts/seed_responses.py  # Generates 50 random survey responses
python scripts/migrate_questions_to_firestore.py  # One-time migration
```

## 📂 Key Files by Task

### Adding a New Survey Question
1. **Hardcoded (current):** Edit `frontend/src/data/surveyQuestions.js`
2. **Future API-driven:** POST to `/survey-questions` (endpoints exist, frontend not wired yet)

### Event Manager CRUD
- **Backend:** `backend/app/routes.py:234-372` (4 endpoints)
- **Frontend:** `frontend/src/pages/EventManager.jsx` (QR code generation via `react-qr-code`)

### QR Code Flow
1. Admin creates installation in Event Manager → Firestore doc created with ID
2. QR code renders URL: `{baseURL}/survey?installationId={id}`
3. **Localhost limitation:** QR codes on `localhost:5173` only work on same local network
4. **Production:** Deploy to Vercel/Cloud Run for public QR scanning

### Analytics Dashboard
- **KPI Calculation:** `frontend/src/pages/Dashboard.jsx:150-180` (useMemo hooks)
- **Charts:** Chart.js with `chartjs-plugin-datalabels` for inline percentages
- **Filtering:** `filteredData` updates when filters change, triggering chart re-render

## 🚫 Common Pitfalls

### 1. Survey Response Normalization Bug (FIXED)
**Problem:** `responses = response_data.get('responses')` was overwriting normalized checkbox arrays.
**Solution:** Line 64 of `routes.py` now preserves normalized data. DO NOT add this line back.

### 2. Firestore `.add()` Return Value
```python
# WRONG: doc_ref[1].id
update_time, doc_ref = db.collection('bugReports').add(data)
return doc_ref[0].id  # CORRECT
```

### 3. Material UI vs Tailwind Mixing
- Dashboard core pages: Use MUI `<Grid>`, `<Paper>`, `<Button variant="contained">`
- Event Manager: Use Tailwind `className="px-4 py-2 border border-vai-black"`
- **Never import MUI into Survey/Landing pages** (Tailwind-only zone)

### 4. Missing File Paths in Import Statements
After file renames, watch for broken imports:
```jsx
// WRONG (spaces removed from filenames)
import SurveyCardStack from './components/SurveyCardStack Component';

// CORRECT
import SurveyCardStack from './components/SurveyCardStack';
```

## 📋 Documentation Hierarchy

**Primary:** `docs/handoff/Final-Polish-Security-and-Handoff-Plan.md` (execution roadmap)
**Reference:** `docs/architecture/Source-of-Truth-2025-12-20.md` (detailed system design)
**Handoff Docs:**
- `docs/handoff/HANDOFF-SUMMARY-STABLE-RELEASE.md` (deployment walkthrough)
- `docs/handoff/TODO-COMPLETION-SUMMARY.md` (recent completion log)
- `MAIN-TASKLIST` (root-level priority list)

**DO NOT reference:** `docs/archive/**` or `REFERENCEONLY-ComponetnsFromTypescript/**` (outdated)

## 🎯 Current Priorities (MAIN-TASKLIST)

1. **QR Code Functionality** ✅ (Implemented)
2. **Event Manager CRUD** ✅ (Backend + Frontend wired)
3. **Survey Questions → Firestore** (API exists, frontend migration pending)
4. **Spanish Translation** (Deferred to next phase)
5. **User Session Metrics** (Skeleton needed, see MAIN-TASKLIST:80-108)
6. **Search Bar for Admin Dashboard** (Planned, not started)

## 🔍 When Making Changes

1. **Security first:** If touching auth/admin routes, verify token checks remain intact
2. **Test both UIs:** Changes to shared components may affect MUI and Tailwind pages differently
3. **Check mobile:** Public survey is mobile-first; always test on small viewports
4. **Update docs:** If behavior changes, update `HANDOFF-SUMMARY-STABLE-RELEASE.md`
5. **No breaking changes:** System is in final polish phase; prefer additive changes

## 🚀 Deployment Targets

- **Frontend:** Vercel (auto-deploy from `stable-handoff-release` branch)
- **Backend:** Google Cloud Run (manual deploy via `gcloud run deploy`)
- **Database:** Firestore (production rules restrict write access to authenticated users)

---

**Questions?** Reference `docs/handoff/Project-Close-Tasks-and-Handoff-Recommendations.md` for stakeholder-friendly explanations of technical decisions.

# STRICT RULE: NO USE OF EMOJIS OR DECORATIVE ICONS IN THE CODEBASE. MINIMAL USE OF FUNCTIONAL ICONS ONLY. AVOID ALL EMOJIS, USE MODERN ICONS IF NECESSARY FOR THOSE FUNCTIONAL UI UX ITEMS.
