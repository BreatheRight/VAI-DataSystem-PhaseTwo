# Van Alen Institute Public Art Impact Measurement System - Phase Two

## 🚀 Phase Two Development Notice

**This repository serves as the active development environment for Phase Two of the Van Alen Institute Community Engagement Data Platform.**

### Project Status
- **Original Repository**: [iden-a/VAI-DataSystem](https://github.com/iden-a/VAI-DataSystem) (Original team for Proof of Concept development & documentation)
- **Active Development**: [BreatheRight/VAI-DataSystem-PhaseTwo](https://github.com/BreatheRight/VAI-DataSystem-PhaseTwo)
- **Project Handoff**: Original team has transitioned project to Phase Two team

### Integration Strategy
Upon Phase Two completion, this repository contains the most current and feature-complete version of the VAI DataSystem. Integration options:
1. **Comprehensive Pull Request** to original repository with all Phase Two enhancements
2. **Repository Adoption** by VAI organization as the primary development repository

### Original Project Attribution
- **Original Repository**: [VAI-DataSystem by iden-a](https://github.com/iden-a/VAI-DataSystem)
- **Original Developers**: iden-a, Michael Schlichting Barbey

### Phase Two Team Focus
**Team Two Objective Summary**: We are building upon the Proof of Concept built by iden-a's team. This includes the POC proposed features, in addition to consolidating the final system architecture, developing key components for two web applications, improving code quality, bug fixes, and documentation for handoff to future maintenance/development teams.
Active development on:
- **Admin Dashboard Development**: Comprehensive analytics and management interface
- **Mobile-Facing Web App Polish**: Enhanced user experience and performance optimization
- **Advanced Data Analytics**: Expanded reporting and visualization capabilities
- **System Architecture Improvements**: Scalability and performance enhancements with deployment/cloud service provider documentation.

---

## [ORIGINAL] Project Overview
The Van Alen Institute, a nonprofit organization dedicated to inclusive urban design, is launching two community-led public art installations in Spring 2025. To measure the impact of these installations, a data collection application is being developed to facilitate real-time data gathering, survey inputs, and observational logging at installation sites. This system will provide automated data analysis, visualization tools, and reporting capabilities, allowing stakeholders to make data-driven decisions and advocate for further community-focused public art initiatives.

## Features
- **Real-time Data Collection**: Users can input survey responses and observational logs directly from installation sites.
- **Automated Data Analysis**: The system processes collected data to generate meaningful insights.
- **Visualization Tools**: Interactive charts and graphs for a clear representation of engagement metrics.
- **Reporting Capabilities**: Generate reports for stakeholders to assess project impact.
- **User-Friendly Interface**: Intuitive design for ease of use by community partners and researchers.

## Tech Stack
- **Frontend**: React
- **Backend**: Python Flask
- **Database**: Firestore (NoSQL)

## 📦 VAI DataSystem – Local Setup Instructions

### ✅ Prerequisites

Install the following tools:

* **Node.js and npm**

  * Recommended via Homebrew: [https://formulae.brew.sh/formula/node](https://formulae.brew.sh/formula/node)
  * Additional guide: [Install Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

* **Python 3 (latest)**

  * Download: [https://www.python.org/downloads/](https://www.python.org/downloads/)

* **Git**

  * Download: [https://git-scm.com/downloads](https://git-scm.com/downloads)

You will also need:

* A **Google account** (for Firebase)
* A **GitHub account** (to fork and access the repository)

---

### 📁 Setting Up the Project Locally

#### 1. Fork and Clone the Repository [Revised]

* **Phase Two Repository**: [https://github.com/BreatheRight/VAI-DataSystem-PhaseTwo]

* **Original Repository**: [https://github.com/iden-a/VAI-DataSystem] (Reference only)

To work with Phase Two development:
```bash
git clone git@github.com:BreatheRight/VAI-DataSystem-PhaseTwo.git
cd VAI-DataSystem-PhaseTwo
  ```

---

### 🌐 Frontend Setup

```bash
cd frontend
npm install
touch .env
```

* In your `.gitignore`, ensure it includes:

  ```
  **/.env
  ```

* If you accidentally push your `.env`:

  ```bash
  git rm --cached frontend/.env
  git commit -m "remove .env from tracking"
  git push
  ```

* To run the frontend server:

  ```bash
  npm run dev
  ```

---

### 🔥 Firebase / Firestore Setup

#### 🔧 Video Guide (watch up to 3:35): [Firebase Setup Video](#)

#### 1. Create Firebase Project

* Go to: [Firebase Console](https://console.firebase.google.com)
* Project name: `VAI-DataSystem`
* Use default settings

#### 2. Set Up Firestore Database

* Navigate to **Build > Firestore Database**
* Click **Next**, select **Start in production mode**, then click **Create**

#### 3. Generate Service Account Key

* Go to **Project Settings > Service Accounts**
* Click **Generate new private key**
* A `.json` file will be downloaded
* Rename it to: `firebase_key.json`
* Move it into your backend directory:

  ```
  backend/app/firebase_key.json
  ```

#### 4. Enable Authentication

* Navigate to **Build > Authentication > Sign-in Method**
* Enable **Email/Password**
* Click **Save**

#### 5. Register the Web App

* Go to **Project Settings > Your Apps**
* Click the `</>` Web icon
* App name: `VAI-Web`
* Uncheck/Skip Firebase Hosting for now
* Copy the generated `firebaseConfig` object

#### 6. Update `.env` in `frontend/`

* Add the values from `firebaseConfig` like so:

  ```
  VITE_API_KEY=your-api-key
  VITE_AUTH_DOMAIN=your-auth-domain
  ...
  ```

---

### 🖥️ Backend Setup

```bash
cd ..
cd backend
python3 -m venv venv
source venv/bin/activate      # Mac/Linux
# OR
venv\Scripts\activate         # Windows

pip install -r requirements.txt
touch .env
```

#### Add the following to `backend/.env`:

```
FIREBASE_KEY_PATH=app/firebase_key.json
FRONTEND_URL=http://localhost:5173
```

#### Ensure your `.gitignore` includes:

```
venv/
.env
app/firebase_key.json
app/__pycache__/
```

#### Run the Backend:

```bash
python3 run.py
```

---

### ✅ Running the Full App Locally

* **Frontend**:

  ```bash
  cd frontend
  npm run dev
  ```

* **Backend**:

  ```bash
  cd backend
  source venv/bin/activate
  python3 run.py
  ```