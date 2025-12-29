I'm working on the VAI Data System Phase Two (Van Alen Institute Public Art Impact Measurement System). The codebase just underwent a major architectural enhancement implementing a dual URL routing system (slug-based + numeric ID routing). However, this has introduced several critical bugs that need immediate attention before final handoff.

## 🏗️ Recent Changes Context

The previous agent session implemented:
1. Dual routing system allowing installations to be accessed via:
   - Slug URLs: `vai.vercel.app/los-circulos`
   - Numeric ID URLs: `vai.vercel.app/survey?id=3`
2. Created comprehensive slug validation utilities in `frontend/src/utils/slugUtils.js`
3. Updated Survey.jsx, EventManager.jsx, App.jsx for dual routing
4. Added backend endpoints: `/installation-by-identifier/<identifier>` and `/check-slug/<slug>`
5. Full documentation in `docs/handoff/DUAL-ROUTING-ARCHITECTURE.md`

**Key Files Modified:**
- `frontend/src/pages/Survey.jsx` - Dual routing logic with canonical redirects
- `frontend/src/pages/EventManager.jsx` - Slug auto-generation and validation
- `frontend/src/App.jsx` - Added `/:installationSlug` route
- `backend/app/routes.py` - New endpoints for identifier lookup and slug checking
- `frontend/src/utils/slugUtils.js` - NEW FILE with validation utilities

## 🚨 Critical Issues to Fix

### Issue 1: SECURITY - Unauthenticated Dashboard Access
**Severity:** 🔴 CRITICAL

**Current Behavior:**
- Navigate to `http://localhost:5173/dashboard` in new incognito browser window
- Dashboard loads with fully functional sidebar
- Non-authenticated user can access: Settings, Profile, Profile Settings, Log Out options
- Chart components return 404 errors (expected without auth)
- **BUT sidebar navigation should not be accessible at all without authentication**

**Expected Behavior:**
- Unauthenticated users accessing `/dashboard` should redirect to `/login`
- All protected admin routes must check authentication before rendering
- Sidebar should not render until JWT token verified

**Investigation Starting Points:**
- Check `frontend/src/pages/Dashboard.jsx` for authentication checks
- Review `frontend/src/App.jsx` protected route configuration
- Verify JWT token validation in axios interceptor (`frontend/src/utils/apiClient.js`)
- Check if Firebase Auth state is properly initialized before rendering protected components

**Reference:** See `docs/handoff/DUAL-ROUTING-ARCHITECTURE.md` for security patterns and `.github/copilot-instructions.md` for authentication flow documentation.

---

### Issue 2: Survey App Broken - "Installation not Found" Error
**Severity:** 🔴 CRITICAL

**Current Behavior:**
- Accessing `http://localhost:5173/common-ground` shows: "Installation not Found; Return to Installation selection"
- Accessing `http://localhost:5173/los-circulos` shows same error
- Both installations exist in Firestore and were manually configured with slug fields
- This worked BEFORE dual routing implementation

**Expected Behavior:**
- Slug URLs should fetch installation data via `/installation-by-identifier/<slug>` endpoint
- Survey form should render with installation details
- Submissions should include both `installationId` and `installationSlug`

**Investigation Starting Points:**
- Check `frontend/src/pages/Survey.jsx` lines 35-68 (dual routing fetch logic)
- Verify Firestore installations have `slug` field populated correctly:
  - Common Ground: `slug: "common-ground"`, `numericId: "2"`
  - Los Circulos: `slug: "los-circulos"`, `numericId: "3"`
- Test backend endpoint directly: `curl http://localhost:5000/installation-by-identifier/common-ground`
- Check browser dev tools Network tab for 404 errors
- Verify `normalizeSlug()` function is correctly imported and used

**Debugging Steps:**
1. Add console.log in Survey.jsx to see what `installationSlug` param is extracted
2. Check if backend endpoint is actually called (Network tab)
3. Verify Firestore query in `routes.py` lines 288-312 is matching correctly
4. Test if numeric ID routing still works: `http://localhost:5173/survey?id=2`

---

### Issue 3: Performance - Excessive API Calls on Slug Input
**Severity:** 🟡 MEDIUM (Performance/UX concern)

**Current Behavior:**
- EventManager slug input field calls `/check-slug/<slug>` API on EVERY keystroke
- User types "los-circulos" → 12 API calls fired
- Many return 404 errors for partial slugs like "l", "lo", "los"
- Terminal logs flooded with error messages

**Impact Assessment Needed:**
- What is the performance cost on backend (Flask/Firestore)?
- Does this scale to hundreds of installations?
- Are 404 errors acceptable or should validation be client-side only?
- Is debouncing sufficient or should we rethink the approach?

**Potential Solutions:**
1. **Debounce API calls** - Wait 500ms after user stops typing before checking availability
2. **Client-side validation first** - Only call API if slug passes format validation
3. **Batch checking** - Check slug availability on form submission only (not real-time)
4. **Simplify architecture** - User's suggestion below

**Implementation Options:**
- Add lodash debounce to `handleSlugChange()` in EventManager.jsx
- Move validation to onBlur event instead of onChange
- Show "Checking availability..." message only after debounce delay

---

### Issue 4: ARCHITECTURAL RECONSIDERATION - Simplify with Redirects?
**Severity:** 🟢 DISCUSSION (User's alternative proposal)

**User's Suggestion:**
"Would it be easier to have a redirect URL in place instead of adding an entire new slug field? For example, keep the original `survey=?` that Firestore understands, and give users a printed paper with `.com/los-circulos` which redirects them to `survey?installationId=PmrUuEJJ6xszSIpjoGuS`"

**Trade-offs to Consider:**

**Current Dual System Pros:**
- Clean URLs in browser bar after redirect
- SEO benefits (slug URLs indexed by Google)
- Both identifiers stored for future flexibility
- Survey responses include both `installationId` and `installationSlug`

**Redirect-Only Approach Pros:**
- Much simpler implementation (no slug field in Firestore)
- No validation complexity or API overhead
- No risk of slug conflicts or reserved keywords
- Faster to implement before handoff deadline

**Redirect-Only Approach Cons:**
- Requires external URL shortener or redirect service (Bitly, Rebrandly)
- Breaks if shortener service fails
- Cannot customize URLs in-app (must use external tool)
- No slug-based analytics within VAI system

**Questions for User:**
1. Is SEO important for these survey pages?
2. Do stakeholders need ability to customize URLs in admin UI?
3. Is external dependency (URL shortener) acceptable?
4. What is priority: feature richness vs. simplicity/stability?

**If Reverting to Redirect-Only:**
1. Remove `/:installationSlug` route from App.jsx
2. Remove slug validation logic from EventManager.jsx
3. Remove `/check-slug` endpoint from routes.py
4. Keep Survey.jsx numeric ID routing only
5. Document use of external URL shortener (e.g., Bitly) in handoff docs

---

## 🔍 Priority Order

1. **IMMEDIATE (before any other work):** Fix Issue #2 (Survey app broken) - system is non-functional
2. **HIGH:** Fix Issue #1 (Security) - authentication bypass is critical vulnerability
3. **MEDIUM:** Address Issue #3 (API performance) - implement debouncing at minimum
4. **DISCUSSION:** Issue #4 (Architecture simplification) - needs user decision before proceeding

---

## 📂 Key Files to Review

**Authentication & Routing:**
- `frontend/src/App.jsx` - Route configuration and protected routes
- `frontend/src/utils/apiClient.js` - Axios interceptor with JWT token attachment
- `frontend/src/firebase.js` - Firebase Auth initialization
- `frontend/src/pages/LoginNew.jsx` - Authentication flow

**Dual Routing Implementation:**
- `frontend/src/pages/Survey.jsx` - Broken installation fetch logic (LINES 35-68)
- `frontend/src/utils/slugUtils.js` - Slug validation utilities
- `backend/app/routes.py` - `/installation-by-identifier` endpoint (LINES 288-312)
- `frontend/src/pages/EventManager.jsx` - Slug input with API calls (LINES 112-154)

**Documentation:**
- `docs/handoff/DUAL-ROUTING-ARCHITECTURE.md` - Full dual routing system documentation
- `.github/copilot-instructions.md` - System architecture and security patterns

---

## 🛠️ Environment Context

**Stack:**
- Frontend: React 18 + Vite, React Router v6, Tailwind CSS + Material UI
- Backend: Flask/Python, Firebase Admin SDK
- Database: Firestore
- Auth: Firebase Auth with JWT tokens

**Current Firestore Installations:**
- Common Ground: `id: "K0JiR2SXgAk0iLCwGKr9"`, `numericId: "2"`, `slug: "common-ground"`
- Los Circulos: `id: "[auto-generated]"`, `numericId: "3"`, `slug: "los-circulos"`
- Breathing Pavilion: `id: "8mKV7gRM8mUNQUtAUDgn"`, `numericId: "1"`, `slug: "breathing-pavilion"`, `status: "Closed"`

**Test URLs:**
- Slug: `http://localhost:5173/common-ground` (currently broken)
- Numeric: `http://localhost:5173/survey?id=2` (may still work?)
- Dashboard: `http://localhost:5173/dashboard` (security issue)

---

## 🎯 Success Criteria

After fixes:
- ✅ Survey app works for both slug and numeric ID URLs
- ✅ Unauthenticated users redirected from `/dashboard` to `/login`
- ✅ API calls debounced to <3 requests per slug input
- ✅ User decision made on architectural approach (dual system vs. redirect-only)
- ✅ All changes tested on localhost before pushing to handoff branch

---

## 📋 Additional Context

**Deployment Target:**
- New branch for handoff: `stable-handoff-release` (or similar)
- Frontend: Vercel deployment
- Backend: Google Cloud Run

**Stakeholder Notes:**
- System is in final polish phase before handoff to next dev team
- UAT testing scheduled after these fixes
- Non-technical stakeholders will use admin UI (Event Manager) to create installations
- QR codes printed on-site will use slug URLs for user surveys
- We need the Closing Phase Deliverable as soon as possible with a deployable link to sign up and browse the system
- Junior devs in next team will only be reviewing the code weeks from now, so deadline on the deliverable + deployment is paramound. Minor code quality improvements or messiness can be deferred for now.
- Agentic LLM work is acceptable but should be carefully reviewed for correctness.
- Agentic LLM relsted files, where a prompt is mentioned, a specific LLM agent is explictly mentioned to handle a task, (e.g, REFERENCE-SonnetPromptForNewAgent.md) should be removed prior to pushing changes to any and all branches. Documentation that uses excessive emojis should be cleaned up to a more professional tone (you may reference any of our used dependencies's documentation for style guidance)
- Bugs and Issues tracking are lacking and minimum viable notes should be prepared and included in handoff documentation. Focus on signfiicant issues, especially if they involve bugs that carry over from the original main branch (the forked branch starting point for phase two)

**Concern:**
Be goal-oriented and only make precise, targeted fixes rather than expansive refactoring.

---

Please start by diagnosing Issue #2 (Survey app broken) as highest priority, then move to Issue #1 (security). For Issue #3, implement basic debouncing. For Issue #4, wait for my decision after you provide analysis of trade-offs.
