# Community Engagement Data System

### CIS 5800 EMWA - Team 6

### Sprint 5 Deliverable

### 12/15/25

***

- ## Table of Contents

1. Executive Summary
2. Project Overview
3. Objectives & Accomplishments
    - Primary Objectives
    - Key Achievements
4. System Architecture & Component Status
    - System Overview
    - Component Development Status (Product Backlog)
    - System Diagrams & Flow
5. Quality Assurance & Best Practices
    - Risk Register
    - Testing
6. Change Managemen
    - Handoff Planning
    - Respository Transition Strategy
    - Future Roadmap
7.. Appendix
    - Full Component Status List
    - Full Technology Stack List
    - Wireframes & Demos
7. References

***

## Executive Summary

Van Alen Institute (VAI) is a Brooklyn-based nonprofit advancing equitable cities through community-led, inclusive design, with a vision of shifting power toward community decision-making. This project directly supports VAI’s ongoing organizational evolution through web engineering, data collection, and business insights. The goal is to consolidate the current feedback collection system with an accessible, user-centered, mobile-first engagement system that is complemented by an interactive user insights platform for use by admins and executives.

By highlighting residents’ voices and dutifully aggregating their input, the new system provides data driven understanding of the efficacy of VAI’s initiatives while building trust with community members, and elevating strategic decision making. Moreover, the data system will complement VAI's core competency in delivering narrative driven impact reports. The project then carries significant potential for VAI to leverage its globe-spanning network of over 500 dedicated partners and create value for them in the form of improved trust and transparency. By providing robust qualitative project impact evidence, the process of sourcing grant funding and partnership retention will increase by at least 10-15%.

*Transparency, Accountability, Personalized Engagement, Data-Driven Decision Making, Stronger Narratives, Enhanced Partnerships, Better Donor Retention and Acquisition, and Increased Contributions*

Upon project completion, Van Alen Institute will have:

1. A cross platform mobile application for iOS and Android that functions as a community-engagement platform. Proposed core features include user data collection (questionnaires, surveys), QR functionality, and a modern user interface consistent with VAI’s brand design philosophy.

2. An insights dashboard in the form of an interactive web-based GUI interface.
Proof of Concept Scope Basline core features include:
Executive Snapshots: live KPIs (responses, completion rate, sentiment).
Event Manager: Create, modify, delete events; set QR’s for survey access.
Survey Creation Suite: A drag-n-drop, Adobe/Figma inspired UI for creating and testing surveys - in realtime. Features include dynamic survey preview sandbox, a design assets shared team library, ability to upload images for team use, simple query builder with a two mouse-click process for question type selection (NPS, Likert, Free Text, Multiple Choice), and question addition. survey flow control (skip logic, required questions).

3. Analytics & Reporting: The collected data can be filtered by project/place/time/device/attendeeID. Interactive visualizations to aid in understanding user engagement
    Data visualizations, charts, and raw data can be exported in multiple formats (CSV, JSON, PDF, MD).

These deliverables ultimately compose a suite consisting of a BIS with a TPS capture layer (iOS/Android + admin web app). The iOS browser based web app functions as the TPS for capturing survey events, and the web admin dashboard delivers the BIS analytics and executive insights.

***

## Project Overview

### Team Mission

Our team’s mission for Phase Two is to reproduce and validate the proof of concept to fully understand the existing functionality, develop a production-ready admin dashboard with analytics, filtering, and export capabilities, enhance the mobile-facing survey application, establish scalable cloud infrastructure for deployment and long-term maintenance, and create comprehensive documentation that will guide future development teams.

> **Internal Note:** Remove the table for the diagrams, testing table remove, keep coding best practices, then new section “Change(Transition) Management" which has deployment considerations and repository transition strategy, hand-off, then new section “Project Management” which has Risk Register and Questions, Follow Up and Action Items. Remove project work plan. Lastly, a Transitional Checklist. Then finally appendix with enhanced wireframes or planned brand-consistent design for UI/UX.

### Project Objectives Recap

**Primary Objective**: Develop a functional, scalable data platform that enables VAI staff to:

1. Collect real-time survey responses from community members at public art installations
2. Analyze engagement metrics and sentiment trends across demographics
3. Generate reports for grant applications, board presentations, and partner organizations
4. Manage events and installations with QR code distribution for frictionless survey access

**Secondary Objective**: Set up our successor team (next semester) with:

- Clean, documented codebase following modern software engineering practices
- Comprehensive setup and deployment guides
- Clear roadmap of remaining features and enhancements
- Established testing and quality assurance processes

***

### Key Achievements

*During the 4-week Sprint 5 (October 20 - November 14, 2025), our team successfully*:

- **Deployed working prototypes** of both mobile survey app and admin dashboard.
- **Implemented 25+ features** including advanced analytics, data visualization, event management, and export functionality.
- **Migrated to Google Cloud Run** for scalable, production-ready backend infrastructure.
- **Conducted live demonstration** with generated test data simulating 34 community survey responses.
- **Established CI/CD foundation** for Vercel (frontend) and Google Cloud Run (backend).
- **Documented comprehensive system architecture** for stakeholder and developer handoff.

***

## System Development & Engineering Deliverables

### Product Backlog

The following table represents our revised Product Backlog, organized by system components and updated with actual implementation status as of November 16th, 2025.

### Product Backlog

The following table represents our revised Product Backlog, organized by system components and updated with actual implementation status as of November 16th, 2025.

| PMP ID | POC Ref. | Feature / Requirement | Sub-Module | Task / Deliverable | Priority | Status |
| :---: | :---: | :--- | :--- | :--- | :---: | :---: |
| 1 | POC ID 1; Wireframe p.12 | Survey Form | Mobile App -TPS | Render a responsive, mobile-first survey form. | High | **Complete** |
| 2 | POC Survey Qs p.5-6; POC ID 3 | Survey Content |  | Ensure survey questions align with VAI's approved metrics. | High | **Completed** |
| 3 | POC Diagram p.8, 10 | QR Code Generation & Access |  | Implement QR code routing to link directly to the correct survey. | High | **In Progress** |
| 4 | POC ID 8; Wireframe p.11 | Admin Authentication | Admin Dashboard - Business Intelligence System | Implement a secure login for VAI staff (e.g., @vai.org domain). | High | **Completed** |
| 5 | POC p.8 (Use Case); p.11 | Reporting |  | Create a "Download Report" function (CSV, JSON, PDF). | Medium | **Completed** |
| 6 | POC p.16-24 (Tech Stack) | API | Epic Set: Backend & API | Develop a RESTful Flask API for survey CRUD operations. | High | **Completed** |
| 7 | POC ID 7; p.17 (DB Setup) | Database |  | Ensure survey submissions are stored securely in Firestore. | High | **Completed** |
| 8 | POC ID 8; p.18, 20, 24 | Security |  | Restrict all Firebase rules and API routes to auth'd users. | High | **Completed** |
| 9 | POC p.14 (Q.3); p.25-27 | UI/UX Design | Epic Set: Project & Documentation | Ensure interface meets WCAG accessibility & VAI branding. | **High** | **In Progress** |
| 10 | POC p.23 (Deployment) | CI/CD Pipeline |  | Automate deployment via Vercel and Render. | Medium | **Planned** |
| 11 | POC p.16-24 (Setup) | Documentation |  | Create/update setup, rollback, and .env documentation. | Medium | **Planned** |
| 12 | POC p.15 (Q.5) | Accessibility |  | Implement scaffolding for English/Spanish multilingual support. | Medium | **Planned** |
| 13 | POC p.24 (Rollback) | Database Backup |  | Configure daily automated backups of the Firestore database. | Medium | **Planned\*** |
| 14 | POC ID 9 | Data Filtering |  | Allow admins to tag and filter responses by project/event name. | High | **Completed** |
| 15 | VAI Comments | User Feedback |  | Add an optional open-ended "comments" question at the end. | Medium | **In progress** |
| 16 | POC Wireframe p.12 | Submission Validation |  | Provide a confirmation screen ("Thank You") after submission. Responses stored in Firestore as JSON. | High | **Completed** |
| 17 | POC ID 8; p.14 (Q.1) | Access Control |  | Implement role-based access (e.g., Admin vs. Analyst). | Medium | **Deferred\*** |
| 18 | POC Wireframe p.11, 26 | Data Visualization |  | Visualize sentiment trends over time across installations. | High | **Completed** |
| 19 | VAI Comments | Testing |  | Create a script to populate the database with mock survey data. | Medium | **Completed** |
| 20 | VAI Comments | Auditing |  | Implement audit logging for all admin actions and data changes. | Low | **Deferred\*** |
| 21 | VAI Comments | Data Policy |  | Define data retention and privacy policies. | Medium | **Planned** |
| 22 | US-21/US-22 | Deployment Configuration | Backend & DevOps | Configure CORS for deployed frontend/backend and create backend deployment configuration for Google Cloud Run. | Medium | **Completed** |
| 23 | VAI Comments | Reporting |  | Automate monthly analytics summary email. | Low | **Planned** |
| 24 | VAI Comments | Survey Management |  | Create a UI for VAI admins to manage survey content (CRUD). | High | **Planned** |
| 25 | VAI Comments | Event Management |  | Create a UI for VAI admins to manage events (CRUD). | High | **In Progress** |
| 26 | POC p. 18 (DB Setup) | Backend |  | Deploy Flask API backend to Google Cloud Run. | High | **Completed** |
| 27 | POC ID 9 | Data Filtering |  | Allow admins to filter analytics by site, time, and device. | Medium | **In Progress** |
| 28 | US-05 | Gap Analysis & Prioritization | Documentation | Produce gap analysis report and prioritization matrix for POC issues, bugs, and missing features. | Medium | **Completed** |
| 29 | US-23 | Branding Integration | UI/UX Design | Apply VAI branding across admin dashboard: fonts, colors, visual consistency, and digital ecosystem alignment. | Medium | **In Progress** |
| 30 | US-24 | Enhanced UI/UX | UI/UX Design | Improve admin dashboard usability with better navigation, layout, and data presentation. | Medium | **Planned**\* |
| 31 | US-25 | Mobile Responsiveness | UI/UX Design | Ensure admin dashboard is fully responsive on mobile and tablet devices. | Medium | **Deferred**\* |
| 32 | US-26 | User Onboarding | Documentation | Create user onboarding guide and tutorial videos for VAI staff. | Low | **Completed** |
| 33 | US-27 | Performance Optimization | Backend & API | Optimize backend API for faster response times and reduced latency. | Medium | **Planned**\* |
| 34 | Sprint 5 | Session Infrastructure | Backend & Analytics | Implemented User Sessions infrastructure integrated with Firestore indexes for supplementary data capture. | Medium | **In Progress** |
| 35 | Sprint 4 | Installation Management | Backend/Event Management | Migrated hardcoded installations to Firestore with full CRUD support enabling admin users to manage installation records. | High | **Completed** |
| 36 | Sprint 5 | Installation Expansion | Event Management | Added Los Circulos installation entry and integrated it into the active survey pipeline. | Medium | **Completed** |
| 37 | Sprint 5 | Integration Testing | Testing | Validated Los Circulos installation integration through manual survey submissions and seeded test data. | Medium | **Completed** |
| 38 | Sprint 5 | Real-Time Analytics | Dashboard | Confirmed new installation responses render in charts, tables, and KPI metrics in real time. | Medium | **Completed** |
| 39 | Sprint 4 | DevOps Documentation | Backend/DevOps | Documented DevOps patterns including error handling, fallback strategies, and live server stability practices. | Medium | **In Progress** |
| 40 | Sprint 4 | Survey UI Fix | Frontend | Resolved Likert scale rendering issues in the stacked cards survey interface. | High | **Completed** |
| 41 | Sprint 5 | Question Expansion | Survey Backend | Expanded question databank with 17 new questions informed by Washington D.C. and Philadelphia nonprofit CX frameworks. | Medium | **Completed** |
| 42 | Sprint 5 | Question Type Support | Survey Backend | Implemented Free Text question format type for open-ended survey responses. | Medium | **Completed** |
| 43 | Sprint 5 | Data Recovery | DevOps | Configured point-in-time Firestore recovery snapshot prior to installation migration. | High | **Completed** |
| 44 | Sprint 4 | Firebase Configuration | Backend | Resolved Firebase configuration issues encountered during cloud deployment. | Medium | **Completed** |
| 45 | Sprint 5 | Installation Fetching | Frontend | Enhanced EventManager to fetch installations from API and maintain component state. | Medium | **Completed** |
| 46 | Sprint 5 | Design System | Frontend | Used re-usable components and consistent styling for UI elements. | Medium | **In Progress** |
| 47 | Sprint 5 | URL Utilities | Frontend | Created slug utility functions for URL management and validation. | Low | **Completed** |
| 48 | Sprint 5 | Login Testing | Frontend | Implemented Login page component tests to validate form rendering and behavior. | Low | **Completed** |
| 49 | Sprint 5 | TypeScript Configuration | Frontend | Introduced jsconfig to enable improved TypeScript language support across the frontend codebase. | Low | **Completed** |
| 50 | Sprint 5 | Utility Scripts | Full Stack | Added Python and JSX utility scripts for testing, quality control, and database seeding. | Medium | **Completed** |
| 51 | Sprint 5 | Local CI/CD Configuration | DevOps | Created local device workflow YAML configuration for streamlined IDE setup and virtual environment initialization. | Medium | **Completed** |
| 52 | Sprint 5 | Handoff Documentation | Documentation | Delivered comprehensive setup and deployment documentation for future development teams. | Medium | **Completed** |
| 53 | Sprint 5 | QA Process | Project | Established testing and quality assurance processes for both frontend and backend applications. | Medium | **In Progress** |
| 54 | Sprint 5 | CX Planning Framework | Product Strategy | Initiated long-term CX planning infrastructure via User Personas component and visitor session tracking strategy. | Medium | **Completed** |
| 55 | Sprint 5 | Mobile Survey UX | Frontend | Implemented responsive mobile interface with swipe gesture support for improved survey interaction on small viewports. | High | **Completed** |
| 56 | Sprint 5 | Analytics Feature Plan | Charts | Chart Type Toggle | Medium | **Completed** |
| 57 | Sprint 5 | Analytics Feature Plan | Charts | QR Code Generation | Medium | **Completed** |

*Items marked with \* will be prioritized in the Forward Backlog for future development teams.*

## System Design

To build on the Proof of Concept’s high-level use case and activity diagrams, our architectural design documentation grouped related user stories into comprehensive functional domains (Survey Submission, Authentication, Analytics, Reporting, and System Architecture) and created diagrams that represent the end-to-end flow and internal structure of the system as a whole. This approach provides complete story coverage while giving a detailed architectural view of how the VAI’s data system operates across the mobile survey app, backend API, Firestore database, and admin dashboard.

The following Use Case, Activity, Class, ERD, and System Architecture diagrams compose document the full set of features delivered in Sprints 1–3, including QR-based survey intake, community response submission, admin authentication, KPI dashboard analytics, CSV/PDF report generation, and event/installation management.

### Technology Stack

- **Frontend**: React 19.1 with Vite 6.0 build tool, Material UI components
- **Backend**: Python Flask 3.1 with Firebase Admin SDK 6.8
- **Database**: Google Firestore (NoSQL cloud database)
- **Authentication**: Firebase Authentication with email/password and domain restrictions
- **Deployment**:
  - Frontend: Vercel (serverless deployment platform)
  - Backend: Google Cloud Run (containerized serverless platform)
- **Data Visualization**: Chart.js 4.4 with datalabels plugin
- **Data Analysis**: Python pandas 2.2, matplotlib 3.10, openpyxl 3.1

### System Diagrams and Flows

## ALL EIGHT DIAGRAMS ARE LOCATED IN /docs/handoff FOLDER AS .png FILES

- NOTE: (Replacing Images Due to Markdown Limitations; diagrams available as .png in /docs/handoff folder)

**Diagram Type & Name:** POC Use Case Diagram - Admin
- **Description:** High-level overview of core admin processes.
- **Sprint User Stories Covered:** US-11, 12, 13, 16, 17 & Backlog No. 4,6,18,23,27
- **Backlog/Epic:** Admin auth, analytics, report download

**Diagram Type & Name:** POC Use Case Diagram - Community User
- **Description:** High-level overview of core user processes.
- **Sprint User Stories Covered:** US-06, 07, 08, 10 & Backlog No. 1,2,3,15,16
- **Backlog/Epic:** QR Scan, Survey Submission, Answer Questions, Mobile/API

**Diagram Type & Name:** POC Activity Diagram - Admin
- **Description:** High-level overview of purpose for dashboard. Illustrates the workflow: Login -> Overview -> Analytics -> Export workflow.
- **Sprint User Stories Covered:** US-12, 13, 16, 17 & Backlog No. 5,18,23
- **Backlog/Epic:** Login-> Overview -> Analytics -> Export workflow. Admin/Security

**Diagram Type & Name:** POC Activity Diagram - Community User
- **Description:** High-level overview of survey-taking workflow. Steps include: Start Survey, Scan QR, Input URL, Answer Questions, Submit.
- **Sprint User Stories Covered:** US-06, 07, 08, & Backlog No. 1,2,16
- **Backlog/Epic:** Start Survey, Scan QR, Input URL, Answer Questions, Submit

*These are the original POC high-level use case and activity diagrams which capture the core processes an art installation attendee and an admin would be able to accomplish. They are still accurate, therefore are included for reference here. Additional diagrams created during Sprint 5, as well as POC diagrams, are elucidateded below. Full resolution diagrams are available in the /docs/handoff folder.*

**Diagram Type & Name:** Use Case Diagram - User and Admin
- **Description:** Expanded Use Case diagram that contributes Sprint 5-specific tasks for a technical, comprehensive view of user processes.
- **Sprint User Stories Covered:** The diagram has embedded the US and backlog items.
- **Backlog/Epic:** Admin auth, Report download - QR Scan, Survey Submission, Answer Questions, Mobile / API

### ERD Summary

The Entity Relationship Diagram defines how survey, installation, user, and analytics data are structured in Firestore. It outlines the relationships between core entities such as Installations, Survey Versions, Questions, Responses, and Exports, creating the data model that powers the entire VAI Community Engagement System. This schema ensures accurate data capture, supports multilingual functionality, enables real-time analytics, and provides the foundation for exporting reports in formats such as CSV and PDF.

#### Entity Relationship Diagram - Survey Responses (Firebase)

**Description:** This ERD covers the following epic feature sets: Security Implementation, Database Implementation, Multilingual Support, Process Data for Analytics, Data Visualization, Survey filtered by Installation.

Entity-Relationship Diagram (ERD) is the formalized data schema—specifically for our Google Firestore NoSQL database—that underpins the entire Community Engagement Data System. This model is critical because it dictates how data is structured and ensures the reliable execution of key platform functionalities. By clearly defining the relationships between core entities like Installation and Survey Responses (including attributes such as id, title, and location), this model successfully enables the business logic layer to perform real-time data aggregation and analysis. This structure directly supports the admin dashboard's capabilities, facilitating instant data filtering, the visualization of sentiment trends, and the generation of required reports in formats like CSV and PDF. Furthermore, this foundation is engineered for scalability, making it possible to integrate planned future enhancements such as A/B testing of survey versions and multilingual support without requiring a core architectural overhaul.

### Data System Architecture Summary

The VAI Data System Architecture illustrates how the platform is organized into four coordinated layers that work together to deliver secure survey collection, analytics, and administrative control. The presentation layer provides the user-facing web interfaces, while the business logic layer handles validation, analytics, and application workflows. These processes rely on the data access layer, which manages communication between the backend API and Firebase services, and the data foundation layer, where all persistent survey, user, and installation data is stored. This layered structure ensures scalability, reliable data flow, and a clear separation of responsibilities across the system.

### Data System Architecture Detailed Explanation

We modeled VAI’s data system as a traditional 4-tier architecture pattern that consists of a presentation layer (HCI) layer, a business logic (problem domain) layer, a data access layer, and the persistent data storage layer. This is a high-level overview, and the surgical, technical version may be reviewed in this deliverable’s appendix.

1. **Presentation Layer**: React frontend deployed on Vercel; components include home page, survey page, questions component, navbar, signup page, event manager page, datatable, and so forth.
2. **Business Logic Layer**: Processes information received from the presentation layer via the Data Access Layer’s Python Flask API with analytics processing via Google Cloud Run. The components that reside in this layer handle negotiation between the user-facing presentation layer and physical architecture in order to accomplish all required business processes – this includes survey analysis (data aggregation, statistics), data validation, user sign-up requests, email domain validation, and downloading survey data.
3. **Data Access Layer**: Determines where data lives and how components in our system reach other external systems.
    1. *Physical Architecture Package*: Responsible for communication between system and outside world (internet, cloud provider services). Networking components include CORS configuration, HTTPS encryption, API gateway to Flask, Firebase/GoogleCloudRun firewalls, and static hosting of our web apps. DeFirebase integration (Admin SDK, Auth, Firestore Client) with networking/security.
4. **Data Persistence Layer**: Firestore NoSQL database, Firebase Authentication, temporary file storage

### Diagram Summary Table

| Diagram Type & Name | Sprint User Stories Covered | Backlog/Epic | Notes |
| :---: | :---: | :---: | :---: |
| Sequence/Swimlane Diagram - System-Wide, Granular | US-01–>20 All sprint backlog items covered. | Full system flow end-to-end; from user accessing app, submitting to firestore capture to admin login, analytics, and export via table view, and manage events | Master diagram that serves as an accurate, frame by frame documentation of the entire system. |
| Entity Relationship Diagram - Survey Responses | US 11, 14, 06, 09, 08, 10, 07, 12, 17, | Security Implementation, database implementation, Multilingual Support, Process Data for Analytics, Data Visualization, Survey filtered by Installation | Installation attributes ‘id’, ‘title’, and ‘location’ drive admin selection UI, and QR-deep link. Survey Version for A/B testing iteration (Planned Sprint 4). Data capture points in JSON, processing and displaying exportable CSV/PDF |
| Component – Layered Architecture | All sprints (1–3) | Four layered OO system architecture diagram. | |

## Quality Control & Testing

| Test ID | User Story ID | Test Title | Expected Result | Test Type | Status Pass/Fail | Tester Name | Test Date | Sprint |
| :---: | :---: | :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| T-001 | US-07 | Survey Question Validation | Required questions must be answered before proceeding | Unit Test | Pass | Vitaliy | Nov 8, 2025 | Sprint 2 |
| T-002 | US-07 | Survey Progress Indicator | Progress bar updates correctly as user moves through survey | Functional Test | Fail | Denia | Nov 8, 2025 | Sprint 2 |
| T-003 | US-11 | Domain Restriction Validation | <Non-@vai.org> emails are rejected during signup | Functional Test | Pass | Bukola | Nov 10, 2025 | Sprint 3 |
| T-004 | US-10 | Mock Data Generation Script | Script generates 30+ realistic survey responses | Functional Test | Pass | Vitaliy | Nov 9, 2025 | Sprint 2 |
| T-005 | US-12 | Dashboard KPI Calculation | KPIs (sentiment, counts, totals) calculate and display correctly | Integration Test | Pass | Wylie | Nov 11, 2025 | Sprint 3 |
| T-006 | US-14 | Data Filtering by Installation | Admin can filter responses by installation name and date range without errors | Functional Test | Pass | Vitaliy | Nov 12, 2025 | Sprint 3 |
| T-007 | US-18 | Sentiment Trend Visualization | Chart.js renders sentiment trend graph accurately with no missing data points | System Test | Pass | Wylie | Nov 13, 2025 | Sprint 3 |
| T-008 | US-21 | Backend CORS Configuration | Frontend and backend communicate successfully with no CORS errors | Integration Test | Fail | Wylie | Nov 14, 2025 | Sprint 3 |
| T-009 | US-05 | Repository Documentation Consistency Check | All documentation files (README, SysArch, Changelog) are correctly linked and updated | User Acceptance Test (UAT) | Pass | Jadon | Nov 15, 2025 | Sprint 3 |
| T-010 | US-23 | Monthly Analytics Export (CSV/PDF) | System generates complete CSV and PDF reports without formatting errors | Functional Test | Pass | Vitaliy | Nov 16, 2025 | Sprint 3 |

### Technical Debt & Known Issues

| Issue ID | Description | Severity | Recommended Resolution |
| :---: | :---: | :---: | :---: |
| TD-01 | Firestore security rules allow read/write for authenticated users; need granular permissions | High | Implement role-based Firestore rules based on user.role field |
| TD-02 | Frontend environment variables duplicated across .env and Vercel dashboard | Low | Automate env sync with Vercel CLI or GitHub Actions |
| TD-03 | CSV export includes raw response IDs; not user-friendly for non-technical staff | Low | Add column headers and formatted data in CSV export |
| TD-04 | No automated backup configured for Firestore database | High | Set up daily automated exports to Google Cloud Storage |

### Codebase & Repository (**NEEDS UPDATING WITH LATEST DOCUMENTATION**)

- **Primary Repository:** [https://github.com/BreatheRight/VAI-DataSystem-PhaseTwo](https://github.com/BreatheRight/VAI-DataSystem-PhaseTwo)
- **Live Demo Branch:** ExecutionPhaseTwo
- **Frontend:** Vercel (URL available in repository README)
- **Backend:** Google Cloud Run (URL available in repository README)

| Document | Location | Purpose |
| :---: | :---: | :---: |
| **README.md** | Root directory | Project overview, setup instructions, tech stack |
| **Phase-Two-ChangeLog.md** | Root directory | Feature-by-feature development log with line counts |
| **PRE-DEMO-CHECKLIST.md** | Root directory | Pre-launch checklist for demonstrations (**KEEP ONLY IF A RE-USABLE**) |

## Coding Standards & Best Practices

Our codebase follows industry-standard practices:

**Frontend (React)**:

- Component-based architecture with functional components and hooks
- Consistent file naming: PascalCase for components, camelCase for utilities
- Centralized state management with React Context (AuthContext)
- Axios interceptors for JWT validation
- Material UI theming for industry standard component styling and design consistency as base
- TailwindCSS theming used for Landing Page & Survey App for customized, responsive UI UX. Infrastructure for TailwindCSS migration in place - team together with stakeholders decides their preffered stack after review.
- Typescript Refactoring: All componenets use consistent JSX. Team 1 reccomended TS; we created the migration infrastructure. Additionally, a Typescript based dashboard was created, but refactoring halted due to time constraints. Codebase has TS migration files+utils in repository's /docs folder.

**Backend (Python Flask)**:

- Blueprint-based modular routing
- Separation of concerns: routes, models, utilities, config
- Type hints where applicable
- Environment-based configuration with python-dotenv
- Firebase Admin SDK for server-side security

**Version Control**:

- Commit often, always include a commit message
- Feature branch workflow (main → Proto → ProtoLiveTemp (rapid iteration branch) → ExecutionPhase (Sprint 3 dedicated branch))
- .gitignore properly configured to exclude .env and firebase_key.json
- Vercel for instant deployment rollback

### Deployment Documentation

See **README.md(?)** for comprehensive deployment guides covering:

- Local development setup (Windows and macOS)
- Google Cloud Run backend deployment
- Vercel frontend deployment
- CORS configuration for cross-origin requests
- Environment variable management

## Repository Transition Strategy

### Current State

- **Our team’s repository:** [BreatheRight/VAI-DataSystem-PhaseTwo](https://github.com/BreatheRight/VAI-DataSystem-PhaseTwo)
- **Original POC Repository:** [iden-a/VAI-DataSystem](https://github.com/iden-a/VAI-DataSystem)

During the Sprint 5, the system grew significantly beyond the scope and architecture of the original POC. The codebase now includes a production-ready backend deployed on Google Cloud Run, a mobile facing web application deployed on Vercel, new analytics capabilities, expanded survey flow logic, and fully updated documentation. For long-term sustainability, we evaluated two hand-off options.

### Hand-off Options Considered

**Option A — Merge Sprint 5 Into the Original POC Repository (iden-a/VAI-DataSystem)**

**Pros**

- **Single historical location:** All project phases exist in one place.
- **No new repo setup:** Avoids initial administration work.
- **POC lineage preserved:** Maintains visual continuity in project history.

**Cons**

- **High merge complexity and breakage risk:** The POC codebase contains outdated dependencies, deprecated components, and a fundamentally different architecture. Merging would require extensive conflict resolution and risks breaking CI/CD, backend routing, and authentication flows.
- **Ambiguous authority:** The POC repository was never intended as the production system. Keeping it as the source of truth confuses future developers.
- **Ownership concerns:** The repository is not under VAI’s control. It is currently owned by a student developer and cannot be governed at an organizational level.

**Risk Summary for Option A**

- **High technical risk** (incompatible architectures, broken merges)
- **High governance risk** (VAI does not own its system)
- **Operational uncertainty** (future teams unsure which repo is authoritative)

**Option B — Designate Our Working Repository as the Official System Repository**

Our working repository contains the fully functional execution-phase system, including frontend, backend, analytics, GCR deployment files, and all technical documentation.

**Pros**

- **Technically accurate and production-ready:** This is the only repository that reflects the complete, working data system.
- **Minimal transition risk:** No merging, rewriting, or code reorganization required.
- **Preserves working CI/CD integrations:** Vercel and Google Cloud Run pipelines remain intact.
- **Immediate continuity for future teams:** The next development team inherits a clean, modern, fully documented codebase.

**Cons**

- **Currently under a personal namespace:** It must eventually be transferred out of BreatheRight’s account.
- **Requires one administrative step:** Ownership transfer to VAI’s GitHub organization must be coordinated.

**Risk Summary for Option B**

- **Low technical risk** (system already stable and deployed)
- **Low operational risk** (future developers can begin immediately)
- **Single administrative dependency** (ownership transfer)

### Transitional Risk Assessment

**1. GitHub Merge/Migration Risks**

- Merge conflicts between outdated POC code and execution-phase system.
- Potential breakage of backend routing, authentication, or Cloud Run build steps.
- Pipeline disruption if repository references change unexpectedly.

**2. Deployment and Traffic Risks**

- Incorrect configuration during repository transfer may interrupt GCR/Vercel deployments.
- High survey traffic or real-time analytics load could expose untested operational bottlenecks.
- Misconfigured service accounts or API keys may lock out the next team.

**3. User Use-Case Edge Case Risks**

- Users accessing outdated URLs if repo environment variables are not reconnected.
- QR codes pointing to outdated deployment links.
- Admins experiencing login failures if Firebase rules are not properly migrated.

**4. Documentation Transition Risks**

- Missing setup steps or lost environment keys could slow onboarding of future developers.
- CI/CD pipeline secrets must be reconnected to whichever repository becomes official.

### Our Team’s Recommendation

**We recommend Option B: Designate our current execution-phase repository as the official system repository.**

**Why Option B Is the Best Choice**

- It is **already production-ready** and accurately represents the deployed system.
- It avoids the **major technical and merging risks** presented by Option A.
- It enables **clean, immediate adoption** by the next development team.
- It reduces the likelihood of deployment breakage and onboarding confusion.

Option A poses significant risk and does not provide VAI with a future-proof foundation.

**Long-Term Recommendation for VAI**

Once the project is fully completed and ready for organizational ownership:

**VAI should create a dedicated GitHub Organization account and transfer the repository into it.**

This will:

- Centralize ownership under VAI
- Eliminate dependence on a student team’s account
- Provide structured governance, permissions, and security
- Prepare the codebase for future teams, contractors, or long-term institutional maintenance

### Transitional Checklist for Repository Option B

If the next development phase continues from our team’s working repository (BreatheRight/VAI-DataSystem-PhaseTwo), the following checklist ensures a complete and stable hand-off for future developers and VAI stakeholders.

**1. Repository Transfer and Cleanup**

- Transfer ownership of the repository from our team’s account to a VAI-controlled GitHub account.
- Update repository visibility, access privileges, and branch protection rules.
- Archive the original POC repository (iden-a/VAI-DataSystem) with a clear **deprecation notice** linking to the new active repository.
- Remove unused branches, stale feature branches, or outdated experimental code.
- Standardize branch naming conventions (main, development, feature/\*).

**2. Documentation Completion**
We must ensure all system documentation is complete, accessible, and stored within the repo:

- Final system architecture documentation (frontend, backend, and infrastructure).
- Deployment guides and cloud configuration instructions (Vercel, Google Cloud Run).
- Full API documentation (endpoints, request/response structures, error handling).
- Firestore database schema documentation (collections, fields, access roles).
- Security and authentication documentation (Firebase rules, admin login, domain requirements).
- Data lifecycle and privacy considerations (storage duration, deletion policies).
- Performance optimization notes and scaling expectations for real-world foot traffic.

**3. Review and Verification of Deployment Workflows**

- Verify CI/CD pipelines for both frontend (Vercel) and backend (GCR) continue functioning after transfer.
- Update any GitHub webhooks tied to deployment providers.
- Validate that service accounts, API keys, and environment variables remain properly configured.

**4. Migration Risk Mitigation**
To reduce risk as the system moves between teams and accounts:

- Confirm no sensitive credentials were ever pushed to GitHub.
- Ensure .env files, Firebase keys, and service accounts follow secure storage guidelines.
- Test admin login, survey submission, and analytics workflows end-to-end post-transfer.
- Validate that data pipelines scale to expected real-world load (hundreds of responses/hour).
- Review edge cases: duplicate submissions, offline mode behavior, QR mis-scans, incorrect installation IDs, and incomplete survey flows.

**5. Known Issues and Technical Debt**
Document all known issues so the next team is not blindsided:

- Deferred items requiring a VAI-controlled Google Account (PMP ID 13, 17, 20).
- Any temporary workarounds or commented-out code.
- Performance constraints discovered during testing or the live demonstration.
- UI/UX issues awaiting future refinement.

**6. Recommendations and Roadmap for Future Development**
Provide successors with a clear starting point:

- Recommended next features such as A/B testing support, multilingual UI, and role-based analytics views.
- Suggestions for upgrading dependencies (Firebase, Flask, React, Chart.js).
- Technical roadmap for scalability if VAI installations expand.
- Clear instructions for onboarding new developers into the system.

**7. Final Validation Before Handoff**
Before the repository is officially transferred:

- Run full integration tests across all major workflows.
- Verify backups and Firestore rules are correctly configured.
- Test event management CRUD, filtering, export tools, and analytics dashboards.
- Confirm documentation is centrally linked and easy to navigate.

**Conclusion**

Under **Option B**, our repository already contains the complete execution-phase system, including backend services, frontend application, and deployment pipelines. This checklist ensures the handoff is smooth, secure, fully documented, and ready for the next development team to build upon without confusion or technical risk.

## Project Management

### Risk Register

| Risk ID | Description | Probability | Impact | Mitigation Strategy | Status |
| :---: | :--- | :---: | :---: | :--- | :---: |
| R-001 | VAI Ownership Transfer Delay: Delay in VAI establishing an official GitHub Organization and Google Cloud/Firebase accounts prevents secure handoff of production environment. | High | High | Keep project in temporary university-owned org with controlled access. Prepare detailed transfer checklist (repos, IAM, billing, Firebase) for rapid VAI account handoff. | Affected - Complete |
| R-002 | Incompatible Branding Requirements: VAI branding requirements conflict with Material UI default styling, requiring extensive component customization/re-development. | Medium | Medium | Use Material UI for shared theme; isolate branding overrides in reusable components; document branding constraints to prevent future rework. | Ongoing |
| R-003 | Backend API Latency under Load: Flask API performance degrades significantly under concurrent user load (100+ responses/hour) leading to data loss or poor UX. | Medium | High | Add request caching and pagination; enable Cloud Run autoscaling limits; document future migration path to async framework or task queue if load increases. | Ongoing |
| R-004 | Data Loss from Incorrect Firestore Rules: Misconfigured Firebase Security Rules expose PII or allow unauthorized read/write access to the database. | High | High | Implement and validate least-privilege Firestore rules using Firebase Emulator Suite; peer-review security rules before deployment; Snapshot in Time enabled. | Complete |
| R-005 | Future Team Onboarding Difficulty: Incomplete or unorganized documentation slows down the next development team's ability to take over the project. | Medium | Medium | Centralize documentation (README, setup, deployment, architecture); include onboarding checklist and system diagrams; maintain handoff notes for future contributors. | Mitigated |
| R-006 | Missing Automated Database Backup: No configuration for daily/weekly automated backups, risking catastrophic data loss from human error or failure. | High | High | Enable automated Firestore backups with retention policy; document backup/restore procedures; verify backup access permissions. | Planned |
| R-007 | QR Code URL Expiration/Change: Current deployment URLs (Vercel/GCR) may change upon repository transfer, invalidating physical QR codes printed for events. | Low | High | Introduce stable redirect URL (custom domain or shortlink); update QR codes to point to redirect rather than deployment URL; document URL change process. | Partial Resolved |
| R-008 | Firebase service account key exposure in Git | Low | High | Added `firebase_key.json` to `.gitignore`; documented in PR-PREPARATION.md | Mitigated |
| R-009 | CORS errors preventing frontend-backend communication | Medium | High | Configured CORS in Flask to allow Vercel domain; tested during deployment | Resolved |
| R-010 | Google Cloud Run cold starts causing slow initial API responses | Medium | Medium | Implement minimum instance count (future sprint); documented in handoff | Accepted |
| R-011 | Lack of stakeholder feedback delaying requirements clarification | High | Medium | Developed basic POC wireframes and team assumptions; documented open questions for future sprints | Ongoing |
| R-012 | Team member availability during Thanksgiving week | High | Low | Accelerated Sprint 3 timeline to complete before Nov 15 | Resolved |
| R-013 | Vercel deployment failures due to environment variable misconfiguration | Low | Medium | Created detailed deployment guide in MACOS-SETUP.md with step-by-step env setup | Resolved |
| R-14  | **Partial Survey Submission Policy Undefined** - Current system only stores complete surveys. No data captured if user abandons mid-survey. Decision needed on whether to implement incremental save functionality. | Business Decision / Data Strategy | High | Medium | This is a significant data quality and analytics risk. Two options: (1) Demand full question set completion, lose partial data if survey exited (this is the current state of system); (2) Allow partial saves, capture drop-off analytics, requires null-handling logic, implmenet cache state, research and test best practices for handling incomplete input field data to confirm | Deferred |

### Unresolved Business Decisions

#### Partial Survey Submissions: Data Integrity vs. Completion Rates

**Current Implementation:**

- Survey submissions only saved to Firestore upon complete question set completion
- User exits (browser close, Quick Exit button, navigation away) result in **zero data capture**
- localStorage does not persist answers across sessions
- Future dev team focused functional feature: A "Quick Exit" button in top-right corner enables DevOps testing workflows (quickly reset survey to test new questions/formats)

**Trade-offs:**

| Approach | Pros | Cons |
|----------|------|------|
| **Require Complete Surveys** (Current) | • Clean, complete datasets<br/>• No missing data handling<br/>• Simpler statistical analysis<br/>• Quick Exit useful for admin testing | • Lose all data from abandoned surveys<br/>• No drop-off point analytics<br/>• Higher perceived friction for time-constrained users |
| **Allow Partial Submissions** | • Higher response rates<br/>• Analyze where users drop off<br/>• More inclusive (capture partial engagement)<br/>• Better completion funnel insights | • Requires null/missing data handling<br/>• May skew metrics if many incomplete<br/>• Adds complexity to analytics queries<br/>• localStorage.clear() must be removed |

**Technical Implementation Considerations:**

If stakeholders choose to allow partial submissions:

1. Remove `localStorage.clear()` on page load in survey components
2. Implement incremental Firestore writes (save after each question)
3. Add `completionStatus` field to survey documents: `"partial"` or `"complete"`
4. Update analytics queries to filter by completion status
5. Add minimum completion threshold logic (e.g., require 50% of questions)
6. Modify Quick Exit button to save progress before exit (or add separate "Discard" vs "Save & Exit" options)

**Recommendation for Next Team:**

- Conduct stakeholder workshop to determine priority: data volume vs. data completeness
- If enabling partial saves, consider minimum viable completion (e.g., demographics + 3 questions)
- Document decision in `/docs/handoff/SURVEY-SUBMISSION-POLICY.md`

### Stakeholder Questions and Action Items

1. Do you currently have pre-existing data (database, spreadsheet, paper records) from past community events or installations?
    - If yes, what format is it in and can it be imported into the new system?
    - If yes, what records, KPIs or reports do you utelize the most?
    - If no, what do you currently rely on as your knowledge base?

2. What are the canonical entities to track (attendee, household, school, organization, volunteer, artist, installation)?

3. Which data visualizations are most relevant, sorted by priority? Specify preferred first-glance KPI/visualization.

4. What standard exports are required (CSV, PDF brief, partner-specific templates)? At what granularity (event, month, program, fiscal year)?

5. What is the minimum viable data retention policy (raw responses vs. aggregated KPIs)?

6. Define deletion and anonymization rules after a specified period.

7. What compliance or ethics requirements must be embedded in the survey flow (informed consent, opt-out mechanisms, IRB-like review)?

8. Who are the primary end-users of the admin dashboard?

9. Is there a designated set of VAI members for consistent dashboard use?

10. Does VAI prefer data minimalism with full transparency, or comprehensive data collection for richer insights?

11. Will VAI grant admin access on a rolling basis (e.g., by installation organizer)?

12. Are audit logs required for data access, exports, and admin actions? What retention period?

13. Is there an organizational need to rely on AWS for both website and web-based projects such as this survey app?

14. Which integrations matter in 2026 (Mailchimp/SendGrid, Google Sheets, CRM/Salesforce/HubSpot)?

15. What aspects of data system will Airtable serve, and what aspects will this project's dashboard serve?

16. Assuming goal of supplementing narrative-driven impact reporting with quantitative data, what are the top 3-5 metrics VAI wants to highlight to funders and partners?

***

## Planned Backlog Itemlist Table

| Forward ID | Task | Role | Notes |
| :---: | :--- | :---: | :--- |
| F001 | Front end work | Frontend Dev | |
| F002 | General bug fixes | Full Stack Dev | |
| F003 | Optimize Backend API | Backend Dev | |
| F004 | Survey Welcome & Thank You Pages | Frontend Dev | |
| F005 | Survey Start Animation | Frontend Dev | |
| F006 | Migration: Hardcoded Questions to Database | Full Stack Dev | Involves backend data handling and application logic. |
| F007 | Survey Creator/Management Feature | Full Stack Dev | Involves both new UI and CRUD endpoints. |
| F008 | TypeScript Migration Assessment | Full Stack Dev | Technical research and recommendation. |
| F009 | Load Testing (100+ Concurrent Users) | DevOps/Backend | Focus on Cloud Run and Flask API performance. |
| F010 | Accessibility Audit (WCAG 2.1 AA) | Frontend/Design | Focus on mobile app and admin dashboard UI. |
| F011 | Firebase Backup Strategy Configuration | DevOps/Backend | Requires a VAI-controlled Google Account. |
| F012 | Error Monitoring Setup (Sentry) | DevOps/Backend | Requires third-party service integration. |
| F013 | QR Code / Link Generation Testing | Full Stack Dev | UAT for hybrid survey access functionality; frontend for display/printing |
| F014 | Zip Code Heatmap Visualization | Full Stack Dev/Data | New data visualization feature. |
| F015 | Multilingual Support (Spanish) | Frontend/Content | Scaffolding for translation and content loading. |
| F016 | Social Media Brand Assets | Design | For use in promotion and platform links. |
| F017 | Stakeholder Demo Preparation | Project Mgmt/All | |
| F018 | Security Vulnerability Remediation | Full Stack/Security | Based on findings from security review/testing. |
| F019 | Refactor to React Native or move to full iOS/Android programming kits (Swift, Kotlin, etc.) | Full Stack Dev | Technical research and recommendation |
| F020 | Admin Role-Based Access Control | Full Stack Dev | Requires VAI-controlled Google Account. |
| F021 | Data Retention & Deletion Policies | Backend/Project Mgmt | Requires VAI stakeholder input. |
| F022 | Audit Logging for Admin Actions | Backend/Project Mgmt | Requires VAI stakeholder input. |
| F023 | Integration with Mailchimp/SendGrid | Full Stack Dev | For follow-up emails to survey respondents. vanalen.org/ has Wordpress plugins for Mailchimp |
| F024 | Validate the post-survey completion Donation flow | Quality Tester | Ensure smooth transition from survey to donation page. |
| F025 | Integrate Google Gemini Flash or 3.0 Pro for AI-powered analytics | Data Scientist/Backend Dev | Technical research and recommendation. |
| F026 | Finish Implementation of TypeScript Migration | Full Stack Dev | Refactor existing JS code to TS for type safety. |
| F027 | Implement Paper Survey Data Entry Module | Full Stack Dev | Backend and frontend for manual data entry of paper surveys. Research shows paper surveys receive 30% more responses and responses are more accurate/honest. |
| F028 | Implement Open Space Meeting Feedback Module | Full Stack Dev | Backend and frontend for capturing feedback from Van Alen's open space meetings at their headquarters. Will require user informed consent (can be listed as part of open space meeting registration policy agreement). |
| F029 | Data Visualization Dashboard Enhancements | Full Stack Dev/Data | Additional visualizations based on stakeholder feedback. |
| F030 | User Training Documentation | Project Mgmt/All | Create user guides and training materials for VAI staff. |
| F031 | Post-Handoff System Audit & Review | Quality Tester/Project Mgmt | Comprehensive review of system functionality and performance, resulting in a GAP Analysis artifact. |
| F032 | Live Deployment Beta | Team & Stakeholders | Live beta deployment with stakeholder and PM present for end-to-end functionality testing and quality control. |
| F033 | Settings Page Functionality | Frontend Dev | User preferences, notification settings, password management. |
| F034 | Dark Mode Implementation | Frontend/Design | Complete design system with theme toggle across mobile app and admin dashboard. |
| F035 | Date Range Filters | Frontend Dev | Custom date pickers for advanced filtering in analytics dashboard. |
| F036 | Scheduled Reports | Backend Dev | Automated monthly email summaries (SendGrid/Mailgun integration). |
| F037 | Advanced Export Formats | Backend Dev | SQL, JSON, Parquet support for data exports. |
| F038 | Predictive Analytics | Data Scientist/Backend Dev | Correlation analysis, trend forecasting (BigQuery ML). |
| F039 | Native Mobile Apps | Full Stack Dev | iOS/Android versions (React Native consideration). |
| F040 | Collaboration Features | Full Stack Dev | Team comments, shared annotations on survey data. |
| F041 | Sentiment Analysis | Data Scientist/Backend Dev | Functional implementation for free-text survey responses. |
| F042 | Admin Activity Logs | Backend Dev | Implement and make accessible via Profile > Settings for audit trail visibility. |

***

**Concluding Executive Summary**: Using latest research, discuss how the mobile survey is one part of a larger data system that will ensure Van Alen Institute is able to stride into the future with both its current narrative driven impact reporting as well as data-driven impact reporting. Note Van Alen's SWOT analysis, optimistic view, professional consulting points about certain aspects of the system (e.g, what kind of questions are most succesful and why using the new research, how to properly enable management to act on data, assigning a common pain point to one person at Van Alen to work on resolving rather than leaving it as a group effort to tend to, note the other data collection possibilities like paper suverys or notes/feedback from Van Alen's open space meetings at their headquarters).

## Works Cited

1. Kitsaras, George, et al. "An Interactive Text Message Survey as a Novel Assessment for Bedtime Routines in Public Health Research: Observational Study." JMIR Public Health and Surveillance, vol. 6, no. 4, 2020, article e15524. PubMed Central, <https://doi.org/10.2196/15524>.

2. Nova Scholar Team. "The Comprehensive Guide to Data Gathering in Psychology." Nova Scholar, 25 Oct. 2025, <www.novascholar.org/blog-posts/the-comprehensive-guide-to-data-gathering-in-psychology>. Accessed 17 Nov. 2025.

3. Groff, Elizabeth, et al. "Comparing Responses from a Paper-Based Survey with a Web-Based Survey in Environmental Criminology." Crime Prevention and Community Safety, vol. 26, no. 4, 2024, pp. 405-22, <https://doi.org/10.1057/s41300-024-00204-9>.

4. Jones, Emily. “A Case Study of an International Exhibition Incorporating QR Codes.” JSTOR, ITHAKA, 2013, <www.jstor.org/stable/48540045>.

5. “Migrating to React Native’s New Architecture.” Shopify Engineering, Shopify, 2025, shopify.engineering/react-native-new-architecture.

6. Croft, B., et al. "Advanced Interactive Style Guide for Design Consistency." SpringerLink, Springer, 2021, link.springer.com/chapter/10.1007/978-3-030-80091-8_86.

7. Bughin, Jacques. "Brand Success in an Era of Digital Darwinism." McKinsey & Company, McKinsey, 31 Jan. 2015, <www.mckinsey.com/industries/technology-media-and-telecommunications/our-insights/brand-success-in-an-era-of-digital-darwinism>.

8. "Branding." McKinsey & Company, McKinsey, 2025, <www.mckinsey.com/capabilities/growth-marketing-and-sales/how-we-help-clients/branding>.

9. "Adopting an Ecosystem View of Business Technology." McKinsey & Company, McKinsey, 13 Feb. 2017, <www.mckinsey.com/capabilities/mckinsey-digital/our-insights/adopting-an-ecosystem-view-of-business-technology>.

10. “Digital Community Engagement Case Studies.” Local Government Association, 2024, <www.local.gov.uk/pas/plan-making/case-studies/digital-community-engagement-case-studies>.

11. “Case Study: Building an Equitable Community Engagement Practice.” City of Philadelphia, 25 Apr. 2022, <www.phila.gov/2022-04-25-case-study-building-an-equitable-community-engagement-practice/>. Updated 2025.

12. “From Community Engagement to Ownership: Tools and Case Studies.” Urban Sustainability Directors Network, 2023, <www.usdn.org/uploads/cms/documents/community_engagement_to_ownership_-_tools_and_case_studies_final.pdf>.

13. (<https://council.nyc.gov/brad-lander/wp-content/uploads/sites/40/2021/11/Gowanus-POA-2021-11-10-Final-Clean.pdf>)

14. (<https://nycfuture.org/research/surveying-nycs-arts-after-covid>)
    - Great example of organizaiton using surveys to collect data on arts organizations post-COVID and using that data to inform policy recommendations. * Data driven narrative report with clear visualizations and actionable insights.

15. (<https://www.vanalen.org/project/dear-neighbor/>)
    - Example of Van Alen's previous work in community engagement and data collection through surveys with physical QR code scans. "Each mural is paired with audio stories by longtime residents, students, small business owners and community leaders, who share what it’s like to live in a flood-prone neighborhood, the aftermath of storms and the emotional toll of disaster. Many installations feature QR codes linking to the project’s website, offering a deeper look at the stories and how the work came together." - quote from (<https://www.brooklynpaper.com/gowanus-art-project-flooding-community-resilience/>)

16. (<https://www.vanalen.org/project/open-space/>)
    - Example of Van Alen's previous work in community engagement through open space meetings at their headquarters. "Open Space is a series of free, public conversations hosted at Van Alen Institute that bring together diverse voices to discuss pressing issues related to the built environment. Each event features a keynote speaker followed by small group discussions, allowing attendees to share their perspectives and ideas in an intimate setting."

17. (<https://nycfuture.org/pdf/CUF_CDFI_Report_FINAL.pdf>)
    - Example of organization using surveys to collect data on community development financial institutions (CDFIs) in New York City and using that data to inform policy recommendations. * Data driven narrative report with clear visualizations and actionable insights.

18. (<https://www.typeform.com/connect/google-analytics>)
    -

## Appendix

Appendix A: Demo Screenshots & Tutorials
(Screenshots from live demo on November 10, 2025 are available in the repository at FormalDeliverableDocs/demo-screenshots/)

Appendix B: Technical Architecture Diagrams (All diagrams created during development)
System architecture diagram (see ____.md)
Deployment architecture diagram (see ____.md)
Data flow diagrams (see ____.md)
