Infrastructure

**Current Setup:**

- **Development**: Local development servers (Vite dev server + Flask debug server)
- **Database**: Google Cloud Firestore (managed NoSQL service)
- **Authentication**: Firebase Authentication (managed service)
- **No containerization**: No Docker files or container orchestration
- **No CI/CD**: No GitHub Actions, Jenkins, or deployment pipelines configured
- **Version Control**: Git/GitHub with standard `.gitignore` patterns

**Security Configuration:**

- `.gitignore` excludes: `.env` files, `firebase_key.json`, `venv/`, `__pycache__/`, `node_modules/`
- CORS restricted to specific frontend origin
- Service account key file required for backend Firestore access
- Passwords never stored in Firestore (Firebase Auth only)

**Production Considerations:**

- No production deployment configuration present
- `run.py` uses `debug=False` but still runs Flask development server (not production WSGI server)
- Requirements include `gunircorn==21.2.0` (typo: should be `gunicorn`) but not used in `run.py`
- No environment-specific configuration (dev/staging/prod)
- No load balancing or scaling configuration

## Runtime Behavior

### Application Initialization

**Frontend Initialization:**

1. `main.jsx` renders `App.jsx` wrapped in React `StrictMode`
2. `App.jsx` mounts and executes `useEffect` hook:

   - Checks `localStorage.getItem("jwtToken")`
   - If token exists: calls `API.get("/get-survey-responses")`
   - On success: sets `surveyData`, `isAuthenticated=true`, loads `user` from localStorage
   - On failure: clears tokens, sets `isAuthenticated=false`
   - Sets `loading=false` to render application

3. `AuthContext.Provider` wraps all routes, providing global state
4. React Router mounts route component based on URL path
5. Protected routes (Dashboard, TableView, etc.) check `isAuthenticated` from context

**Backend Initialization:**

1. `run.py` executes `create_app()` factory function
2. Flask app initialization sequence:

   - Loads `Config` class from `app.config`, reads environment variables via `dotenv`
   - Initializes Firebase Admin SDK: `credentials.Certificate(app.config['FIREBASE_KEY_PATH'])`
   - Creates Firestore client: `app.db = firestore.client()`
   - Configures CORS: `CORS(app, origins=app.config['FRONTEND_URL'])`
   - Registers Blueprint: `app.register_blueprint(main_blueprint)`

3. Flask development server starts: `app.run(debug=False)` on port 5000
4. Server ready to accept HTTP requests

### Request/Response Handling

**Survey Submission:**

- Frontend: User completes 13 questions, clicks submit
- `Survey.jsx` calls `API.post('/submit-survey', { installationId, responses })`
- Backend `submit_survey()`:
  - Extracts `responses` and `installationId` from JSON body
  - Normalizes response values (single-item lists → strings, empty lists → empty strings)
  - Creates `SurveyResponse` model with UTC timestamp
  - Saves to Firestore: `current_app.db.collection('surveyResponses').add(survey_response.to_dict())`
  - Returns `200` with success message or `400` with error

**User Registration:**

- Frontend: User fills signup form (firstName, lastName, email, password)
- `SignUp.jsx` calls `API.post('/register-user', userData)`
- Backend `register_user()`:
  - Validates required fields
  - Creates user in Firebase Auth: `auth.create_user(email, password, display_name)`
  - Receives UID from Firebase Auth
  - Stores user profile in Firestore: `db.collection('users').document(uid).set(user.to_dict(uid))`
  - Password never touches Firestore (Firebase Auth handles it)
  - Returns `201` with UID or `400` with error

**Authentication:**

- Frontend: User submits credentials on Login page
- `Login.jsx` calls Firebase SDK: `signInWithEmailAndPassword(auth, email, password)`
- Receives `userCred` with ID token
- Calls backend: `API.post("/verify-token", { idToken })`
- Backend `verify_token()`:
  - Validates token: `auth.verify_id_token(id_token)`
  - Returns `200` with UID or `401` if invalid
- Frontend stores token and user in localStorage, updates AuthContext
- Fetches survey data: `API.get('/get-survey-responses')`
- Navigates to `/dashboard`

**Dashboard Data Loading:**

- On mount or filter change, Dashboard component uses `useMemo` to filter `surveyData` from AuthContext
- Filters applied: installation ID, date range, zip code
- KPIs calculated: total responses, average sentiment (q8-q11), installation counts
- Chart components receive filtered data and render Chart.js visualizations
- No additional API calls (data already in context from App.jsx initialization)

**Report Generation:**

- User clicks "Download Report" button
- `handleDownload()` calls `API.get('/generate-report', { responseType: 'blob' })`
- Backend `generate_report()`:
  - Loads all responses: `load_responses_from_firestore()`
  - Cleans data: `clean_firestore_responses(raw_responses, question_map)`
  - Instantiates `SurveyAnalyzer(responses, question_map)`
  - Generates CSV: `analyzer.export_summary_csv('survey_summary.csv')`
  - Generates PNG charts: `analyzer.generate_graphs('survey_graphs')`
  - Compiles PDF: `save_graphs_to_pdf('survey_graphs', 'survey_graphs_summary.pdf', question_map)`
  - Creates ZIP: `zipfile.ZipFile` with CSV and PDF
  - Returns: `send_file(memory_file, mimetype='application/zip', as_attachment=True)`
- Frontend creates blob URL, triggers browser download, removes link element

### Business Workflows

**Public Survey Workflow:**

1. User visits Home page (`/`)
2. Clicks "Get Started" → navigates to Installation selection (`/installation-selection`)
3. Selects installation (Breathing Pavilion = "1", Common Ground = "2")
4. Redirected to Survey page (`/survey`) with `installationId` in state
5. Progressive question display: one question at a time with progress bar
6. User answers 13 questions (demographics, behaviors, perceptions, Likert scales)
7. Validation: must answer before proceeding
8. On final question, "Submit" button appears
9. Submission: POST to `/submit-survey`, saves to Firestore
10. Redirected to ThankYou page (`/survey-complete`)

**Staff Dashboard Workflow:**

1. Staff member visits Login page (`/login`)
2. Enters email/password, submits form
3. Firebase Auth authenticates, backend verifies token
4. Token and user data stored, AuthContext updated
5. Survey data fetched and cached
6. Navigated to Dashboard (`/dashboard`)
7. Dashboard displays:

   - Executive KPIs (total responses, avg sentiment, installation counts)
   - Filter panel (installation, date range, zip code)
   - 7-day trend line chart
   - Installation comparison bar chart
   - Daily summary charts (pie, doughnut, bar)

8. Staff can navigate to:

   - Table View: Detailed tabular data with sortable columns
   - Event Manager: Create/edit events (future feature)
   - Documentation: System documentation
   - Settings: User settings

9. Download Report: Generates ZIP with CSV and PDF visualizations
10. Logout: Clears localStorage, resets AuthContext, redirects to Home

### Error Handling

**Frontend:**

- Try-catch blocks around all async operations (API calls, Firebase auth)
- Error state management: `useState` for error messages
- User-friendly error displays: "Invalid email or password", "Survey submission failed"
- Console logging for debugging: `console.error()` for failures
- Loading states: spinner during initialization, button disabled during submission
- Protected route guards: Dashboard checks `isAuthenticated`, shows 404 message if not logged in

**Backend:**

- Try-except blocks around Firestore operations
- HTTP status codes: `200` (success), `201` (created), `400` (bad request), `401` (unauthorized), `500` (server error)
- Error messages returned in JSON: `{"error": "<message>"}`
- Print statements for debugging: `print("Error saving survey response:", str(e))`
- Validation: Checks for required fields before processing

**Firebase Errors:**

- Caught and converted to user-friendly messages
- Common errors: "auth/user-not-found", "auth/wrong-password" → "Invalid email or password"
- Network errors handled gracefully with retry logic (implicit via Axios)

### Background Tasks

**Current Implementation:**

- No explicit background job processing (no Celery, cron jobs, or task queues)
- Report generation is synchronous and on-demand (may block for large datasets)
- Chart rendering uses matplotlib with 'Agg' backend (non-GUI, suitable for server environments)
- No scheduled tasks (no data aggregation, cleanup, or notifications)

**Performance Considerations:**

- Dashboard data loaded once on app initialization, cached in AuthContext
- Filtering and aggregation performed client-side via `useMemo` (efficient for <1000 responses)
- Report generation loads all responses into memory (may be slow for 1000+ responses)
- No pagination implemented for survey responses
- No caching layer (Redis, Memcached) for frequently accessed data

### State Management

**Frontend State:**

- **Global State (AuthContext)**: `user`, `isAuthenticated`, `surveyData`
- **Local Component State**: Form inputs, filters, UI toggles, error messages
- **LocalStorage Persistence**: JWT token, user object, survey data (optional cache)
- **No Redux or Zustand**: Simple Context API sufficient for current scope

**Backend State:**

- **Stateless**: Flask app is stateless, each request independent
- **Firestore**: Single source of truth for persistent data
- **No session storage**: Authentication via JWT tokens (stateless)
- **In-memory during request**: SurveyAnalyzer processes data in memory, no caching between requests.
