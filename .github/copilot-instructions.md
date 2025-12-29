You are an expert full-stack engineer maintaining the Van Alen Institute Public Art Impact Measurement System. The system is a React + Vite frontend (JS/JSX only) with a Flask API and Firestore. The public survey is Tailwind-only; the admin dashboard uses MUI; Event Manager uses Tailwind.

## Architecture

- Frontend: Vite (Node 25.2.1), React, JS/JSX only. No TypeScript in this build. Do not reintroduce TS.
- Backend: Flask 3.1.0 (`backend/app`), Python 3.12, Firebase Admin for auth, Firestore for data.
- Auth: Firebase ID token stored as `localStorage.jwtToken`; axios interceptor attaches `Authorization: Bearer <token>`.

## Security (must keep)

- Admin routes require auth: `/get-survey-responses`, `/generate-report`, `/installations`, `/survey-questions`.
- Frontend route guards: `/dashboard` and children redirect to `/login` when unauthenticated. Sidebar must not render when logged out. Dashboard redirects if not authed. See `frontend/src/App.jsx`, `frontend/src/ui/SidebarLayout.jsx`, `frontend/src/pages/Dashboard.jsx`, `frontend/src/utils/apiClient.js`.
- Backend verifies tokens via `firebase_admin.auth.verify_id_token()`.

## Current Objectives (Handoff Phase)

1) Deploy-ready security and stability: keep auth guards intact; no unauthenticated dashboard access.
2) Clean workspace: no TS remnants; keep JS/JSX. Avoid new dependencies unless critical.
3) Handoff readiness: update docs when behavior changes; keep commits minimal and focused.
4) Bug fixes first; Vercel deploy only from a clean branch (auth fix already committed).

## Environment

- Frontend env (Vite): `VITE_API_BASE_URL`, `VITE_API_KEY`, `VITE_AUTH_DOMAIN`, `VITE_PROJECT_ID`.
- Backend env: `FIREBASE_KEY_PATH=backend/app/firebase_key.json`, `FRONTEND_URL=http://localhost:5173`.

## UI/UX Conventions

#### 1.New Accurate Color System

The website uses a distinct palette. The "Civic Teal" (#01ec9c) from the old guide is **not present**. Replace it with the observed accent colors.
**Primary Palette (UI & Text)**

| Role | Hex | Usage & Notes |
|------|-----|---------------|
| **Primary Black** | `#121212` | Main body text, primary headers. (Seen in screenshots). |
| **Warm Orange (Primary Accent)** | `#FF710F` | Key interactive elements: buttons, active filters, selected state, key highlights. (Dominant in screenshots). |
| **Pure White** | `#FFFFFF` | Backgrounds, card surfaces, negative space. |
| **Light Grey** | `#888888` | Secondary text, inactive states, captions. |
| **Medium Grey** | `#7E7E7E` | Borders, divider lines, footer text. (From original guide, fits observed style). |
| **Background Grey** | `#EFEFEF` / `#E1E0E1` | Page background, subtle shading. (From original guide). |
**Secondary/Functional Palette (Observed in UI)**
| Role | Hex | Usage & Notes |
|------|-----|---------------|
| **Light Orange** | `#FFD182` | Hover states, secondary highlights, backgrounds. |
| **Light Lavender** | `#D2CEFD` | Tag backgrounds, subtle status indicators. |
| **Bright Green** | `#27AE60` | Success states, positive indicators, "go" signals. (e.g., "See Project" button). |
| **Light Blue** | `#DEECFF` / `#EEEFFF` | Filter backgrounds, inactive chip states, subtle section shading. |
**Important Note:** Use **Warm Orange (`#FF710F`)** as the primary action color, **not** the teal from the old guide. The green (`#27AE60`) is used sparingly for specific positive actions.

#### **2. Typography**

- **Family:** Clean, geometric sans-serif. **Inter** (as specified) is an excellent system font choice. Helvetica Neue or Calibre are also suitable.
- **Scale (Recommended for Web):**
  - **H1 / Page Title:** 32-40px, Bold (e.g., "DESIGN SPRINTS")
  - **H2 / Section Title:** 24-28px, Semi-Bold (e.g., "Design Sprints: Building Creative Capacity")
  - **H3 / Card Title:** 20-22px, Medium/Semi-Bold
  - **Body Text:** 16-18px, Regular (Line height: ~1.5)
  - **Small / Caption:** 14px, Regular or Light (e.g., dates, filters)
- **Style:** Maximal clarity. Use weight (Bold, Semi-Bold) for hierarchy, not italics.

#### **3. Layout & Grid**

- **Structure:** Use a **12-column grid** with generous gutters for web.
- **Spacing:** Ample white space is critical. Use a consistent spacing scale (e.g., 8px base unit).
- **Card Design:** Observed project cards are clean, image-led, with a clear hierarchy: Image > Title > Short description > Label/Action button.

#### **4. UI Component Guidelines**

- **Buttons:**
  - **Primary:** Background `#FF710F`, text white. Bold, medium weight.
  - **Secondary/Text:** Text `#FF710F` or `#27AE60`, transparent background, underlined or bold.
  - **Example:** "See Project" button uses green (`#27AE60`), which is a specific, positive call-to-action.
- **Filters/Tags:** (As seen in screenshot)
  - **Active:** Background `#FF710F`, text white. (e.g., "[Ongoing]", "[Manhattan]").
  - **Inactive/Default:** Background `#DEECFF` or `#EEEFFF`, text `#121212`. (e.g., "(Archive)", "(Albany)").
  - Style uses parentheses `( )` for inactive and brackets `[ ]` for active states.
- **Navigation & Headers:** Clean, minimal. Active page/section can be indicated with `#FF710F` color in text or an underline.
- **Lists & Updates:** (As seen in "What We're Working On")
  - Clear date (`#888888`) above bold title (`#121212`).
  - Separated by a thin rule (`#E1E0E1`).

#### **5. Imagery & Content**

- **Photography:** Dominant, high-quality, and authentic. Features **real people, community events, and physical spaces.** Avoid generic stock.
- **Storytelling:** Content is direct, project-focused, and impact-oriented. Uses clear headings and concise body text.

#### **6. Voice & Tone (For UI Text)**

- **Clear & Confident:** "See Project", "See All Updates", "Filter by Place".
- **Community-Focused & Institutional:** "Partnered with...", "Building Creative Capacity", "Wins Three Prizes".
- **Active & Direct:** Use active voice. Labels should be immediately understandable.

## UI Libraries

- Admin dashboard uses MUI components (Grid/Paper/Button). Public survey and landing are Tailwind-only; do not import MUI there.
- Lucide icons are functional only; no emojis.

## Key Flows

- Event Manager CRUD: frontend `frontend/src/pages/EventManager.jsx`; backend routes in `backend/app/routes.py` (installations endpoints).
- QR codes: link to `/survey?installationId={id}`; localhost QR works only on same network; production via Vercel/Cloud Run.
- Analytics Dashboard: KPIs and charts in `frontend/src/pages/Dashboard.jsx`; data via `/get-survey-responses`.

## Do/Do Not

- Do keep auth headers on every admin call; do not bypass token verification.
- Do keep JS/JSX; do not add TS or TS configs for this build.
- Do not mix MUI into Tailwind-only survey/landing pages.
- Do not reference `docs/archive/**` or `REFERENCEONLY-ComponetnsFromTypescript/**`.

## Source-of-Truth Docs

- Execution roadmap: `docs/handoff/Final-Polish-Security-and-Handoff-Plan.md`
- Deployment walkthrough: `docs/handoff/HANDOFF-SUMMARY-STABLE-RELEASE.md`
- Completion log: `docs/handoff/TODO-COMPLETION-SUMMARY.md`
- System design: `docs/architecture/Source-of-Truth-2025-12-20.md`
- Current priorities: `MAIN-TASKLIST` (root) and `HIGH-PRIORITY Closing Phase Written Deliverable Outline .md`

## Strict Rules

- No emojis or decorative icons in the codebase.
- Keep commits small and explicit; update handoff docs if behavior changes.

- Requirements:
  - Base URL must be the frontend host (not the API base).
  - installationId must match the Firestore document ID.

- Security:
  - Do not embed auth tokens in QR URLs.
  - Admin actions remain protected by Firebase auth and backend verification.

- UX & Validation:
  - If installationId is missing/invalid, show a clear error and block submission.
  - Log the installationId with each response for analytics.

- Testing:
  - Vercel deployment is a prerequisite for public QR code testing.
  - Verify survey loads and responses persist with the correct installationId.

- Maintenance:
 If routing or URLs change, update handoff docs and regenerate affected QR codes.

1. Admin creates installation in Event Manager → Firestore doc created with ID
2. QR code renders URL: {baseURL}/survey?installationId={id} **Be careful with the hybrid URL structure thst uses custom slug paths for survey**
3. Localhost limitation: QR codes on localhost:5173 only work on same local network
4. Production: Deploy to Vercel/Cloud Run for public QR scanning

Analytics Dashboard
KPI Calculation: frontend/src/pages/Dashboard.jsx:150-180 (useMemo hooks)
Charts: Chart.js with chartjs-plugin-datalabels for inline percentages
Filtering: filteredData updates when filters change, triggering chart re-render

Common Pitfalls

1. Survey Response Normalization Bug (FIXED)
Problem: responses = response_data.get('responses') was overwriting normalized checkbox arrays.
Solution: Line 64 of routes.py now preserves normalized data. DO NOT add this line back.

2. Firestore .add() Return Value

WRONG
doc_ref[1].id

CORRECT
update_time, doc_ref = db.collection('bugReports').add(data)
return doc_ref[0].id

1. Material UI vs Tailwind Mixing
Dashboard core pages: Use MUI <Grid>, <Paper>, <Button variant="contained">
Event Manager: Use Tailwind className="px-4 py-2 border border-vai-black"
Dashboard core pages: Use MUI <Grid>, <Paper>, <Button variant="contained">
Event Manager: Use Tailwind className="px-4 py-2 border border-vai-black"
Never import MUI into Survey/Landing pages (Tailwind-only zone)

2. Missing File Paths in Import Statements
After file renames, watch for broken imports:

WRONG (spaces removed from filenames)
import SurveyCardStack from './components/SurveyCardStack Component';

CORRECT
import SurveyCardStack from './components/SurveyCardStack';

#### Documentation Hierarchy

Primary: docs/handoff/Final-Polish-Security-and-Handoff-Plan.md (execution roadmap)
Reference: docs/architecture/Source-of-Truth-2025-12-20.md (detailed system design)
Handoff Docs:
docs/handoff/HANDOFF-SUMMARY-STABLE-RELEASE.md (deployment walkthrough)
docs/handoff/TODO-COMPLETION-SUMMARY.md (recent completion log)
MAIN-TASKLIST (root-level priority list)

DO NOT reference: docs/archive/**or REFERENCEONLY-ComponetnsFromTypescript/** (outdated)

## Current Priorities (MAIN-TASKLIST)

1. QR Code Functionality ✅ (Implemented)
2. Event Manager CRUD ✅ (Backend + Frontend wired)
3. Survey Questions → Firestore (API exists, frontend migration pending)
4. Spanish Translation (Deferred to next phase)
5. User Session Metrics (Skeleton needed, see MAIN-TASKLIST:80-108)
6. Search Bar for Admin Dashboard (Planned, not started)

#### When Making Changes

1. Security first: If touching auth/admin routes, verify token checks remain intact
2. Test both UIs: Changes to shared components may affect MUI and Tailwind pages differently
3. Check mobile: Public survey is mobile-first; always test on small viewports
4. Update docs: If behavior changes, update HANDOFF-SUMMARY-STABLE-RELEASE.md
5. No breaking changes: System is in final polish phase; prefer additive changes

#### Deployment Targets

Frontend: Vercel (auto-deploy from stable-handoff-release branch)
Backend: Google Cloud Run (manual deploy via gcloud run deploy)
Database: Firestore (production rules restrict write access to authenticated users)

#### Questions? Reference docs/handoff/Project-Close-Tasks-and-Handoff-Recommendations.md for stakeholder-friendly explanations of technical decisions

# STRICT RULE: NO USE OF EMOJIS OR DECORATIVE ICONS IN THE CODEBASE. MINIMAL USE OF FUNCTIONAL ICONS ONLY. AVOID ALL EMOJIS, USE MODERN ICONS IF NECESSARY FOR THOSE FUNCTIONAL UI UX ITEMS

#### Do/Do Not

1. Do keep auth headers on every admin call; do not bypass token verification.
2. Do keep JS/JSX; do not add TS or TS configs for this build.
3. Do not mix MUI into Tailwind-only survey/landing pages.
4. Do not reference docs/archive/**or REFERENCEONLY-ComponetnsFromTypescript/**.

#### Source-of-Truth Docs

- Execution roadmap: docs/handoff/Final-Polish-Security-and-Handoff-Plan.md
- Deployment walkthrough: docs/handoff/HANDOFF-SUMMARY-STABLE-RELEASE.md
- Completion log: docs/handoff/TODO-COMPLETION-SUMMARY.md
- System design: docs/architecture/Source-of-Truth-2025-12-20.md
- Current priorities: MAIN-TASKLIST (root) and HIGH-PRIORITY Closing Phase Written Deliverable Outline .md

#### Strict Rules

1. No emojis or decorative icons in the codebase.
2. Keep commits small and explicit; update handoff docs if behavior changes.
