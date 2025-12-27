# VAI DataSystem - Architecture Layers and Components

## System Architecture Overview

This document defines the architectural layers and components of the Van Alen Institute Community Engagement Data Platform, following standard n-tier architecture patterns. The system is organized into four primary layers: **Presentation Layer (HCI)**, **Business Logic Layer (Problem Domain)**, **Data Access Layer**, and **Data Persistence Layer**.

---

## Architecture Layer Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER (HCI)                     │
│                      "When and What"                            │
│         User Interface & User Experience Components            │
└─────────────────────────────────────────────────────────────────┘
                              ↓↑
┌─────────────────────────────────────────────────────────────────┐
│            BUSINESS LOGIC LAYER (Problem Domain)                │
│                    "Why and Whether"                            │
│         Application Logic & Business Rules Processing           │
└────────────────────────────────────────────────────__─────────────┘
                              ↓↑
┌─────────────────────────────────────────────────────────────────┐
│                     DATA ACCESS LAYER (DAM)                     │
│                      "Where and How"                            │
│   ┌─────────────────────┐   ┌──────────────────────────────┐  │
│   │ Physical            │   │  Data Management             │  │
│   │ Architecture        │   │  Components                  │  │
│   │ Package             │   │  Package                     │  │
│   └─────────────────────┘   └──────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓↑
┌─────────────────────────────────────────────────────────────────┐
│              DATA PERSISTENCE LAYER (Foundation)                │
│                  "Common Helpers Everywhere"                    │
│              Permanent Storage & Cloud Services                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. PRESENTATION LAYER (HCI)

**"When and What"** - Determines WHEN users interact and WHAT they see

### Responsibilities

* Display user interfaces for both mobile and desktop experiences
* Capture user input and interactions
* Send and receive data to/from Business Logic Layer
* Provide visual feedback and navigation
* Render data visualizations and analytics
* Manage client-side state and routing

### Components

#### 1.1 Mobile-Facing Web Application (Community Users)

**Technology**: React 19.1, Vite 6.0, React Router DOM 7

| Component | Purpose | User Interaction |
|-----------|---------|------------------|
| **Home Page** | Landing page with installation information and news | Browse installation details |
| **Installation Selection Page** | Visual interface to select which art installation was visited | Select installation (Breathing Pavilion or Common Ground) |
| **Survey Page** | Progressive 13-question survey form with validation | Answer demographic and experience questions |
| **Thank You Page** | Confirmation screen after successful survey submission | View confirmation message |
| **Survey Question Components** | Reusable UI for multiple choice, checkboxes, range sliders | Input responses to survey questions |
| **Navbar Component** | Navigation header with VAI logo | Navigate between pages |

#### 1.2 Admin Web Dashboard (VAI Staff Users)

**Technology**: React 19.1, Vite 6.0, Chart.js 4.4, Material UI

| Component | Purpose | User Interaction |
|-----------|---------|------------------|
| **Login Page** | Admin authentication interface | Enter @vai.org credentials |
| **SignUp Page** | Admin registration with domain validation | Create admin account |
| **Dashboard Page** | Analytics overview with KPI cards, charts, filters | View real-time analytics, apply filters |
| **Table View Page** | Detailed data table with sorting and filtering | Browse all survey responses in table format |
| **Event Manager Page** | Installation management with QR code generation | Manage installations, generate QR codes |
| **Documentation Page** | User guide and system documentation | Learn how to use the platform |
| **Settings Page** | Admin account settings (placeholder) | Configure admin preferences |
| **DashboardLayout Component** | Responsive sidebar navigation with VAI branding | Navigate dashboard sections, logout |
| **FilterPanel Component** | Installation and date filtering controls | Filter analytics by installation |
| **StatsCard Component** | KPI display cards (total responses, avg sentiment) | View key metrics |
| **TrendLineChart Component** | 7-day attendance trend visualization | View engagement trends over time |
| **InstallationComparisonChart** | Dual-axis bar chart comparing installations | Compare response counts and sentiment |
| **DailySummaryCharts Component** | Multiple chart types for survey questions | View demographic and question breakdowns |
| **DataTable Component** | Sortable, paginated data table | Sort and browse response data |
| **AdvancedAnalyticsModal Component** | Detailed analytics with chart type toggles | Deep-dive into demographics and survey answers |

#### 1.3 Frontend Utilities & State Management

**Technology**: React Context API, Axios

| Utility | Purpose |
|---------|---------|
| **AuthContext** | Global authentication state management across all pages |
| **APIClient (Axios)** | HTTP client with JWT token interceptors for API calls |
| **React Router** | Client-side navigation and routing |
| **firebaseConfig** | Firebase SDK configuration for client-side auth |
| **brandColors.js** | VAI brand color constants (#36C0FC primary) |
| **surveyQuestions.js** | Static survey question data (13 questions) |

---

## 2. BUSINESS LOGIC LAYER (Problem Domain)

**"Why and Whether"** - Determines WHY actions occur and WHETHER they're permitted

### Responsibilities

* Process information received from Presentation Layer
* Verify authentication credentials and manage user sessions
* Validate survey submissions and enforce business rules
* Aggregate and analyze survey data using statistical methods
* Generate reports and data exports
* Manage access control and authorization
* Interact with both Presentation Layer (above) and Data Access Layer (below)

### Components

#### 2.1 Flask API Services (Backend)

**Technology**: Python Flask 3.1, Flask-CORS, Firebase Admin SDK 6.8

| Service | API Endpoint | Purpose | Business Rules |
|---------|-------------|---------|----------------|
| **Health Check** | `GET /` | System health verification | Public endpoint, no auth required |
| **Survey Service** | `POST /submit-survey` | Receive and validate survey submissions | Validates JSON schema, adds timestamp, enforces required fields |
| **Authentication Service** | `POST /register-user` | Create new admin users | Validates @vai.org email domain, creates Firebase Auth user |
| **Token Verification Service** | `POST /verify-token` | Verify Firebase ID tokens for admin login | Validates JWT token, returns user info |
| **Analytics Service** | `GET /get-survey-responses` | Retrieve all survey responses for dashboard | Auth required, returns aggregated data |
| **Report Generation Service** | `GET /generate-report` | Generate CSV/PDF/ZIP export files | Auth required, processes data with SurveyAnalyzer |

#### 2.2 Business Logic Utilities

**Technology**: Python, Pandas 2.2, NumPy, Matplotlib 3.10

| Utility Class | Purpose | Methods |
|--------------|---------|---------|
| **SurveyAnalyzer** | Statistical processing and data aggregation | `get_response_count()`, `summarize_multiple_choice()`, `summarize_numeric_question()`, `calculate_confidence_interval()`, `export_summary_csv()`, `generate_graphs()`, `create_bar_chart()`, `create_pie_chart()` |
| **Data Validation** | Input sanitization and schema validation | Validates survey response format, checks for required fields |
| **Response Formatter** | Transform data for different output formats | Flatten nested Firestore responses, format for CSV/PDF |

#### 2.3 Data Models (Business Objects)

**Technology**: Python classes

| Model Class | Attributes | Purpose |
|-------------|-----------|---------|
| **UserSignUp** | `firstName`, `lastName`, `email`, `password` | Represents admin registration request, validates email domain |
| **SurveyResponse** | `installationId`, `responses` (dict), `submittedAt` (timestamp) | Represents single survey submission, calculates sentiment scores |
| **DownloadSurveyData** | `allResponses` (list) | Aggregates multiple responses for export processing |

---

## 3. DATA ACCESS LAYER (DAM)

**"Where and How"** - Determines WHERE data lives and HOW to reach external systems

This layer consists of two main packages: **Physical Architecture Package** and **Data Management Package**.

### 3.1 Physical Architecture Package

Responsible for communication between the system and outside world (internet, cloud services).

#### 3.1.1 Networking Components

**Technology**: HTTPS/TLS, CORS, Google Cloud Run, Vercel

| Component | Purpose | Configuration |
|-----------|---------|---------------|
| **HTTPS/TLS Encryption** | Secure communication between client and server | All API calls encrypted via HTTPS |
| **CORS Configuration** | Cross-origin security between Vercel frontend and GCR backend | Configured in Flask app to allow specific Vercel domain |
| **API Gateway** | Routes HTTP requests to backend Flask application | Google Cloud Run automatically provides API gateway |
| **Web Server** | Hosts Flask application backend | Google Cloud Run containerized deployment |
| **Static Web Host** | Hosts React frontend build output | Vercel serverless platform |
| **Load Balancer** | Distributes traffic across cloud instances | Google Cloud Run auto-scaling |
| **Firewall** | Network security rules | Google Cloud Platform firewall rules |

#### 3.1.2 Deployment & Hosting Infrastructure

**Technology**: Google Cloud Run (backend), Vercel (frontend)

| Infrastructure Component | Technology | Purpose |
|-------------------------|------------|---------|
| **Frontend Hosting** | Vercel (serverless) | Static React app deployment with automatic HTTPS |
| **Backend API Server** | Google Cloud Run | Containerized Flask app with auto-scaling |
| **CI/CD Pipeline** | Vercel Git integration, GCR Docker builds | Automatic deployment on code push |
| **Environment Configuration** | `.env` files, Google Cloud Secret Manager | Secure storage of API keys, Firebase credentials |

#### 3.1.3 Security Components

| Security Layer | Technology | Purpose |
|---------------|------------|---------|
| **JWT Token Management** | Firebase ID Tokens | Session-based authentication for admin users |
| **Domain Restriction** | Email validation | Restricts admin signup to @vai.org domain |
| **Service Account Authentication** | Firebase Admin SDK | Server-side authentication for Firestore access |
| **Password Security** | Firebase Authentication | Passwords never stored in Firestore (handled by Firebase Auth) |
| **CORS Origin Validation** | Flask-CORS | Prevents unauthorized cross-origin requests |

---

### 3.2 Data Management Package

Contains Database Access Management (DAM) components responsible for CRUD operations. Each DAM component maps to a collection/table in the Data Persistence Layer.

#### 3.2.1 Database Access Management (DAM) Components

**Pattern**: DAM Component → Firestore Collection → Cloud Database

Following the standard DAM pattern (similar to: Patient DAM → Patient Table → Cloud DB), the VAI system implements:

| DAM Component | Maps to Collection | Maps to Cloud Storage | CRUD Operations |
|--------------|-------------------|----------------------|-----------------|
| **Survey Response DAM** | `surveyResponses` collection | Firestore Cloud Database | Create (add new responses), Read (query all/filter by installation), Update (N/A - responses are immutable), Delete (N/A - audit trail required) |
| **User DAM** | `users` collection | Firestore Cloud Database | Create (new admin accounts), Read (user profiles), Update (lastLogin timestamp), Delete (deactivate users) |
| **Installation DAM** | `installations` collection | Firestore Cloud Database | Create (new installations), Read (installation details), Update (QR codes, metadata), Delete (mark inactive) |

**Data Flow**: Business Logic Layer → DAM Component → Firestore Collection → Cloud Database

#### 3.2.2 Firebase Integration Layer

**Technology**: Firebase Admin SDK 6.8 (server-side), Firebase SDK 11.6 (client-side)

| Component | Purpose | Used By |
|-----------|---------|---------|
| **Firebase Admin SDK** | Server-side Firebase operations (backend) | All DAM components for Firestore access |
| **Firestore Client** | NoSQL database operations | Provides `collection()`, `document()`, `add()`, `get()`, `set()`, `update()`, `delete()` methods to DAM components |
| **Firebase Auth Client** | User authentication management (frontend) | Presentation Layer for login/signup |
| **Firebase Authentication Service** | Identity platform (backend) | User DAM for account creation and verification |

#### 3.2.3 Helper Utilities

| Utility Component | Purpose | Operations |
|------------------|---------|------------|
| **FirestoreHelper** | Data transformation and export utilities | `load_responses_from_firestore()`, `clean_firestore_responses()`, `save_graphs_to_pdf()` |
| **Data Validator** | Schema validation for incoming data | Validates survey response structure, enforces required fields |
| **Response Serializer** | Convert between Python objects and Firestore documents | `to_dict()`, `from_dict()` methods for data models |

---

## 4. DATA PERSISTENCE LAYER (Foundation)

**"Common Helpers Everywhere"** - Permanent storage and shared resources

### Responsibilities

* Store permanent information persistently
* Provide cloud-based NoSQL database storage
* Manage user authentication credentials
* Store generated export files temporarily
* Maintain installation metadata and QR code information

### Components

#### 4.1 Firestore Cloud Database (Primary Storage)

**Technology**: Google Firestore (NoSQL), Firebase Cloud Platform

| Collection | Document Structure | Purpose |
|-----------|-------------------|---------|
| **`users`** | `{ uid, email, firstName, lastName, role, createdAt, lastLogin }` | Store admin user profiles |
| **`surveyResponses`** | `{ installationId, responses: { q1-q13 }, submittedAt }` | Store all community survey submissions |
| **`installations`** | `{ id, name, description, location, imageUrl, status, qrCodeUrl, createdAt }` | Store public art installation details |

#### 4.2 Firebase Authentication Database

**Technology**: Firebase Authentication (managed by Google)

| Data Store | Contents | Purpose |
|-----------|----------|---------|
| **Firebase Auth User Store** | Email, hashed password, UID, display name | Securely store admin credentials (managed by Firebase) |
| **Authentication Tokens** | JWT ID tokens, refresh tokens | Session management for admin users |

#### 4.3 Temporary File Storage

**Technology**: Local filesystem (backend server), in-memory processing

| File Type | Location | Purpose | Lifecycle |
|-----------|----------|---------|-----------|
| **CSV Export** | `backend/survey_summary.csv` | Aggregated survey data export | Generated on-demand, deleted after download |
| **PDF Visualizations** | `backend/survey_graphs/` → `visualizations.pdf` | Matplotlib chart exports | Generated on-demand, compiled into PDF |
| **ZIP Archive** | In-memory buffer | Combined CSV + PDF package | Generated on-demand, streamed to client |
| **QR Code Images** | Frontend public assets | Installation-specific QR codes | Static files for event management |

#### 4.4 Static Assets & Configuration

**Technology**: Git repository, environment variables

| Asset Type | Location | Purpose |
|-----------|----------|---------|
| **Survey Questions Data** | `frontend/src/data/surveyQuestions.js` | 13 survey questions with options and types |
| **Installation Images** | `frontend/public/` | Photos of Breathing Pavilion and Common Ground |
| **VAI Logo Images** | `frontend/public/` | Van Alen Institute branding assets |
| **Environment Variables** | `.env` files (not in Git) | Firebase credentials, API URLs, secret keys |
| **Firebase Service Account Key** | `backend/app/firebase_key.json` | Server-side Firebase authentication credentials |

---

## System Architecture Data Flow

### Community Survey Submission Flow

```
1. PRESENTATION LAYER (Mobile App)
   ↓ User selects installation and completes survey

2. BUSINESS LOGIC LAYER (Flask API)
   ↓ Validates data, adds timestamp, creates SurveyResponse object

3. DATA ACCESS LAYER (Firebase Admin SDK)
   ↓ Connects to Firestore, formats data for storage

4. DATA PERSISTENCE LAYER (Firestore Cloud)
   ↓ Stores survey response document with auto-generated ID
```

### Admin Analytics Retrieval Flow

```
1. PRESENTATION LAYER (Admin Dashboard)
   ↓ Admin logs in, views dashboard

2. BUSINESS LOGIC LAYER (Flask API)
   ↓ Verifies JWT token, queries responses, runs SurveyAnalyzer

3. DATA ACCESS LAYER (Firebase Admin SDK)
   ↓ Queries Firestore surveyResponses collection

4. DATA PERSISTENCE LAYER (Firestore Cloud)
   ↓ Returns all response documents

3. DATA ACCESS LAYER (FirestoreHelper)
   ↓ Cleans and flattens response data

2. BUSINESS LOGIC LAYER (SurveyAnalyzer)
   ↓ Aggregates counts, calculates statistics, formats for charts

1. PRESENTATION LAYER (Dashboard Charts)
   ↓ Renders visualizations with Chart.js
```

### Report Generation Flow

```
1. PRESENTATION LAYER (Dashboard)
   ↓ Admin clicks "Download Report"

2. BUSINESS LOGIC LAYER (Report Service)
   ↓ Fetches all responses, creates SurveyAnalyzer instance

3. DATA ACCESS LAYER (FirestoreHelper)
   ↓ Loads responses from Firestore

4. DATA PERSISTENCE LAYER (Firestore Cloud)
   ↓ Returns survey response documents

2. BUSINESS LOGIC LAYER (SurveyAnalyzer)
   ↓ Generates CSV, creates matplotlib charts, saves to PDF

4. DATA PERSISTENCE LAYER (Temporary Files)
   ↓ Stores CSV and PDF temporarily

2. BUSINESS LOGIC LAYER (ZIP Generator)
   ↓ Packages files into ZIP archive

1. PRESENTATION LAYER (Browser Download)
   ↓ User receives survey_report.zip
```

---

## Technology Stack Summary by Layer

| Layer | Frontend Technologies | Backend Technologies | Infrastructure |
|-------|---------------------|---------------------|----------------|
| **Presentation** | React 19.1, Vite 6.0, Chart.js 4.4, React Router DOM 7, Axios, Material UI | N/A | Vercel (static hosting) |
| **Business Logic** | N/A | Python Flask 3.1, Pandas 2.2, NumPy, Matplotlib 3.10, openpyxl 3.1 | Google Cloud Run |
| **Data Access** | Firebase SDK 11.6 (client auth) | Firebase Admin SDK 6.8, Flask-CORS | HTTPS/TLS, CORS, JWT |
| **Data Persistence** | N/A | N/A | Google Firestore (NoSQL), Firebase Authentication, Local filesystem |

---

## Key Architectural Decisions

### 1. **Layered Architecture Pattern**

* **Decision**: Implement strict separation of concerns with 4-tier architecture
* **Rationale**: Enables independent development of frontend/backend, easier testing, scalable maintenance
* **Impact**: Clear boundaries between UI, business logic, data access, and storage

### 2. **NoSQL Database (Firestore)**

* **Decision**: Use Firestore instead of relational SQL database
* **Rationale**: Flexible schema for survey responses, real-time capabilities, Firebase ecosystem integration
* **Impact**: Faster development, built-in scalability, simplified authentication

### 3. **Serverless Deployment**

* **Decision**: Deploy frontend to Vercel and backend to Google Cloud Run
* **Rationale**: Auto-scaling, pay-per-use pricing, zero infrastructure management, CI/CD integration
* **Impact**: Reduced operational costs, automatic HTTPS, global CDN distribution

### 4. **Stateless API with JWT**

* **Decision**: Use JWT tokens for session management (no server-side sessions)
* **Rationale**: Scalable across multiple backend instances, works with serverless architecture
* **Impact**: Each API request is independent, supports horizontal scaling

### 5. **Client-Side Routing (SPA)**

* **Decision**: React Router for single-page application navigation
* **Rationale**: Fast page transitions, improved user experience, reduced server load
* **Impact**: All routing handled in browser, only API calls hit backend

### 6. **Server-Side Analytics Processing**

* **Decision**: Pandas/NumPy processing in backend instead of client-side JavaScript
* **Rationale**: Complex statistical calculations, large dataset handling, PDF generation capability
* **Impact**: Reduced frontend bundle size, consistent data processing, advanced analytics possible

---

## Security Architecture

### Layer-by-Layer Security Measures

| Layer | Security Measure | Technology | Purpose |
|-------|-----------------|------------|---------|
| **Presentation** | Input validation | React form validation | Prevent invalid data submission |
| **Presentation** | HTTPS-only | Vercel automatic HTTPS | Encrypted data transmission |
| **Business Logic** | Domain validation | Python email regex | Restrict admin signup to @vai.org |
| **Business Logic** | JWT verification | Firebase Admin SDK | Authenticate API requests |
| **Business Logic** | CORS enforcement | Flask-CORS | Prevent unauthorized origins |
| **Data Access** | Service account auth | Firebase Admin SDK | Secure server-to-database connection |
| **Data Access** | Firestore security rules | Firebase console | Database-level access control |
| **Data Persistence** | Password hashing | Firebase Authentication | Never store plaintext passwords |
| **Data Persistence** | Encrypted storage | Google Cloud encryption | Data encrypted at rest |

---

## Scalability Considerations

### Horizontal Scaling Capabilities

| Component | Scaling Method | Limit | Cost Model |
|-----------|---------------|-------|------------|
| **Frontend (Vercel)** | Global CDN, edge caching | Unlimited page views | Free tier: 100GB bandwidth/month |
| **Backend (Google Cloud Run)** | Auto-scaling containers (0-100 instances) | Configurable max instances | Pay-per-request, idle = $0 |
| **Firestore Database** | Automatic sharding, multi-region | 1 million concurrent connections | $0.06/100K reads, $0.18/100K writes |
| **Firebase Authentication** | Managed service, auto-scaling | 10K sign-ins/day (free tier) | Free up to 50K MAU |

### Performance Optimizations

1. **Frontend**: Code splitting, lazy loading, React.memo for chart components
2. **Backend**: Pandas vectorized operations, matplotlib caching, gzip compression
3. **Database**: Firestore indexes for common queries, batch reads
4. **Network**: CDN for static assets, API response caching, HTTP/2

---

## Deployment Architecture Diagram (ASCII)

```
┌─────────────────────────────────────────────────────────────────┐
│                         INTERNET USERS                          │
│                  (Community Members & VAI Admins)               │
└────────────┬────────────────────────────────────┬───────────────┘
             │                                    │
             │ HTTPS                              │ HTTPS
             ↓                                    ↓
┌─────────────────────────┐          ┌─────────────────────────────┐
│   VERCEL CDN (Global)   │          │  VERCEL CDN (Global)        │
│   Mobile Survey App     │          │  Admin Dashboard            │
│   (React SPA)           │          │  (React SPA)                │
└────────────┬────────────┘          └─────────────┬───────────────┘
             │                                      │
             │ API Calls (HTTPS)                    │ API Calls (HTTPS)
             └──────────────┬───────────────────────┘
                            │
                            ↓
              ┌─────────────────────────────┐
              │  GOOGLE CLOUD RUN           │
              │  Flask Backend API          │
              │  (Auto-scaling containers)  │
              │                             │
              │  - POST /submit-survey      │
              │  - GET /get-survey-responses│
              │  - POST /verify-token       │
              │  - GET /generate-report     │
              └─────────────┬───────────────┘
                            │
                            │ Firebase Admin SDK
                            ↓
              ┌─────────────────────────────┐
              │  FIREBASE CLOUD PLATFORM    │
              │                             │
              │  ┌────────────────────────┐ │
              │  │ Firestore Database     │ │
              │  │ (NoSQL Cloud)          │ │
              │  │                        │ │
              │  │ • users collection     │ │
              │  │ • surveyResponses      │ │
              │  │ • installations        │ │
              │  └────────────────────────┘ │
              │                             │
              │  ┌────────────────────────┐ │
              │  │ Firebase Authentication│ │
              │  │ (Identity Platform)    │ │
              │  └────────────────────────┘ │
              └─────────────────────────────┘
```

---

## Layer Interaction Rules

### Permitted Interactions

✅ **Presentation Layer** → **Business Logic Layer**

* Frontend pages call Flask API endpoints
* React components use APIClient (Axios) for HTTP requests

✅ **Business Logic Layer** → **Data Access Layer**

* Flask routes use Firebase Admin SDK
* SurveyAnalyzer uses FirestoreHelper utilities

✅ **Data Access Layer** → **Data Persistence Layer**

* Firebase Admin SDK connects to Firestore
* Firestore Client performs CRUD operations

### Prohibited Interactions (Architectural Violations)

❌ **Presentation Layer** → **Data Persistence Layer** (SKIP Business Logic)

* Frontend should NEVER directly access Firestore
* All database operations must go through Flask API

❌ **Presentation Layer** → **Data Access Layer** (SKIP Business Logic)

* Frontend Firebase SDK only for client-side auth
* No direct Firestore queries from React components

❌ **Business Logic Layer** → **Data Persistence Layer** (SKIP Data Access)

* Flask routes should use Firebase Admin SDK abstractions
* No raw database connections in route handlers

---

## Summary

The VAI DataSystem follows a **4-tier architecture pattern** with clear separation of concerns:

1. **Presentation Layer**: React frontend (mobile survey app + admin dashboard) deployed on Vercel
2. **Business Logic Layer**: Python Flask API with analytics processing deployed on Google Cloud Run
3. **Data Access Layer**: Firebase integration (Admin SDK, Auth, Firestore Client) with networking/security
4. **Data Persistence Layer**: Firestore NoSQL database, Firebase Authentication, temporary file storage

This architecture enables:

* **Scalability**: Serverless deployment auto-scales with demand
* **Maintainability**: Clear layer boundaries simplify debugging and enhancements
* **Security**: Multiple security layers (HTTPS, JWT, CORS, domain validation, encrypted storage)
* **Performance**: CDN distribution, efficient data processing, optimized queries
* **Developer Productivity**: Independent frontend/backend development, hot reload, CI/CD automation

---

**Document Version**: 1.0
**Last Updated**: November 15, 2025
**Repository**: [BreatheRight/VAI-DataSystem-PhaseTwo](https://github.com/BreatheRight/VAI-DataSystem-PhaseTwo)
**Active Working Branch**: ExecutionPhaseSprint
**Contact**: Phase Two Development Team
