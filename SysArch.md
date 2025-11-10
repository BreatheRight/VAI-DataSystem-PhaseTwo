USER:
As a technical expert, analyze this codebase and provide a clear project overview:

- Core Components: Describe the major components or modules, their responsibilities, and any key classes or functions they contain. Note any relevant design patterns or architectural approaches.

- Component Interactions: Explain how the components interact, including data and control flow, communication methods, and any APIs or interfaces used. Highlight use of dependency injection or service patterns if applicable.

- Deployment Architecture: Summarize the deployment setup, including build steps, external dependencies, required environments (e.g., dev, staging, prod), and infrastructure or containerization details.

- Runtime Behavior: Describe how the application initializes, handles requests and responses, runs business workflows, and manages errors or background tasks.

Stay focused on providing a technical overview that helps a developer quickly understand how the system works. Avoid personal opinions or implementation suggestions unless specifically asked.

AGENT:
CreatePlan

## **Van Alen Institute Public Art Impact Measurement System - Technical Overview**

Based on my analysis of the VAI-DataSystem-PhaseTwo codebase, here's a comprehensive technical overview:

---

### **Core Components**

#### **1. Frontend (React + Vite)**

**Major Modules:**
- **Pages**: Home, Installation Selection, Survey, ThankYou, Login, SignUp, Dashboard
- **Components**: Navbar, Logo, SurveyQuestion
- **Utilities**: apiClient (Axios), firebaseConfig, AuthContext

**Key Architecture Elements:**
- **React Router DOM** (v7.4.1) for client-side routing with 7 main routes
- **AuthContext** provider pattern wrapping the entire application for centralized authentication state management
- **Axios interceptors** for automatic JWT token attachment to API requests
- **Chart.js** (v4.4.9) with chartjs-plugin-datalabels for data visualization in Dashboard
- **Firebase SDK** (v11.6.1) for client-side authentication
- **Hanken Grotesk** custom font loaded via @fontsource

**Survey Flow:**
- 13 survey questions stored in a static data file (`surveyQuestions.js`)
- Question types: multiple choice, checkboxes (multi-select), and range sliders (1-5 scales)
- Progressive single-question display with validation before advancing
- Local state management for survey responses before submission

#### **2. Backend (Python Flask)**

**Major Modules:**
- **`app/__init__.py`**: Flask app factory pattern with Firebase Admin SDK initialization
- **`app/routes.py`**: Blueprint-based REST API endpoints
- **`app/models.py`**: Data models for UserSignUp and SurveyResponse
- **`app/utils.py`**: Survey analysis utilities including SurveyAnalyzer class
- **`app/config.py`**: Environment-based configuration loading

**Key Classes & Functions:**
- **UserSignUp**: User registration model (firstName, lastName, email, password)
- **SurveyResponse**: Survey submission model (responses dict, installationId, submittedAt timestamp)
- **SurveyAnalyzer**: Comprehensive data analysis class with methods for:
  - Response counting and aggregation
  - Multiple choice question summarization
  - Numeric question statistics (mean, min, max, 95% confidence intervals)
  - CSV/Excel export functionality
  - Graph generation using Matplotlib (with Agg backend for headless environments)

**API Endpoints:**
- `GET /` - Health check
- `POST /submit-survey` - Submit survey responses to Firestore
- `POST /register-user` - Create new user in Firebase Auth + Firestore
- `POST /verify-token` - Verify Firebase ID token for authentication
- `GET /get-survey-responses` - Retrieve all survey responses
- `GET /generate-report` - Generate and download CSV + PDF visualizations as ZIP

**Security Features:**
- Firebase Admin SDK for server-side authentication
- Token verification on login
- CORS configured to allow specific frontend origin only
- Service account key authentication for Firestore access
- Password not stored in Firestore (only in Firebase Auth)

**Data Analysis Pipeline:**
- Load responses from Firestore
- Clean and flatten nested response structure
- Aggregate counts for categorical questions
- Calculate statistics for numeric Likert-scale questions
- Generate bar charts and pie charts (demographic questions)
- Export to PDF using matplotlib's PdfPages backend

---

### **Component Interactions**

#### **Data Flow:**

**Survey Submission Flow:**
```
User (Frontend) → Survey Page → apiClient → Flask Backend → Firebase Firestore
```
**Authentication Flow:**
```
Login Page → Firebase Client Auth → Get ID Token → Flask `/verify-token` → Store JWT in localStorage → AuthContext updates → Navigate to Dashboard
```
**Dashboard Data Flow:**
```
Dashboard Load → Check AuthContext → Fetch `/get-survey-responses` → Aggregate responses → Render Chart.js visualizations
```
**Report Generation Flow:**
```
Dashboard → `/generate-report` request → Load from Firestore → SurveyAnalyzer processes → Generate CSV + matplotlib graphs → Save to PDF → ZIP and return as blob → Download via browser
```
#### **Communication Methods:**
- **REST API**: JSON-based HTTP communication via Axios
- **Firebase Firestore**: NoSQL document database with collections:
  - `users` - User profile data
  - `surveyResponses` - Survey submission data
- **Firebase Authentication**: Client-side auth with backend token verification
- **LocalStorage**: Client-side persistence for JWT tokens, user data, and survey data

#### **Design Patterns:**
- **Factory Pattern**: Flask app creation via `create_app()`
- **Blueprint Pattern**: Modular route organization
- **Context Provider Pattern**: React AuthContext for global state
- **Interceptor Pattern**: Axios request interceptors for token injection
- **Repository Pattern**: Firestore as data persistence layer

---

### **Deployment Architecture**

#### **Build Steps:**

**Frontend (Vite):**
```bash
cd frontend
npm install
npm run dev       # Development server on localhost:5173
npm run build     # Production build to dist/
npm run preview   # Preview production build
```
**Backend (Flask):**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python3 run.py    # Development server on localhost:5000 (debug mode)
```
#### **External Dependencies:**

**Frontend:**
- Node.js and npm (package management)
- Vite 6.2.0 (build tool)
- Firebase project (authentication + Firestore)
- Environment variables via `.env` file (VITE_FIREBASE_* credentials, VITE_API_BASE_URL)

**Backend:**
- Python 3.x
- Flask 3.1.0 + Flask-CORS 5.0.1
- firebase-admin 6.8.0
- pandas 2.2.3, numpy 2.2.5, matplotlib 3.10.1 (data analysis)
- Service account JSON key file (`firebase_key.json`)
- Environment variables via `.env` file (FIREBASE_KEY_PATH, FRONTEND_URL)

#### **Infrastructure:**
- **Development**: Local development servers (Vite dev server + Flask debug server)
- **Database**: Google Cloud Firestore (NoSQL, managed service)
- **Authentication**: Firebase Authentication (managed service)
- **No containerization currently implemented** (no Docker files present)
- **Version Control**: Git/GitHub with `.github/pull_request_template.md`

#### **Security Configuration:**
- `.gitignore` properly configured to exclude:
  - `.env` files (both frontend and backend)
  - `firebase_key.json` (service account credentials)
  - `venv/` (Python virtual environment)
  - `__pycache__/` (Python bytecode)
  - `node_modules/` (implied by npm)

---

### **Runtime Behavior**

#### **Application Initialization:**

**Frontend:**
1. `main.jsx` renders `App.jsx` in StrictMode
2. `App.jsx` initializes with `useEffect` hook:
   - Checks localStorage for existing JWT token
   - If token exists, attempts to fetch survey data from backend
   - On success: sets authenticated state and loads user data
   - On failure: clears tokens and redirects to unauthenticated state
3. AuthContext wraps all routes, providing global state access
4. Router mounts appropriate page component based on URL path

**Backend:**
1. `run.py` calls `create_app()` factory function
2. Flask app initializes:
   - Loads Config from environment variables
   - Initializes Firebase Admin SDK with service account
   - Creates Firestore client and attaches to `app.db`
   - Registers CORS with frontend URL whitelist
   - Registers main Blueprint with all route handlers
3. Flask development server starts on port 5000 with debug mode

#### **Request/Response Handling:**

**Survey Submission:**
- Frontend collects responses in local state (answer object keyed by question ID)
- On final submit, POST request sent to `/submit-survey` with `installationId` and `responses`
- Backend validates, creates SurveyResponse model with UTC timestamp
- Saves to Firestore `surveyResponses` collection
- Returns 200 success or 400 error with message

**User Registration:**
- Frontend collects firstName, lastName, email, password
- POST to `/register-user`
- Backend creates user in Firebase Auth first (returns UID)
- Then stores user profile in Firestore `users` collection with UID as document ID
- Password never stored in Firestore (handled by Firebase Auth)

**Authentication:**
- User submits credentials on Login page
- Firebase client SDK (`signInWithEmailAndPassword`) authenticates user
- Receives ID token from Firebase
- Backend `/verify-token` endpoint validates token using Firebase Admin SDK
- Token and user data stored in localStorage
- All subsequent API requests include token via Axios interceptor

#### **Business Workflows:**

**Public Survey Workflow:**
1. User visits Home page
2. Clicks "Get Started" → Installation selection page
3. Selects one of two installations (Breathing Pavilion or Common Ground)
4. Redirected to Survey page with progressive question display
5. Answers 13 questions (demographics, behaviors, perceptions)
6. Submits survey → saved to Firestore
7. Redirected to ThankYou page

**Staff Dashboard Workflow:**
1. Staff member logs in via Login page
2. On successful authentication, navigated to Dashboard
3. Dashboard loads all survey responses from Firestore
4. Aggregates responses per question
5. Renders interactive Chart.js visualizations (pie, doughnut, or bar charts)
6. Staff can toggle chart types dynamically
7. Download button triggers report generation:
   - Backend aggregates all responses
   - Generates CSV summary with statistics
   - Creates PNG charts for each question
   - Compiles charts into PDF
   - Zips CSV + PDF and streams to client

#### **Error Handling:**
- Try-catch blocks around all async operations
- Frontend displays error messages to user via state-managed error components
- Backend returns appropriate HTTP status codes (400, 401, 500)
- Console logging for debugging in both frontend and backend
- Firebase errors caught and displayed as user-friendly messages

#### **Background Tasks:**
- No explicit background job processing
- Report generation happens synchronously on-demand (may block for large datasets)
- Chart rendering uses matplotlib with non-GUI 'Agg' backend for server environments

---

### **Notable Technical Decisions:**

1. **Firebase as Primary Database**: Firestore NoSQL chosen for real-time capabilities and managed infrastructure
2. **Separate Frontend/Backend**: Clear separation of concerns with RESTful API
3. **Client-Side Auth with Backend Verification**: Hybrid approach leveraging Firebase client SDK with server-side token validation
4. **Static Survey Questions**: Hardcoded in JavaScript rather than database-driven (easier initial deployment, less flexible)
5. **On-Demand Report Generation**: No pre-computed analytics, everything generated real-time
6. **Matplotlib for Server-Side Visualizations**: Chart.js for interactive browser charts, matplotlib for PDF exports
7. **Development-Focused Setup**: Debug mode enabled, no production deployment configuration present

---

This system provides a complete pipeline for collecting community feedback on public art installations, with secure staff access for data analysis and reporting. The architecture is straightforward, following standard web application patterns with modern tooling (Vite, React, Flask, Firebase).

* **Note:** The VAI repository already has a deployment‑ready mobile survey web app. The immediate priority is to design and build the admin dashboard to complement it  build the front-end.