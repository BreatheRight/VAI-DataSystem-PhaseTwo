<!-- 15ab0936-8f09-4ade-9de7-a757da48cef3 1ee61e10-f14e-48b8-a84f-02327e444f4d -->
# Van Alen Institute Public Art Impact Measurement System - Technical Overview

## Core Components

### 1. Frontend (React + Vite)

**Architecture:**

- **Framework**: React 19.0.0 with Vite 6.2.0 as build tool
- **Routing**: React Router DOM v7.4.1 with 10 defined routes
- **UI Library**: Material-UI (MUI) v5.14.20 for admin dashboard components
- **State Management**: React Context API via `AuthContext` for global authentication and survey data state
- **HTTP Client**: Axios with request interceptors for automatic JWT token injection
- **Visualization**: Chart.js v4.4.9 with datalabels plugin for interactive charts
- **Authentication**: Firebase SDK v11.10.0 for client-side authentication

**Page Components:**

- **Public Pages**: `Home.jsx`, `Installation.jsx`, `Survey.jsx`, `ThankYou.jsx`
- **Auth Pages**: `Login.jsx`, `SignUp.jsx`
- **Admin Pages**: `Dashboard.jsx`, `TableView.jsx`, `EventManager.jsx`, `Documentation.jsx`, `Settings.jsx`

**Key Components:**

- `DashboardLayout.jsx`: Persistent sidebar navigation with Material-UI Drawer, handles logout and routing
- `SurveyQuestion.jsx`: Reusable question component supporting multiple choice, multi-select checkboxes, and range sliders
- `StatsCard.jsx`: KPI display cards for executive metrics
- `FilterPanel.jsx`: Filtering interface for installation, date range, and zip code
- `DataTable.jsx`: Tabular view of survey responses with sortable columns
- `InstallationComparisonChart.jsx`: Bar chart comparing responses across installations
- `TrendLineChart.jsx`: 7-day trend visualization
- `DailySummaryCharts.jsx`: Configurable chart component (pie, doughnut, bar)

**Data Structures:**

- `surveyQuestions.js`: Static array of 13 survey questions with metadata (questionId, question text, options, type, multiple flag)
- Question types: multiple choice (single), checkboxes (multi-select), range sliders (1-5 Likert scale)
- Survey responses stored as object keyed by question ID (q1-q13)

**Styling:**

- Custom CSS modules: `global.css`, `auth.css`, `survey.css`, `dashboard.css`
- Custom fonts: Hanken Grotesk (primary), Bebas Neue (headings), IBM Plex Sans, Inter
- Brand colors defined in `brandColors.js`

### 2. Backend (Python Flask)

**Architecture:**

- **Framework**: Flask 3.1.0 with Blueprint pattern for route organization
- **Database**: Google Cloud Firestore (NoSQL) accessed via Firebase Admin SDK 6.8.0
- **Authentication**: Firebase Admin SDK for server-side token verification
- **CORS**: Flask-CORS 5.0.1 configured for frontend origin whitelist
- **Data Analysis**: pandas 2.2.3, numpy 2.2.5, matplotlib 3.10.1 (Agg backend for headless environments)

**Module Structure:**

- `app/__init__.py`: Flask app factory (`create_app()`) initializes Firebase Admin SDK, creates Firestore client, registers blueprints
- `app/config.py`: Environment-based configuration loader (dotenv)
- `app/models.py`: Data models (`UserSignUp`, `SurveyResponse`, `DownloadSurveyData`)
- `app/routes.py`: Blueprint with 6 REST API endpoints
- `app/utils.py`: `SurveyAnalyzer` class and helper functions for data processing

**Key Classes:**

**SurveyAnalyzer** (`app/utils.py`):

- `__init__(responses, question_map)`: Initializes with response list and question mapping, creates pandas DataFrame
- `get_response_count()`: Returns total number of responses
- `summarize_multiple_choice(question_id)`: Aggregates categorical responses with counts and percentages
- `summarize_numeric_question(question_id)`: Calculates mean, min, max, 95% confidence intervals for Likert-scale questions
- `calculate_confidence_interval(data_series)`: Statistical calculation using standard error
- `export_summary_csv(filepath)`: Generates CSV with question summaries
- `export_summary_excel(filepath)`: Generates Excel workbook with separate sheets per question
- `generate_graphs(output_dir)`: Creates PNG charts (pie charts for demographics, bar charts for others)
- `summarize_timestamp_location()`: Analyzes temporal and geographic patterns

**Helper Functions:**

- `load_responses_from_firestore()`: Fetches all documents from `surveyResponses` collection
- `clean_firestore_responses(raw_responses, question_map)`: Flattens nested response structure, normalizes single-item lists
- `save_graphs_to_pdf(input_folder, output_pdf_path, question_map)`: Compiles PNG charts into multi-page PDF using matplotlib PdfPages

**API Endpoints:**

- `GET /`: Health check endpoint
- `POST /submit-survey`: Accepts `installationId` and `responses` object, saves to Firestore `surveyResponses` collection
- `POST /register-user`: Creates user in Firebase Auth, stores profile in Firestore `users` collection (password handled by Firebase Auth only)
- `POST /verify-token`: Validates Firebase ID token, returns UID
- `GET /get-survey-responses`: Returns all survey responses as JSON array
- `GET /generate-report`: Generates CSV summary and PDF with charts, returns as ZIP file download

**Data Models:**

- `UserSignUp`: firstName, lastName, email, password (not stored in DB)
- `SurveyResponse`: responses dict, installationId, submittedAt (UTC ISO timestamp)

**Scripts:**

- `scripts/seed_responses.py`: Utility to generate synthetic survey data for testing/demo (30 responses by default, configurable count)

### 3. External Services

**Firebase Services:**

- **Firestore**: NoSQL document database with collections:
  - `users`: User profile documents (UID as document ID)
  - `surveyResponses`: Survey submission documents with auto-generated IDs
- **Firebase Authentication**: Email/password authentication, JWT token generation
- **Service Account**: Backend uses JSON key file for Admin SDK access

## Component Interactions

### Data Flow Patterns

**Survey Submission Flow:**

```
User → Survey Page (local state) → API.post('/submit-survey') → Flask routes.py → 
SurveyResponse model → Firestore.surveyResponses.add() → 200 response → ThankYou page
```

**Authentication Flow:**

```
Login Page → Firebase SDK signInWithEmailAndPassword() → Get ID Token → 
API.post('/verify-token') → Flask auth.verify_id_token() → Store token in localStorage → 
Update AuthContext → Fetch survey data → Navigate to Dashboard
```

**Dashboard Data Flow:**

```
App.jsx useEffect → Check localStorage for JWT → API.get('/get-survey-responses') → 
Flask loads from Firestore → Return JSON array → Update AuthContext.surveyData → 
Dashboard component → Filter/aggregate in useMemo → Render Chart.js visualizations
```

**Report Generation Flow:**

```
Dashboard Download button → API.get('/generate-report', responseType: 'blob') → 
Flask: load_responses_from_firestore() → clean_firestore_responses() → 
SurveyAnalyzer instantiation → export_summary_csv() → generate_graphs() → 
save_graphs_to_pdf() → ZIP files → send_file() as blob → Browser download
```

### Communication Methods

**REST API:**

- JSON over HTTP via Axios
- Base URL configured via `VITE_API_BASE_URL` environment variable
- Request interceptors automatically attach `Authorization: Bearer <token>` header
- Response handling with error catching and user-friendly messages

**Firestore:**

- Backend: Firebase Admin SDK with service account credentials
- Collections accessed via `current_app.db.collection('<name>')`
- Document operations: `.add()`, `.stream()`, `.document(uid).set()`
- No real-time listeners (polling-based data fetching)

**Firebase Authentication:**

- Frontend: Client SDK (`signInWithEmailAndPassword`, `createUserWithEmailAndPassword`)
- Backend: Admin SDK (`auth.verify_id_token`, `auth.create_user`)
- Tokens stored in localStorage, validated on each protected route access

**LocalStorage:**

- `jwtToken`: Firebase ID token for API authentication
- `user`: JSON stringified user object (email, uid)
- `surveyData`: Cached survey responses (optional, for performance)

### Design Patterns

1. **Factory Pattern**: Flask app creation via `create_app()` function
2. **Blueprint Pattern**: Modular route organization in `routes.py`
3. **Context Provider Pattern**: React `AuthContext` for global state management
4. **Interceptor Pattern**: Axios request interceptors for token injection
5. **Repository Pattern**: Firestore as abstraction layer for data persistence
6. **Model-View-Controller**: Clear separation between models (models.py), views (React components), controllers (routes.py)

### Dependency Injection

- Flask `current_app` context for accessing Firestore client (`app.db`)
- AuthContext provides authentication state and survey data to all child components via React Context
- Environment variables injected via `dotenv` for configuration

## Deployment Architecture

### Build Steps

**Frontend:**

```bash
cd frontend
npm install                    # Install dependencies
npm run dev                   # Development server (localhost:5173)
npm run build                 # Production build to dist/
npm run preview               # Preview production build
```

**Backend:**

```bash
cd backend
python3 -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
python3 run.py               # Development server (localhost:5000, debug=False)
```

### External Dependencies

**Frontend Runtime:**

- Node.js and npm (package management)
- Vite 6.2.0 (build tool and dev server)
- React 19.0.0, React DOM 19.0.0
- React Router DOM 7.4.1
- Material-UI 5.14.20 (components, icons)
- Chart.js 4.4.9, chartjs-plugin-datalabels 2.2.0
- Axios 1.8.4
- Firebase 11.10.0
- date-fns 2.30.0

**Backend Runtime:**

- Python 3.x
- Flask 3.1.0, Flask-CORS 5.0.1
- firebase-admin 6.8.0
- google-cloud-firestore 2.20.2
- pandas 2.2.3, numpy 2.2.5
- matplotlib 3.10.1 (Agg backend)
- python-dotenv 1.1.0
- openpyxl 3.1.5 (Excel export)

**External Services:**

- Google Cloud Firestore (NoSQL database)
- Firebase Authentication (managed auth service)
- Firebase project with service account credentials

### Environment Configuration

**Frontend `.env`:**

```
VITE_API_KEY=<firebase-api-key>
VITE_AUTH_DOMAIN=<firebase-auth-domain>
VITE_PROJECT_ID=<firebase-project-id>
VITE_STORAGE_BUCKET=<firebase-storage-bucket>
VITE_MESSAGING_SENDER_ID=<firebase-messaging-sender-id>
VITE_APP_ID=<firebase-app-id>
VITE_MEASUREMENT_ID=<firebase-measurement-id>
VITE_API_BASE_URL=http://localhost:5000
```

**Backend `.env`:**

```
FIREBASE_KEY_PATH=app/firebase_key.json
FRONTEND_URL=http://localhost:5173
```

### Infrastructure

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
- **In-memory during request**: SurveyAnalyzer processes data in memory, no caching between requests