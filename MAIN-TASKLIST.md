<!-- Immediate Next Steps (Priority Order) -->

## HIGH PRIORITY

# QR CODE FUNCTIONALITY FOR DEPLOYMENT (currently only localhost on same network works) (IMPLEMENTED, NEEDS TESTING ON A DEPLOYMENT LINK)

# EVENT MANAGER CRUD OPERATIONS (DONE)

# UI ENHANCEMENTS FOR BRAND CONSISTENCY (PLANNED)

# SPANISH TRANSLATION FOR SURVEY APP (DEFFERED)

# SURVEY QUESTIONS STACKED CARD UI UX SUCCESFULY HANDLES LIKERT-SCALE AND OPEN-ENDED FREE TEXT INPUT QUESTIONS (currently only multiple choice is available, but the original UI UX had 5 different question formats) (DONE)

# WORKING DEPLOYMENT LINK FOR STAKEHOLDERS TO DO UAT (IN PROFRESS)

# FINALIZED DOCUMENTATION WITH UP TO DATE INFORMATION TO INCORPORATE INTO THE CLOSING PHASE WRITTEN DELIVERABLE (PLANNED - CRITICAL TASK)

# ORGANIZATION OF CODEBASE: REMOVE OR ARCHIVE ANY OUTDATED, REDUNDANT, OUTDATED, NON-FUNCTIONAL FILES (PLANNED AFTER DEPLOYMENT - CRITICAL TASK)

### Phase 1: Admin Dashboard UI/UX Enhancement (Week 1-2)

**1. Implement VAI Brand Consistency**

- Apply VAI Style Guide Colors:

- Integrate Founders Grotesk free verison or Hanken Grotesk and Inter font family across all admin components

- Update card components with light grey outlines (30% opacity blur) for natural background blending

- Apply neo-brutalist, warm accents, MoMA-inspired clean, symmetrical, creative design patterns

**2. Separate Landing Pages (Critical Security Fix)**

- Create dedicated `/admin` route for admin authentication (separate from user survey landing)

- Implement clear logical separation between mobile survey app and admin dashboard

**3. Integrate TypeScript + Tailwind + Any Other Components**

- Convert existing Dashboard.jsx, TableView.jsx to TypeScript (.tsx)

- Apply Tailwind CSS utility classes while preserving existing API calls to `/get-survey-responses`

- Implement Lucide icons for consistent iconography

### Phase 2: Complete Planned Features

**4. Event Manager CRUD Operations**
'''
IGNORE THIS SECTION FOR NOW:

- Define a Firestore schema for installations (fields: id, name, location, eventId, status, qrCodeUrl, metadata, createdAt, updatedAt, archivedAt)
- Add Firestore security rules and role-based access control for admin vs. survey users
- Implement backend TypeScript API (or Cloud Functions) for installation operations: list (with pagination), get, create, update, archive/restore, hard delete
- Implement input validation and sanitization on both client and server (use Zod or similar)
- Support cursor-based pagination, sorting, and server-side filtering by status, event, date range, and zipcode
- Provide real-time updates with Firestore listeners for the admin list and detail views
- Implement soft-delete / archival strategy with an audit trail (who/when) and exportable change log
- Create UI components in TypeScript/TSX: Installations Table, Detail Drawer/Modal, Edit/Create Form, Bulk Actions, and Confirmation Flows
- Integrate client-side toast notifications and error handling for all operations
- Add unit and integration tests for API handlers and key UI components; include e2e test scenarios for create/update/archive workflows
- Ensure QR code generation ties to installation records and immutable survey routing endpoints
- Document API contracts, Firestore schema, and admin UI workflows in the repo README/dev docs
'''

- Add QR code generation per installation with proper routing to survey pages

- Include event status tracking (upcoming, active, closed)

- Add toast notifications for successful/failed operations

### **Search Bar Admin Dashboard**: Standard search queries or results in an insights dashboard often focus on

    Key Performance Indicators (KPIs): Searching for specific metrics like "total survey submissions this month," "average score for question 5," or "conversion rate for survey completion."
    Segmented Data: Queries like "survey responses from users in California," "submissions from mobile devices," or "results for campaign X."
    Specific Reports/Dashboards: If the dashboard has multiple pre-built reports, searching for "demographics report," "user behavior trends," or "feedback analysis."
    Individual Records: Less common for aggregated insights, but could allow searching for specific survey IDs or user data if necessary for drill-down.
    Data Trends: Queries such as "submission trends over time," or "weekly engagement."

The actual "results" displayed in the dashboard would be the relevant charts, graphs, tables, or filtered views that answer the search query. For example, searching for "total submissions this month" might update a KPI widget to show that number, or "submissions from mobile devices" might filter a table of responses and update related charts.

### **User Sessions Metrics - Hardcoded Data Capture with Firestore**: Implement the skeleton for future development of user sessions data to bolster the data captured from users using the survey app. Use the following hardcoded sessions data capture guide for a skeleton/MVP of this component; create a paragraph documenting the potential of integrating Google Analytics into the ecosystem to leverage Google Analytics GA4 service for the next team to consider

**Admin Question**: "What is the average time a user spends completing surveys for each event location?"
**Solution**: Hardcode data capture with Firestore Native SDK

**Implementation Guide**:

- **Data Capture (Firestore Native SDK)**:
  - When a user starts a survey, record a `startTime` timestamp in Firestore for that survey instance
  - When the user completes or submits the survey, record an `endTime` timestamp
  - Crucially, also store the `eventLocation` associated with that survey

- **Hardcoded Sessions Data Capture into the Codebase (Firestore-centric)**:

  ***Ensure that we use consistent variables and naming conventions - only reference the coding logic in this more detailed implementation guide***:

  - **Start Time**: When a user starts a survey (e.g., when the survey page loads or the first question is displayed), record a timestamp in Firestore for that specific user's survey session
    - Create a document in a `survey_sessions` collection
    - Document ID: `user_id + survey_id` (or a unique session ID)
    - Fields: `{ startedAt: FieldValue.serverTimestamp(), userId: '...', surveyId: '...' }`

  - **End Time**: When the user completes or submits the survey, update that same Firestore document with an end timestamp
    - Fields: `{ completedAt: FieldValue.serverTimestamp() }`

  - **Calculation**:
    - Fetch the `startedAt` and `completedAt` timestamps from Firestore
    - Calculate `completedAt - startedAt` to get the duration
    - Aggregate these durations (e.g., average, median) within your Cloud Run backend (or a Cloud Function) when an admin requests the KPI
    - Your Cloud Run backend can then serve this aggregated data to your admin dashboard

**5. Survey Question Migration**

- Move hardcoded 13 questions from frontend to Firestore database (COMPLETED 12/21/2025)

- Create Survey Builder Module with drag-and-drop interface

- Support question types: Multiple Choice, Likert Scale, Checkboxes, Dropdowns, Free Text

- Implement survey-event association workflow

**6. Mobile Survey App UX Improvements**

- Add Survey Welcome Page with subtle animation

- Implement survey question stacked card mobile responsive flow of response; ability to swipe up/down to switch question (code ready to implement).

- Enable question count on survey app for users to keep track of progress

- Create Thank You page with post-submission animation

- Fix responsive design issues

### Phase 3: Advanced Features

**7. Enhanced Analytics & Filtering**

- Implement advanced table filtering by demographics, sentiment scores, time deltas (completed)

- Add individual attendee profile view from Table View

- Create zip code heatmap visualization for NYC neighborhoods

- Expand Advanced Charts modal with installation-specific breakdowns

**8. Accessibility & Multilingual Support**

- Implement English/Spanish toggle for survey questions

- Ensure WCAG 2.1 AA compliance

- Add ARIA labels and keyboard navigation throughout

- Test with screen readers

**9. Security & Performance Hardening**

- Implement proper CORS configuration for Vercel + Google Cloud Run

- Add input sanitization and validation

- Configure Firebase backup strategy

- Set up error monitoring with Sentry

## Additional Tasks Unorganized
- Going directly to the url <http://localhost:5173/dashboard> on a new browser window with no data will open up the dashboard with a fully accessible sidebar that allows a non-authenticated user to browse all of the settings, go into Profile, Profile Settings, and Profile Log Out. The actual charts on the dashboard page give a 404 error.
- Survey App Firestore Instillation QR Code slug routing vs Tinyurl approach: Would it just be easier to have a redirect URL in place instead of adding an entire new slug field like we have now? For example, keep the original "survey=?" that was in place and that firestore understands, and give users a printed out paper with ".com/los-circulos" which will redirect them to "survey=?installationid-PmrUuEJJ6xszSIpjoGuS
- View Users should automatically load sorted by most recent to oldest. In Firestore, each entry in surveyResponses collection has a "submittedAt" field - maybe can use this somehow to sort?
  - What other creative impactful sorting filters can an admin leverage for business insights in the View Users's detailed table?
- Critical Syntax Bug: The "Profile" text in admin dashboard uses an ASCII like character instead of a lucide-react icon for the small person icon (see attached screenshot which shows the page with styling disabled)
- Add a "Back to Landing Page" text at the Thank You page upon survey completion. Currently there is no way for devops team to quickly return to the landing page after manual survey submission.
- Admin Dashboard Responsiveness: The repsonsive layout for admin dashboard has stopped functioning properly. The sidebar was collapsable (sandwich sidebar) however now it is a static sidebar that squishes the main content such as charts/KPIs on dashboard.
- Survey Creation Suite Enhancement: Use the "/frontend/public/Survey Creation Assets" folder to populate the Survey Creation Suite's bank of images to select from.
- Free Text Response sentiment analysis and additional insights.
- Remove the "Refresh Data" button from admin dashboard. This was temporarily added during troubleshooting of Firestore response and chart.js rendering of responses captured. It is no longer needed and can be safely removed, and any place in the codebase that depends on Refresh Data to exist, but is part of essential functional code, should be modified to ensure stable app.
- Use the populate.py script to fill up responses prior to handoff for a cleaner view (optional)
- Search Bar in Admin Dashboard: The functionality of it is nearly useless. A user starts typing in characters and the charts, KPIs, tables (all cards) change but in confusing ways (for example if user intends to view the demographic "white", as they start typing "w" the entire dashboard changes what numbers it displays). The search bar should be non-case sensitive. The search bar should be MODERN and use the same prediction of user search query via dropdown featuring specific functional search queries. Essentially, every modern search bar like Google, VS Code Command Palette, Browser URL Bar Suggest Searches functionality (example: Firefox's Search Suggestions uses browsing history, trending or most relevant core KPIs, charts, and recent searches made by a user).
  - Key Performance Indicators (KPIs): Searching for specific metrics like "total survey submissions this month," "average score for question 5," or "conversion rate for survey completion."
  - Segmented Data: Queries like "survey responses from users in California," "submissions from mobile devices," or "results for campaign X."
  - Specific Reports/Dashboards: If the dashboard has multiple pre-built reports, searching for "demographics report," "user behavior trends," or "feedback analysis."
  - Individual Records: Less common for aggregated insights, but could allow searching for specific survey IDs or user data if necessary for drill-down.
  - Data Trends: Queries such as "submission trends over time," or "weekly engagement."
 The actual "results" displayed in the dashboard would be the relevant charts, graphs, tables, or filtered views that answer the search query. For example, searching for "total submissions this month" might update a KPI widget to show that number, or "submissions from mobile devices" might filter a table of responses and update related charts.

- Implement Admin Logs: An admin user should be able to go into their Profile in the bottom left corner and in Settings be able to view a record of the actions they took. Use web development best practices and include log items such as "Signed In Event
  , "Logout Event", "Changed Language Settings", "Requested Report Export", "Succesfully Exported Report", "CRUD Performed on Installations" (Installation creation, modification, and deletion are a core use cases for admins and these changes are signficant because if an admin deletes an event, this deletion will affect ALL users. All other admins dashboard apps will break and all survey app users will lose ability to complete surveys for that event).
  - We can be more granular and event such as "Searched for", "Submitted a Bug Report - Bug Details", etc.
  - Alternative for the "CRUD Performed on Installations" log event: Implement soft-delete / archival strategy with an audit trail (who/when) and exportable change log
- Migration to Typescript
- ImpactIntel / Asterix Page: This is where our app's LLM powered tool lives at the moment. It enables admin users to use natural language prompting to get more customized, insightful data analysis. Requires Gemini API key.
  - Firestore/Google Cloud Run/Google Analytics/Big Query have variations of this as an SDK. Must decide what the appropriate approach is for this specific project to leverage a small LLM component to enhance the data analytics business insights purpose of the app.
- Revise the Style Guide source of truth to use the colors and guide used in file "Van Alen UI UX Style Guide\Copy of Style Guide + Color Palette Van Alen.md"
- Implement toast notifcations on anything that should require it.
- Ensure QR code generation ties to installation records and immutable survey routing endpoints
- Update the /frontend/Docuemntation,jsx page to reflect the latest build updates and ensure the page offers valuable information for the admin user on how to use the app, what functionalities it has, key features, etc; A compact FAQ section would be nice as well. Styled like a Notion page; similar styles to follow are prevalent web developer library documentation like Vercel, Github, Firefox Developer.

#### Additional Tasks Unorganized: Deferred Backlog Items for Next Team:

1. **Settings Page Functionality** - User preferences, notification settings, changing password (DEFERRED)
2. **Dark Mode** - Complete design system (DEFERRED FOR NEXT TEAM)
3. **Additional Filters** - Date range, zip code, demographics (DEFERRED)
4. **Scheduled Reports** - Automated monthly email summaries (DEFERRED FOR NEXT TEAM)
5. **Data Export Options** - SQL, JSON, Parquet formats (DEFERRED FOR NEXT TEAM)
6. **Advanced Analytics** - Correlation analysis, trend forecasting (DEFERRED)
7. **Mobile App** - Native iOS/Android version (DEFERRED FOR NEXT TEAM)
8. **Collaboration Features** - Team comments, shared annotations (DEFERRED FOR NEXT TEAM)
**Check if these are included in the Cosing Phase Document**

## Critical Blockers to Address

**From your Execution Phase document**:

1. **Frontend deployment white screen issue** - Vercel/Netlify deploy successfully but render blank page (localhost works)

2. **Cross-browser mobile testing** - Requires iOS Safari and older Android device testing

3. **Component consistency** - Standardize search, filter, input field components across app

4. **Survey partial submission UX decision** - Determine data integrity vs. completion rates strategy

## Success Criteria for 4 hour Deadline

[ ] Admin dashboard matches VAI Style Guide visual identity

[ ] Clear separation between user survey app and admin dashboard

[ ] Event Manager CRUD operations functional with QR generation

[ ] Survey questions stored in Firestore (no hardcoding)

[ ] Mobile-first responsive design for survey app

[ ] Either: (1) TypeScript + Tailwind + MaterialUI properly integrated OR (2) Javascript with only MaterialUI or Tailwind

[ ] All security vulnerabilities resolved

[ ] Documentation updated to reflect TSXandTails branch changes

Focus on delivering a polished, user-friendly admin dashboard that adheres to VAI's branding guidelines while ensuring robust backend functionality. Prioritize security and clear separation between user and admin interfaces. Address critical blockers early to avoid delays.

The integration goal image shows a clean, professional dashboard that aligns with these priorities. Focus on achieving that visual polish while maintaining your solid backend architecture.
