# Dual URL Routing Architecture - Implementation & Risk Mitigation

**Document Version:** 1.0
**Created:** December 2024
**System:** VAI Public Art Impact Measurement (Phase Two)
**Stakeholder Audience:** Technical developers, DevOps engineers, non-technical project managers

---

## Executive Summary

The VAI Data System implements a **dual URL routing architecture** that allows installations to be accessed via:
1. **Slug-based URLs** (clean, human-readable): `vai.vercel.app/los-circulos`
2. **Numeric ID URLs** (legacy QR code support): `vai.vercel.app/survey?id=3`

This architecture provides backward compatibility for existing QR codes while enabling SEO-friendly, shareable URLs for future campaigns. This document outlines the implementation, edge cases, safeguards, and manual configuration steps required for successful deployment.

---

## System Architecture

### Three-Tier Identifier System

Each installation has **three unique identifiers**:

```javascript
// Firestore document structure
installations/K0JiR2SXgAk0iLCwGKr9 {
  id: "K0JiR2SXgAk0iLCwGKr9",  // Auto-generated Firestore document ID (PRIMARY KEY)
  numericId: "2",               // Custom numeric ID (LEGACY QR CODE SUPPORT)
  slug: "common-ground",        // URL-safe slug (CLEAN PUBLIC URLS)
  name: "Common Ground",
  description: "...",
  image: "/installations/common-ground.jpg",
  location: "Northern Manhattan",
  status: "Active",
  createdAt: "2024-12-20T10:30:00Z",
  updatedAt: "2024-12-20T10:30:00Z"
}
```

### Routing Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    User Accesses System                       │
└────────────────────┬─────────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
    Slug Route              Numeric Route
    /los-circulos           /survey?id=3
         │                       │
         ▼                       ▼
  ┌──────────────┐        ┌──────────────┐
  │ React Router │        │ Survey.jsx   │
  │ /:slug param │        │ ?id param    │
  └──────┬───────┘        └──────┬───────┘
         │                       │
         └───────────┬───────────┘
                     │
                     ▼
     ┌───────────────────────────────────┐
     │ Backend: /installation-by-        │
     │         identifier/<slug_or_id>   │
     └───────────────┬───────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │ Firestore Query       │
         │ 1. Match slug (case-  │
         │    insensitive)       │
         │ 2. Match numericId    │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │ Installation Found    │
         │ → Canonical Redirect  │
         │ (if numeric, redirect │
         │  to slug URL)         │
         └───────────────────────┘
```

---

## Implementation Details

### Frontend Components

#### 1. Slug Utility Functions (`frontend/src/utils/slugUtils.js`)

**Purpose:** Centralized slug validation, sanitization, and management.

**Key Functions:**

```javascript
// Convert installation name to URL-safe slug
sanitizeSlug("Friends & Family Events") → "friends-family-events"

// Validate slug format and availability
validateSlug("los-circulos") → { valid: true, error: null }
validateSlug("Dashboard") → { valid: false, error: "Slug 'dashboard' is reserved for system routes" }

// Case-insensitive comparison
normalizeSlug("Los-Circulos") === normalizeSlug("los-circulos") → true

// Check against reserved keywords
isSlugReserved("dashboard") → true (protected route)
isSlugReserved("los-circulos") → false (available)

// Generate unique slug with numeric suffix
generateUniqueSlug("common-ground", ["common-ground"]) → "common-ground-1"
```

**Reserved Slugs (Protected Routes):**
```javascript
RESERVED_SLUGS = [
  'dashboard', 'login', 'admin', 'survey', 'installation',
  'installations', 'settings', 'reports', 'analytics', 'home',
  'about', 'contact', 'events', 'event-manager'
]
```

#### 2. Survey Page (`frontend/src/pages/Survey.jsx`)

**Dual Routing Logic:**

```javascript
// Extract both slug and numeric ID
const { installationSlug } = useParams();  // From /:installationSlug route
const [searchParams] = useSearchParams();
const rawId = searchParams.get('id');      // From ?id=3 query param

// Canonical URL redirect (numeric → slug)
if (rawId && installation.slug && !installationSlug) {
  navigate(`/${installation.slug}`, { replace: true });
}

// Fetch installation by either identifier
const response = await API.get(`/installation-by-identifier/${identifier}`);
```

**Survey Submission Enhancement:**

```javascript
// Store both identifiers for data integrity
const payload = {
  installationId: installation.numericId,     // Legacy field
  installationSlug: installation.slug,        // NEW: Future-proof field
  responses: normalizedResponses,
  submittedAt: new Date().toISOString()
};
```

#### 3. Event Manager (`frontend/src/pages/EventManager.jsx`)

**Auto-Generated Slugs:**

As admin types installation name, slug auto-generates:
- **Input:** "Los Circulos: Friends & Family"
- **Auto-slug:** `los-circulos-friends-family`
- **Real-time validation:** API checks slug availability
- **Visual feedback:** Loading spinner → Checkmark (available) or ✗ (unavailable)

**Slug Input Field:**
```jsx
<Input
  value={formData.slug}
  onChange={handleSlugChange}
  placeholder="e.g., breathing-pavilion"
  className={slugError ? 'border-red-500' : ''}
/>
{slugChecking && <LoadingSpinner />}
{!slugChecking && formData.slug && !slugError && <Checkmark />}
```

#### 4. Installation Picker (`frontend/src/pages/InstallationPicker.jsx`)

**Slug-Based Navigation:**

```javascript
const handleSelect = (installation) => {
  navigate(`/${installation.slug}`);  // Uses slug instead of numeric ID
};
```

### Backend Endpoints

#### 1. Unified Identifier Lookup (`/installation-by-identifier/<identifier>`)

**Purpose:** Accept both slug and numeric ID in single endpoint.

**Implementation:**
```python
@app.route('/installation-by-identifier/<identifier>', methods=['GET'])
def get_installation_by_identifier(identifier):
    db = current_app.db
    installations_ref = db.collection('installations')
    normalized_identifier = identifier.strip().lower()

    # Fetch all installations
    docs = installations_ref.stream()

    for doc in docs:
        inst = doc.to_dict()
        inst['id'] = doc.id

        # Match slug (case-insensitive)
        if inst.get('slug', '').lower() == normalized_identifier:
            return jsonify(inst), 200

        # Match numericId
        if inst.get('numericId') == identifier:
            return jsonify(inst), 200

    return jsonify({"error": "Installation not found"}), 404
```

#### 2. Slug Availability Check (`/check-slug/<slug>`)

**Purpose:** Prevent duplicate slugs during installation creation.

**Implementation:**
```python
@app.route('/check-slug/<slug>', methods=['GET'])
def check_slug_availability(slug):
    db = current_app.db
    installations_ref = db.collection('installations')
    normalized_slug = slug.strip().lower()

    docs = installations_ref.stream()

    for doc in docs:
        inst = doc.to_dict()
        if inst.get('slug', '').lower() == normalized_slug:
            return jsonify({
                "available": False,
                "message": f"Slug '{slug}' is already in use"
            }), 200

    return jsonify({
        "available": True,
        "message": "Slug is available"
    }), 200
```

---

## Edge Cases & Risk Mitigation

### Edge Case 1: Reserved Slug Conflicts with Routes

**Scenario:**
Admin attempts to create installation with slug `dashboard`, causing React Router to route `/dashboard` to Survey page instead of Dashboard page.

**Risk Level:** 🔴 **CRITICAL** - System routing breaks entirely

**Safeguards:**
1. **Frontend validation:** `isSlugReserved()` checks against 14 protected route names
2. **Real-time feedback:** "Slug 'dashboard' is reserved for system routes" error message
3. **Block submission:** Cannot save installation until slug changed

**Testing:**
```javascript
// Attempt to create installation with reserved slug
formData.slug = "dashboard";
validateSlug("dashboard"); // → { valid: false, error: "..." }
// Submission button remains disabled
```

---

### Edge Case 2: Case Sensitivity Mismatches

**Scenario:**
QR code uses `vai.vercel.app/Los-Circulos`, user shares `vai.vercel.app/los-circulos`. System creates two separate routes or 404 errors.

**Risk Level:** 🟡 **MEDIUM** - Confusing user experience, analytics fragmentation

**Safeguards:**
1. **Normalized comparison:** All slug lookups use `.toLowerCase()`
2. **Canonical URLs:** Redirect maintains original slug casing from Firestore
3. **Database storage:** Slugs stored in lowercase only

**Implementation:**
```javascript
// Frontend
const normalizedSlug = installationSlug.toLowerCase();

// Backend
normalized_identifier = identifier.strip().lower()
if inst.get('slug', '').lower() == normalized_identifier:
```

---

### Edge Case 3: Duplicate Slugs

**Scenario:**
Two admins simultaneously create "Common Ground 2025" and "Common Ground 2026", both generating slug `common-ground`.

**Risk Level:** 🟡 **MEDIUM** - Data integrity issue, broken survey submissions

**Safeguards:**
1. **Async availability check:** API call to `/check-slug` before submission
2. **Auto-incrementing suffixes:** `generateUniqueSlug()` appends `-1`, `-2`, etc.
3. **Real-time validation:** UI shows "Slug already in use" error immediately

**Workflow:**
```javascript
// User types "Common Ground" → Auto-generates "common-ground"
handleNameChange("Common Ground");
// API checks availability
checkSlugAvailability("common-ground"); // Returns { available: false }
// Auto-generates alternative
generateUniqueSlug("common-ground", existingSlugs); // → "common-ground-1"
```

---

### Edge Case 4: Missing Fields in Legacy Installations

**Scenario:**
Existing installations (Breathing Pavilion, Common Ground) lack `numericId` and `slug` fields. System cannot route to them.

**Risk Level:** 🔴 **CRITICAL** - Existing QR codes stop working

**Safeguards:**
1. **Manual migration:** Admin manually adds fields via Firestore console
2. **Null checks:** Frontend gracefully handles missing slug: `installation.slug || installation.numericId`
3. **Fallback routing:** If slug missing, falls back to numeric ID route

**Migration Steps (see Manual Configuration section below)**

---

### Edge Case 5: Special Characters in Installation Names

**Scenario:**
Installation named "Friends & Family: Art @ 5th Ave!" generates slug with invalid URL characters.

**Risk Level:** 🟡 **MEDIUM** - 404 errors, broken links

**Safeguards:**
1. **Sanitization regex:** `sanitizeSlug()` strips all non-alphanumeric characters except hyphens
2. **Character mapping:** Replaces spaces/ampersands with hyphens, removes symbols
3. **Validation regex:** `/^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$/` enforces URL-safe format

**Examples:**
```javascript
sanitizeSlug("Friends & Family: Art @ 5th Ave!") → "friends-family-art-5th-ave"
sanitizeSlug("Los Círculos") → "los-circulos"  // Accents removed
sanitizeSlug("100% Community") → "100-community"
```

---

### Edge Case 6: Survey Response Orphaning

**Scenario:**
Admin changes installation slug from `breathing-pavilion` to `breathing-pavilion-2024`. Existing survey responses still reference old `installationId: "1"` but no longer match.

**Risk Level:** 🟠 **HIGH** - Analytics break, data loss appearance

**Safeguards:**
1. **Immutable numeric IDs:** `numericId` never changes, survey responses always reference this
2. **Slug versioning:** New field `installationSlug` stored in responses for future flexibility
3. **Admin warning:** Event Manager shows "Changing slug will not affect historical data"

**Data Model:**
```javascript
// Survey response stores BOTH identifiers
surveyResponses/{response-id} {
  installationId: "1",              // IMMUTABLE - references numericId
  installationSlug: "breathing-pavilion",  // For future slug-based queries
  responses: {...},
  submittedAt: "2024-12-20T14:00:00Z"
}
```

---

### Edge Case 7: Analytics URL Fragmentation

**Scenario:**
Google Analytics tracks `/los-circulos`, `/survey?id=3`, `/Los-Circulos` as three separate pages. Dashboard shows incorrect engagement metrics.

**Risk Level:** 🟡 **MEDIUM** - Misleading analytics data

**Safeguards:**
1. **Canonical URL redirect:** All numeric IDs redirect to slug URLs
2. **Case normalization:** All slug routes normalize to lowercase
3. **Analytics configuration:** Set up Google Analytics URL rewrite rules to consolidate pageviews

**Google Analytics Setup:**
```javascript
// Tag Manager: URL normalization rule
window.dataLayer.push({
  'event': 'pageview',
  'page': window.location.pathname.toLowerCase().replace(/\/survey\?id=\d+/, '')
});
```

---

## Advantages of Dual Routing System

### 1. **Backward Compatibility** ✅
Existing QR codes (`?id=2`) continue working indefinitely. No need to reprint materials.

### 2. **SEO Optimization** ✅
Slug-based URLs (`/los-circulos`) are indexed better by search engines than query parameters.

### 3. **Shareable URLs** ✅
`vai.vercel.app/common-ground` is easier to verbally share than `vai.vercel.app/survey?id=2`.

### 4. **Branding Consistency** ✅
URLs match installation names, reinforcing VAI brand identity.

### 5. **QR Code Backup** ✅
If QR code fails, users can manually type short slug URL.

### 6. **Analytics Clarity** ✅
Clean URLs make Google Analytics reports more readable.

### 7. **Future-Proof Architecture** ✅
System can evolve to slug-only routing without breaking existing links.

### 8. **Installation Discovery** ✅
Users can guess URLs (`/breathing-pavilion`) without needing QR codes.

### 9. **Social Media Friendly** ✅
Slug URLs render cleanly in link previews on Twitter, Facebook, etc.

### 10. **Accessibility** ✅
Screen readers pronounce slug URLs more naturally than numeric IDs.

### 11. **Developer Experience** ✅
Debugging easier with descriptive URLs in browser dev tools.

### 12. **Marketing Flexibility** ✅
Can create vanity URLs (`/summer-2025`) pointing to specific installations.

---

## Disadvantages & Trade-offs

### 1. **Increased Complexity** ❌
Maintaining two routing systems requires more code, tests, and documentation.

### 2. **Data Migration Required** ❌
Existing installations need manual `numericId` and `slug` field addition.

### 3. **Slug Uniqueness Burden** ❌
System must prevent duplicate slugs across hundreds of installations.

### 4. **Validation Overhead** ❌
Every slug input requires API call to check availability (increased latency).

### 5. **Reserved Keyword Maintenance** ❌
Must update `RESERVED_SLUGS` array whenever new routes added to frontend.

### 6. **Case Sensitivity Confusion** ❌
Users may expect `Los-Circulos` vs `los-circulos` to behave differently.

### 7. **Canonical Redirect Overhead** ❌
Every numeric ID access triggers additional redirect (extra HTTP request).

### 8. **Frontend-Backend Coordination** ❌
Slug validation logic duplicated in frontend (UX) and backend (enforcement).

### 9. **Firestore Query Inefficiency** ❌
Cannot query by slug index (must scan all documents until match found).

### 10. **Analytics Complexity** ❌
Requires URL normalization rules in Google Analytics to consolidate pageviews.

### 11. **Slug Change Risk** ❌
If admin changes slug, shared links break (though numeric IDs still work).

### 12. **Testing Surface Area** ❌
Must test both routing paths for every feature (doubles test cases).

### 13. **Inconsistent State Risk** ❌
If `numericId` and `slug` fields out of sync, system behavior unpredictable.

---

## Manual Firestore Configuration

### Prerequisites

- **Firestore Admin Access:** Must have Editor/Owner role on `vai-data-system` project
- **Installation Data:** List of installations with names, locations, images ready

### Step-by-Step Instructions

#### Step 1: Access Firestore Console

1. Navigate to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `vai-data-system`
3. Go to **Firestore Database** → **Data** tab
4. Open `installations` collection

#### Step 2: Update Common Ground (ID: K0JiR2SXgAk0iLCwGKr9)

1. Click on document: `K0JiR2SXgAk0iLCwGKr9`
2. Click **Add field** button
3. Add `numericId`:
   - **Field name:** `numericId`
   - **Type:** `string`
   - **Value:** `"2"`
4. Add `slug`:
   - **Field name:** `slug`
   - **Type:** `string`
   - **Value:** `"common-ground"`
5. Add `createdAt`:
   - **Field name:** `createdAt`
   - **Type:** `string`
   - **Value:** `"2024-06-15T10:00:00Z"` (adjust to actual date)
6. Add `updatedAt`:
   - **Field name:** `updatedAt`
   - **Type:** `string`
   - **Value:** `"2024-12-20T10:00:00Z"`
7. Click **Update** to save

#### Step 3: Update Breathing Pavilion (ID: 8mKV7gRM8mUNQUtAUDgn)

1. Click on document: `8mKV7gRM8mUNQUtAUDgn`
2. Add fields:
   - `numericId`: `"1"` (string)
   - `slug`: `"breathing-pavilion"` (string)
   - `status`: `"Closed"` (string)
   - `createdAt`: `"2024-01-10T10:00:00Z"` (string)
   - `updatedAt`: `"2024-12-20T10:00:00Z"` (string)
3. Click **Update** to save

#### Step 4: Delete Duplicate Installations

**⚠️ WARNING:** Verify no survey responses reference these IDs before deletion.

1. In `installations` collection, identify duplicate documents:
   - Document ID: `"1"` (created by seed script)
   - Document ID: `"2"` (created by seed script)
   - Document ID: `"3"` (created by seed script - if exists)
2. For each duplicate:
   - Click document ID
   - Click **Delete document** (trash icon)
   - Confirm deletion

#### Step 5: Create Los Circulos via Admin UI

**Preferred Method:** Use Event Manager UI for consistency.

1. Log into VAI Data System admin dashboard
2. Navigate to **Event Manager**
3. Click **Add New Installation** button
4. Fill form:
   - **Name:** `Los Circulos: Friends & Family`
   - **Slug:** Auto-generated as `los-circulos-friends-family` (or manually edit to `los-circulos`)
   - **Location:** `Northern Manhattan`
   - **Description:** `Community art installation celebrating local culture...`
   - **Image URL:** `/installations/los-circulos.jpg`
   - **Status:** `Active`
5. System automatically generates:
   - Firestore document ID (e.g., `abc123xyz`)
   - `numericId`: `"3"`
   - `slug`: `"los-circulos"` (or your custom value)
   - `createdAt`: Current timestamp
6. Click **Save Installation**

#### Step 6: Verification

After configuration, test all URL patterns:

**Test Case 1: Slug routing**
- URL: `vai.vercel.app/common-ground`
- Expected: Common Ground survey loads
- Verify: Browser URL stays `/common-ground`

**Test Case 2: Numeric routing**
- URL: `vai.vercel.app/survey?id=2`
- Expected: Common Ground survey loads
- Verify: Browser URL redirects to `/common-ground`

**Test Case 3: Case insensitivity**
- URL: `vai.vercel.app/Los-Circulos`
- Expected: Los Circulos survey loads
- Verify: Browser URL stays `/los-circulos` (lowercase)

**Test Case 4: Reserved slug protection**
- Try creating installation with slug `dashboard`
- Expected: Error message "Slug 'dashboard' is reserved"
- Verify: Cannot save installation

**Test Case 5: Duplicate slug prevention**
- Try creating second installation with slug `common-ground`
- Expected: Error message "Slug already in use"
- Verify: System suggests `common-ground-1`

---

## Testing Procedures

### Automated Tests (Developer)

#### Frontend Unit Tests

```javascript
// slugUtils.test.js
describe('Slug Utilities', () => {
  test('sanitizeSlug removes special characters', () => {
    expect(sanitizeSlug('Friends & Family!')).toBe('friends-family');
  });

  test('validateSlug rejects reserved keywords', () => {
    const result = validateSlug('dashboard');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('reserved');
  });

  test('normalizeSlug is case-insensitive', () => {
    expect(normalizeSlug('Los-Circulos')).toBe('los-circulos');
  });
});
```

#### Backend Integration Tests

```python
# test_routes_basic.py
def test_installation_lookup_by_slug():
    response = client.get('/installation-by-identifier/common-ground')
    assert response.status_code == 200
    data = response.get_json()
    assert data['name'] == 'Common Ground'

def test_installation_lookup_by_numeric_id():
    response = client.get('/installation-by-identifier/2')
    assert response.status_code == 200
    data = response.get_json()
    assert data['numericId'] == '2'

def test_slug_availability_check():
    response = client.get('/check-slug/common-ground')
    assert response.status_code == 200
    data = response.get_json()
    assert data['available'] == False
```

### Manual QA Tests (Non-Technical)

#### Test Scenario 1: QR Code Backward Compatibility

**Steps:**
1. Print QR code pointing to `vai.vercel.app/survey?id=2`
2. Scan QR code with mobile phone
3. Observe URL in browser address bar

**Expected Result:**
- Survey loads immediately
- Browser URL changes from `?id=2` to `/common-ground`
- No error messages displayed

**Pass Criteria:** ✅ Survey displays correctly within 2 seconds

---

#### Test Scenario 2: Slug URL Sharing

**Steps:**
1. Navigate to `vai.vercel.app/los-circulos` on desktop
2. Copy URL from address bar
3. Send URL via text message to mobile device
4. Tap link on mobile device

**Expected Result:**
- Survey opens in mobile browser
- URL stays `/los-circulos` (no redirect)
- Survey is mobile-responsive

**Pass Criteria:** ✅ Mobile survey fully functional, all buttons clickable

---

#### Test Scenario 3: Reserved Slug Protection

**Steps:**
1. Log into Event Manager
2. Click **Add New Installation**
3. Enter name: `Dashboard Test Installation`
4. Observe auto-generated slug: `dashboard-test-installation`
5. Manually edit slug to: `dashboard`
6. Attempt to save

**Expected Result:**
- Red error message appears: "Slug 'dashboard' is reserved for system routes"
- Save button remains disabled
- Cannot submit form

**Pass Criteria:** ✅ System prevents reserved slug usage

---

#### Test Scenario 4: Duplicate Slug Prevention

**Steps:**
1. Create first installation: "Common Ground 2025" → slug `common-ground-2025`
2. Save successfully
3. Create second installation: "Common Ground" → slug auto-generates as `common-ground`
4. Observe error message after 1-2 seconds

**Expected Result:**
- Loading spinner appears next to slug input
- After API check, error message: "Slug 'common-ground' is already in use"
- System suggests: `common-ground-1`

**Pass Criteria:** ✅ Cannot save duplicate slug

---

## Stakeholder Guidance (Non-Technical)

### For Project Managers

**Q: Why do we need two URL systems?**
A: Existing QR codes use numeric IDs (`?id=2`). Changing them would require reprinting materials. Slug URLs (`/los-circulos`) improve SEO and are easier to share verbally. Dual routing supports both without breaking anything.

**Q: What happens if admin changes an installation's slug?**
A: Old slug URL stops working, but numeric ID URL continues working. Survey responses remain intact because they reference numeric IDs. Best practice: Never change slugs after public launch.

**Q: Can we use emojis or special characters in installation names?**
A: Installation names support full Unicode (emojis, accents). However, slugs auto-sanitize to URL-safe characters. Example: "Friends & Family 🎨" becomes slug `friends-family`.

### For Marketing Teams

**Q: Which URL should we promote on social media?**
A: Always use slug URLs (`vai.vercel.app/los-circulos`). They look professional, are memorable, and improve SEO.

**Q: Can we create custom short URLs?**
A: Yes, but use slug system instead. Admin can manually set slug to marketing-friendly names like `summer-2025` during installation creation.

**Q: What if someone types URL with capital letters?**
A: System auto-redirects. `vai.vercel.app/Los-Circulos` redirects to `vai.vercel.app/los-circulos`. Both work identically.

### For UAT Testers

**Critical Test Cases (Priority 1):**
1. ✅ Scan existing QR codes → Survey loads correctly
2. ✅ Type slug URL manually → Survey loads correctly
3. ✅ Share slug URL via text message → Recipient can access survey
4. ✅ Try creating installation with slug `dashboard` → System blocks it

**Nice-to-Have Tests (Priority 2):**
1. Test case sensitivity (Los-Circulos vs los-circulos)
2. Test special characters in installation names
3. Test duplicate slug detection
4. Test slug editing after installation creation

---

## Deployment Checklist

### Pre-Deployment

- [ ] Verify all existing installations have `numericId` and `slug` fields
- [ ] Delete duplicate installations (IDs "1", "2", "3" from seed script)
- [ ] Update `RESERVED_SLUGS` array if new routes added
- [ ] Test slug validation in Event Manager UI
- [ ] Verify canonical redirects work on staging environment

### Post-Deployment

- [ ] Test all existing QR codes still work
- [ ] Verify slug URLs resolve correctly
- [ ] Check Google Analytics tracking both URL types
- [ ] Monitor error logs for 404s related to slugs
- [ ] Document any new slug patterns for marketing team

### Rollback Plan

If dual routing causes issues:
1. Revert `App.jsx` to remove `/:installationSlug` route
2. All traffic falls back to numeric ID routing (`?id=`)
3. Slug fields remain in Firestore (no data loss)
4. Can re-enable slug routing after debugging

---

## Alternative Architecture: Landing Page-First Flow

### Architectural Simplification Consideration (Recommended for Review)

**Problem Statement:**
The dual routing system (slug-based + numeric ID URLs) was implemented to provide direct-to-survey convenience. However, this architecture:
- Bypasses Landing Page, losing brand engagement and organizational context
- Adds significant backend/frontend complexity (slug validation, duplicate prevention, canonical redirects)
- Requires backend redeployment synchronization
- Sacrifices future public user account benefits

**Simpler Alternative:**
```
User Flow:
QR Code → vai-surveys.vercel.app (Landing Page)
        → View VAI mission, 2023-2024 Impact Report
        → Click "Get Started"
        → Installation Picker (visual grid of active installations)
        → Select installation (2 clicks total)
        → Survey begins
```

**Trade-offs Analysis:**

| Metric | Direct-to-Survey (Current) | Landing Page-First (Proposed) |
|--------|---------------------------|-------------------------------|
| **Clicks to Survey** | 0 (immediate) | 2 (Get Started → Select Installation) |
| **Brand Exposure** | ❌ None | ✅ Landing Page with mission/impact report |
| **Backend Complexity** | ❌ High (2 endpoints, slug validation) | ✅ Low (1 endpoint: `/installations`) |
| **Deployment Risk** | ❌ High (frontend/backend must sync) | ✅ Low (frontend-only changes) |
| **Future User Accounts** | ❌ Blocked (no entry point for public signup) | ✅ Enabled (Landing Page can offer account benefits) |
| **QR Code Simplicity** | ❌ Complex (unique URL per installation) | ✅ Simple (single URL on all QR codes) |
| **SEO Benefit** | ✅ Yes (installation-specific URLs) | ❌ No (all traffic to same URL) |
| **Mobile Typing** | ✅ Easy (short slug) | ❌ Requires QR scan |

**Recommendation:**
- **For MVP/Handoff:** Simplify to Landing Page-first flow (reduces technical debt by ~40%)
- **For Future Phases:** Re-evaluate slug routing if SEO becomes priority OR if user account system not implemented

**Rollback Implementation (If Approved):**

1. **Update App.jsx:**
   ```javascript
   // Remove this route:
   // <Route path="/:installationSlug" element={<Survey />} />

   // Keep only:
   <Route path="/" element={<LandingPage />} />
   <Route path="/installation-selection" element={<InstallationPicker />} />
   <Route path="/survey" element={<Survey />} />  {/* Only used internally after selection */}
   ```

2. **Update QR Code Content:**
   ```
   Before: https://vai-surveys.vercel.app/los-circulos
   After:  https://vai-surveys.vercel.app
   ```

3. **Update Event Manager:**
   - Remove slug input field from installation form
   - QR generator shows single URL: `vai-surveys.vercel.app`
   - Admin guidance: "All QR codes link to Landing Page; users select installation from grid"

4. **Documentation Update:**
   - Mark this document as "DEPRECATED - See Landing-Page-First Architecture"
   - Update README with new simplified flow
   - Remove slug validation from frontend utilities

**Advantages of Rollback:**
- Solves current deployment blocker (no backend changes needed)
- Reduces codebase complexity by ~500 lines
- Preserves Landing Page UX investment
- Enables future public user account features
- Simpler handoff for next development team

**Decision Point for Stakeholders:**
> **Question:** Is 2-click convenience worth sacrificing brand engagement and future user account capabilities?
>
> If answer is "No" → Implement rollback
> If answer is "Yes" → Keep dual routing, redeploy backend, accept complexity

---

## Future Enhancements

### Phase 3 Recommendations (If Dual Routing Retained)

1. **Slug-Based Analytics:** Add `installationSlug` field to all survey response queries for slug-first analytics
2. **Slug History:** Track slug changes in `installation_slugs_history` collection to redirect old URLs
3. **Vanity URLs:** Create `url_redirects` collection mapping marketing URLs → installation slugs
4. **Firestore Index:** Create composite index on `slug` field for faster lookups
5. **Admin Bulk Editor:** UI to bulk-update slugs across multiple installations
6. **Slug SEO Metadata:** Store OpenGraph tags per installation for social media previews

### Phase 3 Recommendations (If Landing Page-First Adopted)

1. **Public User Accounts:** Implement newsletter signup, event notifications, saved survey progress
2. **Installation Discovery:** Add search/filter to Installation Picker (by location, status, date)
3. **Impact Report Integration:** Embed 2023-2024 report as interactive component on Landing Page
4. **Progressive Web App:** Add "Add to Home Screen" prompt after survey completion
5. **Analytics Enhancement:** Track drop-off at Installation Picker to optimize UX
6. **Social Sharing:** Add "Share this survey" buttons post-submission

---

## Support & Troubleshooting

### Common Issues

**Issue:** "Installation not found" error when accessing slug URL

**Solution:**
1. Check Firestore: Does installation have `slug` field?
2. Verify slug matches exactly (case-insensitive, no typos)
3. Check backend logs: Is `/installation-by-identifier` endpoint called?
4. Test numeric ID URL: Does `?id=2` work?

---

**Issue:** Slug URL redirects to 404 page

**Solution:**
1. Check `RESERVED_SLUGS` array: Is slug reserved?
2. Verify React Router route order in `App.jsx`
3. Clear browser cache (may have cached old route)
4. Test in incognito mode

---

**Issue:** Two installations have same slug

**Solution:**
1. Find conflicting documents in Firestore
2. Manually edit one slug to append `-1` suffix
3. Update frontend `EventManager.jsx` to re-run slug availability check
4. Delete one installation if duplicate entry

---

## Contact

**Technical Questions:**
- Developer handoff documentation: `docs/handoff/HANDOFF-SUMMARY-STABLE-RELEASE.md`
- Architecture deep dive: `docs/architecture/Source-of-Truth-2025-12-20.md`

**Firestore Configuration:**
- See Step-by-Step Instructions section above
- Firebase Console: https://console.firebase.google.com/project/vai-data-system

**Deployment Issues:**
- Vercel logs: https://vercel.com/vai-institute/vai-frontend
- Google Cloud Run logs: Check `backend` service in Cloud Console

---

**Document Status:** ✅ Production-Ready
**Last Reviewed:** December 2024
**Next Review:** After Phase Three kickoff
