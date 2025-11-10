# Van Alen Institute Community Engagement Data Platform

This document provides a comprehensive technical architecture overview of the system, detailing its components, interactions, deployment, runtime behavior, and notable design decisions.

## Core Components

1. Frontend (React + Vite)

Major Modules:
•  Pages: Home, Installation Selection, Survey, ThankYou, Login, SignUp, Dashboard
•  Components: Navbar, Logo, SurveyQuestion
•  Utilities: apiClient, firebaseConfig, AuthContext

Key Architecture Elements:
•  React Router DOM (v7.4.1) for client-side routing with 7 main routes
•  AuthContext provider pattern wrapping the entire application for centralized authentication state management
•  Axios interceptors for automatic JWT token attachment to API requests
•  Chart.js (v4.4.9) with chartjs-plugin-datalabels for data visualization in Dashboard
•  Firebase SDK (v11.6.1) for client-side authentication

Survey Flow:
•  13 survey questions stored in a static data file (surveyQuestions.js)
•  Question types: multiple choice, checkboxes (multi-select), and range sliders (1-5 scales)
•  Progressive single-question display with validation before advancing
•  Local state management for survey responses before submission

2. Backend (Python Flask)

Major Modules:
•  app/__init__.py: Flask app factory pattern with Firebase Admin SDK initialization
•  app/routes.py: Blueprint-based REST API endpoints
•  app/models.py: Data models for UserSignUp and SurveyResponse
•  app/utils.py: Survey analysis utilities including SurveyAnalyzer class
•  app/config.py: Environment-based configuration loading

## Key Classes & Functions

•  UserSignUp: User registration model (firstName, lastName, email, password)
•  SurveyResponse: Survey submission model (responses dict, installationId, submittedAt timestamp)
•  SurveyAnalyzer: Comprehensive data analysis class with methods for:
◦  Response counting and aggregation
◦  Multiple choice question summarization
◦  Numeric question statistics (mean, min, max, 95% confidence intervals)
◦  CSV/Excel export functionality
◦  Graph generation using Matplotlib (with Agg backend for headless environments)

## API Endpoints

•  GET / - Health check
•  POST /submit-survey - Submit survey responses to Firestore
•  POST /register-user - Create new user in Firebase Auth + Firestore
•  POST /verify-token - Verify Firebase ID token for authentication
•  GET /get-survey-responses - Retrieve all survey responses
•  GET /generate-report - Generate and download CSV + PDF visualizations as ZIP

## Security Features

•  Firebase Admin SDK for server-side authentication
•  Token verification on login
•  CORS configured to allow specific frontend origin only
•  Service account key authentication for Firestore access
•  Password not stored in Firestore (only in Firebase Auth)

## Data Analysis Pipeline

•  Load responses from Firestore
•  Clean and flatten nested response structure
•  Aggregate counts for categorical questions
•  Calculate statistics for numeric Likert-scale questions
•  Generate bar charts and pie charts (demographic questions)
•  Export to PDF using matplotlib's PdfPages backend

## Component Interactions

 __Survey Submission Flow:__

```
User (Frontend) → Survey Page → apiClient → Flask Backend → Firebase Firestore
```

__Authentication Flow:__

```
Login Page → Firebase Client Auth → Get ID Token → Flask `/verify-token` → Store JWT in localStorage → AuthContext updates → Navigate to Dashboard
```

__Dashboard Data Flow:__

```
Dashboard Load → Check AuthContext → Fetch `/get-survey-responses` → Aggregate responses → Render visualizations
```

__Report Generation Flow:__

```
Dashboard → `/generate-report` request → Load from Firestore → SurveyAnalyzer processes → Generate CSV + matplotlib graphs → Save to PDF → ZIP and return as blob → Download via browser
```

##

## Deployment Architecture

Build Steps:

Frontend (Vite):
bash
Backend (Flask):
bash
External Dependencies:

Frontend:
•  Node.js and npm (package management)
•  Vite 6.2.0 (build tool)
•  Firebase project (authentication + Firestore)
•  Environment variables via .env file (VITE_FIREBASE_* credentials, VITE_API_BASE_URL)

Backend:
•  Python 3.x
•  Flask 3.1.0 + Flask-CORS 5.0.1
•  firebase-admin 6.8.0
•  pandas 2.2.3, numpy 2.2.5, matplotlib 3.10.1 (data analysis)
•  Service account JSON key file (firebase_key.json)
•  Environment variables via .env file (FIREBASE_KEY_PATH, FRONTEND_URL)

Infrastructure:
•  Development: Local development servers (Vite dev server + Flask debug server)
•  Database: Google Cloud Firestore (NoSQL, managed service)
•  Authentication: Firebase Authentication (managed service)
•  No containerization currently implemented (no Docker files present)
•  Version Control: Git/GitHub

Security Configuration:
•  .gitignore properly configured to exclude:
◦  .env files (both frontend and backend)
◦  firebase_key.json (service account credentials)
◦  venv/ (Python virtual environment)
◦  __pycache__/ (Python bytecode)
◦  node_modules/ (implied by npm)

## Runtime Behavior

Application Initialization:

Frontend:

1. main.jsx renders App.jsx in StrictMode
2. App.jsx initializes with useEffect hook:
◦  Checks localStorage for existing JWT token
◦  If token exists, attempts to fetch survey data from backend
◦  On success: sets authenticated state and loads user data
◦  On failure: clears tokens and redirects to unauthenticated state
3. AuthContext wraps all routes, providing global state access
4. Router mounts appropriate page component based on URL path

Backend:

1. run.py calls create_app() factory function
2. Flask app initializes:
◦  Loads Config from environment variables
◦  Initializes Firebase Admin SDK with service account
◦  Creates Firestore client and attaches to app.db
◦  Registers CORS with frontend URL whitelist
◦  Registers main Blueprint with all route handlers
3. Flask development server starts on port 5000 with debug mode

## Request/Response Handling

Survey Submission:
•  Frontend collects responses in local state (answer object keyed by question ID)
•  On final submit, POST request sent to /submit-survey with installationId and responses
•  Backend validates, creates SurveyResponse model with UTC timestamp
•  Saves to Firestore surveyResponses collection
•  Returns 200 success or 400 error with message

## User Registration

•  Frontend collects firstName, lastName, email, password
•  POST to /register-user
•  Backend creates user in Firebase Auth first (returns UID)
•  Then stores user profile in Firestore users collection with UID as document ID
•  Password never stored in Firestore (handled by Firebase Auth)

## Authentication

•  User submits credentials on Login page
•  Firebase client SDK (signInWithEmailAndPassword) authenticates user
•  Receives ID token from Firebase
•  Backend /verify-token endpoint validates token using Firebase Admin SDK
•  Token and user data stored in localStorage
•  All subsequent API requests include token via Axios interceptor

### Business Workflows

## Public Survey Workflow

1. User visits Home page
2. Clicks "Get Started" → Installation selection page
3. Selects one of two installations (Breathing Pavilion or Common Ground)
4. Redirected to Survey page with progressive question display
5. Answers 13 questions (demographics, behaviors, perceptions)
6. Submits survey → saved to Firestore
7. Redirected to ThankYou page

## Staff Dashboard Workflow

1. Staff member logs in via Login page
2. On successful authentication, navigated to Dashboard
3. Dashboard loads all survey responses from Firestore
4. Aggregates responses per question
5. Renders interactive Chart.js visualizations (pie, doughnut, or bar charts)
6. Staff can toggle chart types dynamically
7. Download button triggers report generation:
◦  Backend aggregates all responses
◦  Generates CSV summary with statistics
◦  Creates PNG charts for each question
◦  Compiles charts into PDF
◦  Zips CSV + PDF and streams to client
◦  Staff downloads ZIP file for offline analysis

## Features for Staff Dashboard include

* __Executive snapshots__: live KPIs such as number of responses, completion rates and sentiment
* __Event manager__: create/edit/delete events and assign QR codes to track turnout and responses
* __Analytics__: filter data by project, place, time, device or attendee ID and visualize engagement through interactive charts
* __Reporting__: export raw data and charts in CSV/JSON/PDF/Markdown formats
* __Filtering/Searching__: search survey responses by respondent attributes
* __Attendee Profile__: table view individual survey submission respondents details (name, email, responses)
* __Login Page UI/UX__: user-friendly login with error handling and loading states
* __Logout Functionality__: secure logout with token invalidation
* __Chart Type Toggle__: switch between pie, doughnut, and bar charts dynamically
* __Responsive Design__: browser-first layout (not mobile optimized)
* __Professional Admin UI Design__: clean, modern interface aligned with VAI branding
* __Header/Sidebar Navigation__: consistent navigation elements across all pages

0
cd backend
.\venv\Scripts\Activate.ps1
python scripts/seed_responses.py 30

1
cd backend
venv\Scripts\activate
python scripts/seed_responses.py 30

-------


Q: "Is this live data?"
A: "This is synthetic demo data created by our seeding script. Production would connect to real survey submissions from the mobile app."

Q: "How do you handle large datasets?"
A: "Currently optimized for <100 responses. Next phase includes pagination and performance optimizations for 1000+ responses."

Q: "What about user management?"
A: "Firebase Auth handles staff authentication now. Phase Two roadmap includes admin interface for managing user roles and permissions.

-----
Next Steps?

Technical Validation
 Welcome Page ** Thank you Page
 Load Testing: Simulate 100+ concurrent survey submissions to identify performance bottlenecks
 Cross-Browser Testing: Validate mobile survey experience on iOS Safari, Android Chrome, older device browsers, MOBILE DEVICES
 Accessibility Audit
 Data Backup Strategy --> Firebase backups config
 Error Monitoring: Set up Sentry, Dependabot or similar for production error tracking and alerting
 Stakeholder Demo: Forward this presentation to VAI for review and iteration
    -> Stakeholder Meeting

 QR Code Generation
 Social Media Assets: Repurpose VAI deisng elements for brand consistency
 Survey Form Iteration: Test multiple types of questions and formats --> Free Text Responses !
 Convert Zip Codes into heatmap embedded to admin dashboard with heatmap based on agg. of zip codes
 Multilingual Support: Spanish translation (priority), followed by Mandarin, Arabic based on installation demographics
 Offline chaching of data responses

----
RISKS...

Firebase Cost Overrun
Data Los
Security Breach
Low Adoption
Scope Creep
Community Risks
Survey Fatigue
Privacy Concerns
Accessibility Barriers