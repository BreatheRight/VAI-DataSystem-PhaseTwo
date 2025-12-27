
**Command Executed:**
```bash
cd "C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo"; git branch --show-current; git status -sb; git --no-pager log -5 --oneline
```

**Output:**
```
git: The term 'git' is not recognized as a name of a cmdlet, function, script file, or executable program.
Check the spelling of the name, or if a path was included, verify that the path is correct and try again.
git: The term 'git' is not recognized as a name of a cmdlet, function, script file, or executable program.
Check the spelling of the name, or if a path was included, verify that the path is correct and try again.
git: The term 'git' is not recognized as a name of a cmdlet, function, script file, or executable program.
Check the spelling of the name, or if a path was included, verify that the path is correct and try again.
```



**File Glob Results:**





**Files Read:**

**C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\backend\app\routes.py**
```
# Define all your Flask routes (API endpoints)
from flask import Blueprint, request, jsonify, send_file, current_app

from firebase_admin import auth, firestore
import io
import zipfile
import os
import pandas as pd
from app.models import UserSignUp, SurveyResponse


from app.utils import SurveyAnalyzer, load_responses_from_firestore, save_graphs_to_pdf, clean_firestore_responses

main = Blueprint('main', __name__)

question_map = {
    "q1": "Before this installation, how often did you visit this site?",
    "q2": "Since the installation, how often do you visit this site?",
    "q3": "On average, how much time do you spend at this site per visit?",
    "q4": "What is your age group?",
    "q5": "What is your gender?",
    "q6": "What is your race/ethnicity?",
    "q7": "What is your zip code?",
    "q8": "How welcome do you feel on this site?",
    "q9": "How safe do you feel on this site?",
    "q10": "How comfortable do you feel on this site?",
    "q11": "How positive is your overall experience at this site?",
    "q12": "What activity best describes your time spent at this site?",
    "q13": "Has this installation made you more interested in exploring the surrounding neighborhood?",
}

@main.route('/')
def health_check():
    return jsonify({"message": "Hello, VAI project!"})

# submitting a survey response
@main.route('/submit-survey', methods=['POST'])
def submit_survey():
    response_data = request.json
    raw_responses = response_data.get('responses')
    responses = {}

    for key, value in raw_responses.items():
        # If it's a list with more than one item, keep it as is (for checkboxes)
        if isinstance(value, list):
            if len(value) > 1:
                responses[key] = value
            elif len(value) == 1:
                responses[key] = value[0]  # Convert single-item list to a string
            else:
                responses[key] = ""  # Empty list becomes empty string
        else:
            responses[key] = value  # In case it's already a string

    print("Received survey submission response_data:", response_data)

    installation_id = response_data.get('installationId')
    responses = response_data.get('responses')

    survey_response = SurveyResponse(responses, installation_id)

    try:
        current_app.db.collection('surveyResponses').add(survey_response.to_dict())
        print("Survey response saved successfully to Firestore!")  # Added success print
        return jsonify({"message": "Survey submitted", "survey responses": responses}), 200

    except Exception as e:
        print("Error saving survey response:", str(e))
        return jsonify({"error": str(e)}), 400


# creating a new user
@main.route('/register-user', methods=['POST'])
def register_user():
    user_data = request.json
    first_name = user_data.get('firstName')
    last_name = user_data.get('lastName')
    email = user_data.get('email')
    password = user_data.get('password')

    # Basic validation, will go in depth in the frontend!
    if not all([first_name, last_name, email, password]):
        return jsonify({"error": "Missing required fields"}), 400

    user = UserSignUp(first_name, last_name, email, password)

    try:
        # Creating the user in Firebase Auth
        user_record = auth.create_user(
            email=user.email,
            password=user.password,
            display_name=f"{user.first_name} {user.last_name}"
        )

        # Store user details in Firestore
        current_app.db.collection('users').document(user_record.uid).set(user.to_dict(user_record.uid))
        return jsonify({"message": "User created successfully", "uid": user_record.uid}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400

# verifying that the user attempting to login exists within our DB
@main.route('/verify-token', methods=['POST'])
def verify_token():
    id_token = request.json.get("idToken")
    try:
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']
        return jsonify({"message": "Token verified", "uid": uid}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 401

@main.route('/get-survey-responses', methods=['GET'])
def get_survey_responses():
    try:
        # Access Firestore from current_app
        db = current_app.db
        responses_ref = db.collection('surveyResponses')
        docs = responses_ref.stream()

        responses = []
        for doc in docs:
            response = doc.to_dict()
            response['id'] = doc.id  # Include document ID if needed
            responses.append(response)

        return jsonify(responses), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@main.route('/generate-report', methods=['GET'])
def generate_report():
    try:
        raw_responses = load_responses_from_firestore()
        responses = clean_firestore_responses(raw_responses, question_map)
        analyzer = SurveyAnalyzer(responses, question_map)

        if not responses:
            return jsonify({"error": "No survey responses found to generate report."}), 400

        analyzer = SurveyAnalyzer(responses, question_map)

        print(f"Sample Firestore response: {responses[:2]}")
        csv_path = 'survey_summary.csv'
        pdf_path = 'survey_graphs_summary.pdf'

        analyzer.export_summary_csv(csv_path)
        analyzer.generate_graphs('survey_graphs')
        save_graphs_to_pdf('survey_graphs', pdf_path, question_map)

        memory_file = io.BytesIO()
        with zipfile.ZipFile(memory_file, 'w') as zf:
            zf.write(csv_path)
            zf.write(pdf_path)

        memory_file.seek(0)

        return send_file(memory_file, mimetype='application/zip', as_attachment=True, download_name='survey_reports.zip')

    except Exception as e:
        print("Error in generate_report:", str(e))
        return jsonify({"error": str(e)}), 500


@main.route('/submit-bug-report', methods=['POST'])
def submit_bug_report():
    """
    Please use this form to submit bugs, or equest features here. You may attach screenshot for context.
    Sends email to vaiteam65800@gmail.com
    """
    try:
        title = request.form.get('title')
        description = request.form.get('description')
        steps_to_reproduce = request.form.get('stepsToReproduce')
        priority = request.form.get('priority', 'medium')
        screenshot = request.files.get('screenshot')

        # For now, we'll save to Firestore
        # In production, you would integrate with email service (SendGrid, etc.)
        db = current_app.db
        bug_report_data = {
            'title': title,
            'description': description,
            'stepsToReproduce': steps_to_reproduce,
            'priority': priority,
            'submittedAt': firestore.SERVER_TIMESTAMP,
            'status': 'open'
        }

        # Save to Firestore
        doc_ref = db.collection('bugReports').add(bug_report_data)

        # TODO: Add email sending logic here
        # For now, just log it
        print(f"Bug report submitted: {title} (Priority: {priority})")
        print(f"Description: {description}")
        print(f"Steps: {steps_to_reproduce}")

        return jsonify({
            "message": "Bug report submitted successfully",
            "reportId": doc_ref[1].id
        }), 200

    except Exception as e:
        print("Error submitting bug report:", str(e))
        return jsonify({"error": str(e)}), 500

```

**C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\backend\requirements.txt**
```
blinker==1.9.0
CacheControl==0.14.3
cachetools==5.5.2
certifi==2025.4.26
cffi==1.17.1
charset-normalizer==3.4.2
click==8.1.8
colorama==0.4.6
contourpy==1.3.2
cors==1.0.1
cryptography==44.0.3
cycler==0.12.1
dotenv==0.9.9
et_xmlfile==2.0.0
filelock==3.18.0
firebase-admin==6.8.0
Flask==3.1.0
flask-cors==5.0.1
fonttools==4.57.0
future==1.0.0
gevent==25.4.2
google-api-core==2.25.0rc0
google-api-python-client==2.169.0
google-auth==2.39.0
google-auth-httplib2==0.2.0
google-cloud-core==2.4.3
google-cloud-firestore==2.20.2
google-cloud-storage==3.1.0
google-crc32c==1.7.1
google-resumable-media==2.7.2
googleapis-common-protos==1.70.0
greenlet==3.2.1
grpcio==1.71.0
grpcio-status==1.71.0
httplib2==0.22.0
gunicorn==21.2.0
idna==3.10
itsdangerous==2.2.0
Jinja2==3.1.6
kiwisolver==1.4.8
MarkupSafe==3.0.2
matplotlib==3.10.1
msgpack==1.1.0
numpy==2.2.5
openpyxl==3.1.5
packaging==25.0
pandas==2.2.3
pillow==11.2.1
proto-plus==1.26.1
protobuf==5.29.4
pyasn1==0.6.1
pyasn1_modules==0.4.2
pycparser==2.22
PyJWT==2.10.1
pyparsing==3.2.3
PySocks==1.7.1
python-dateutil==2.9.0.post0
python-dotenv==1.1.0
pytz==2025.2
requests==2.32.3
requests-file==2.1.0
rsa==4.9.1
setuptools==80.3.0
six==1.17.0
tldextract==5.3.0
tzdata==2025.2
uritemplate==4.1.1
urllib3==2.4.0
Werkzeug==3.1.3
zope.event==5.0
zope.interface==7.2

```

**C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\package.json**
```
{
  "dependencies": {
    "@tailwindcss/postcss": "^4.1.17",
    "framer-motion": "^12.23.25",
    "lucide-react": "^0.555.0",
    "postcss": "^8.5.6"
  }
}

```

**C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\package.json**
```
{
  "name": "frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@emotion/react": "^11.11.1",
    "@emotion/styled": "^11.11.0",
    "@fontsource/bebas-neue": "^5.0.18",
    "@fontsource/hanken-grotesk": "^5.2.8",
    "@fontsource/ibm-plex-sans": "^5.0.20",
    "@fontsource/inter": "^5.0.16",
    "@mui/icons-material": "^5.14.19",
    "@mui/material": "^5.14.20",
    "axios": "^1.8.4",
    "chart.js": "^4.4.9",
    "chartjs-plugin-datalabels": "^2.2.0",
    "date-fns": "^2.30.0",
    "firebase": "^11.10.0",
    "qrcode.react": "^4.2.0",
    "react": "^19.2.1",
    "react-dom": "^19.2.1",
    "react-router-dom": "^7.4.1"
  },
  "devDependencies": {
    "@eslint/js": "^9.21.0",
    "@types/react": "^19.0.10",
    "@types/react-dom": "^19.0.4",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.22",
    "eslint": "^9.21.0",
    "eslint-plugin-react-hooks": "^5.1.0",
    "eslint-plugin-react-refresh": "^0.4.19",
    "globals": "^15.15.0",
    "postcss": "^8.5.6",
    "tailwindcss": "^3.4.1",
    "vite": "^6.2.0"
  }
}

```




**Command Executed:**
```bash
cd "C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo"; ls
```

**Output:**
```

    Directory: C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d----           12/5/2025  4:33 AM                .github
d----          12/13/2025  6:07 PM                backend
d----          12/15/2025  4:16 AM                frontend
d----           12/5/2025  4:33 AM                MAIN-DevSupportDoc-OrganizingImages
d----          12/13/2025  5:46 PM                REFERENCEONLY-ComponetnsFromTypescript
d----           12/5/2025  4:33 AM                Van Alen Style Guide Color Palette
d----           12/5/2025  4:33 AM                Van Alen Website Images CSS
-a---           12/5/2025  4:33 AM             40 .gitignore
-a---           12/3/2025  5:35 AM           1356 CONTRIBUTING.md
-a---           12/5/2025  4:33 AM           6039 MAIN-TASKLIST
-a---           12/5/2025  4:33 AM          31024 newGOOD-VAI-DataSystem-Architecture-Layers-and-Components.md
-a---           12/5/2025  4:33 AM         556534 ORIGINALGOAL-Shadcn-Dashboard-Current.png
-a---           12/5/2025  4:33 AM          27095 package-lock.json
-a---           12/5/2025  4:33 AM            165 package.json
-a---           12/3/2025  5:35 AM          20259 PHASE-TWO-CHANGELOG.md
-a---           12/3/2025  5:35 AM           6771 README.md
-a---           12/5/2025  4:33 AM          20626 technical-overview-BASELINE-ANALYSIS.md
-a---           12/5/2025  4:33 AM          28533 VAI-SYSTEM-SOURCE-OF TRUTH.md

```

I can inspect the code and docs directly, but Git isn’t available in your shell, so I can’t show branch/status/log via `git` from here. I’ll map out frontend/backend structure, dependencies, obvious issues, and then we can handle Git-specific steps by having you run a couple of commands manually if needed.

**Command Executed:**
```bash
cd "C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend"; ls; if (Test-Path src) { ls src; ls src/pages; ls src/components; if (Test-Path src\ui) { ls src\ui }; if (Test-Path src\components\dashboard) { ls src\components\dashboard } }
```

**Output:**
```

    Directory: C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d----           12/5/2025  4:53 AM                public
d----           12/5/2025  4:33 AM                RefrenceUI
d----          12/13/2025  6:11 PM                src
-a---           12/3/2025  8:57 AM            374 .env
-a---           12/5/2025  4:33 AM            288 .gitignore
-a---           12/3/2025  5:32 AM            877 eslint.config.js
-a---           12/3/2025  5:32 AM            394 index.html
-a---           12/5/2025  4:53 AM         210636 package-lock.json
-a---           12/5/2025  4:53 AM           1254 package.json
-a---           12/5/2025  4:33 AM             86 postcss.config.js
-a---           12/3/2025  5:32 AM            821 README.md
-a---           12/5/2025  4:33 AM            743 tailwind.config.js
-a---           12/3/2025  5:32 AM            168 vite.config.js

    Directory: C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d----           12/5/2025  4:53 AM                components
d----          12/13/2025  6:11 PM                data
d----           12/5/2025  4:53 AM                pages
d----           12/5/2025  4:33 AM                styles
d----           12/5/2025  4:33 AM                ui
d----          12/13/2025  6:11 PM                utils
-a---           12/5/2025  4:53 AM           3435 App.jsx
-a---           12/5/2025  4:33 AM            961 main.jsx

    Directory: C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\pages

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a---           12/5/2025  4:33 AM            243 Asterix.jsx
-a---           12/5/2025  4:33 AM           8787 Dashboard.jsx
-a---           12/5/2025  4:33 AM           5822 Documentation.jsx
-a---           12/5/2025  4:33 AM           7312 Errors.jsx
-a---           12/5/2025  4:33 AM          16288 EventManager.jsx
-a---           12/3/2025  5:32 AM            992 Home.jsx
-a---           12/3/2025  5:32 AM           1115 Installation.jsx
-a---           12/5/2025  4:53 AM           4658 InstallationPicker.jsx
-a---           12/5/2025  4:53 AM           8234 LandingPageNew.jsx
-a---           12/5/2025  4:33 AM           3861 Login.jsx
-a---           12/5/2025  4:53 AM           9898 LoginNew.jsx
-a---           12/5/2025  4:33 AM         123154 LoginPageNew.png
-a---           12/5/2025  4:33 AM           4146 Settings.jsx
-a---           12/5/2025  4:33 AM           5162 SignUp.jsx
-a---           12/5/2025  4:33 AM            963 Survey.jsx
-a---           12/5/2025  4:33 AM          12386 SurveyBuilder.jsx
-a---           12/5/2025  4:33 AM           2481 TableView.jsx
-a---           12/3/2025  5:32 AM            530 ThankYou.jsx

    Directory: C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\components

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d----           12/5/2025  4:53 AM                dashboard
-a---           12/3/2025  5:32 AM            697 Logo.jsx
-a---           12/3/2025  5:35 AM            539 Navbar.jsx
-a---           12/5/2025  4:33 AM           6238 Survey Submission Animation.md
-a---           12/5/2025  4:53 AM           9321 SurveyCardStack Component.jsx
-a---           12/5/2025  4:33 AM           8949 SurveyCardStack.jsx
-a---           12/3/2025  5:32 AM           3162 SurveyQuestion.jsx

    Directory: C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\ui

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a---           12/5/2025  4:33 AM            377 Badge.jsx
-a---           12/5/2025  4:33 AM            982 Button.jsx
-a---           12/5/2025  4:33 AM            615 Card.jsx
-a---           12/5/2025  4:33 AM            860 Input.jsx
-a---           12/5/2025  4:33 AM           1057 Select.jsx
-a---           12/5/2025  4:33 AM           6017 SidebarLayout.jsx
-a---           12/5/2025  4:33 AM           1077 Tabs.jsx

    Directory: C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\components\dashboard

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a---           12/3/2025  5:35 AM           8100 AdvancedAnalyticsModal.jsx
-a---           12/3/2025  5:35 AM           5108 DailySummaryCharts.jsx
-a---           12/3/2025  5:35 AM           7161 DashboardLayout.jsx
-a---           12/3/2025  5:35 AM           3809 DataTable.jsx
-a---           12/3/2025  5:35 AM            950 FilterPanel.jsx
-a---           12/5/2025  4:53 AM          16997 Impact Intel.jsx
-a---           12/3/2025  5:35 AM           4717 InstallationComparisonChart.jsx
-a---           12/3/2025  5:35 AM           1570 StatsCard.jsx
-a---           12/3/2025  5:35 AM           4234 TrendLineChart.jsx

```


**Command Executed:**
```bash
cd "C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend"; Get-ChildItem src -Recurse -File -Include *.jsx,*.tsx | ForEach-Object { $_.FullName }
```

**Output:**
```
C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\components\dashboard\AdvancedAnalyticsModal.jsx
C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\components\dashboard\DailySummaryCharts.jsx
C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\components\dashboard\DashboardLayout.jsx
C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\components\dashboard\DataTable.jsx
C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\components\dashboard\FilterPanel.jsx
C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\components\dashboard\Impact Intel.jsx
C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\components\dashboard\InstallationComparisonChart.jsx
C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\components\dashboard\StatsCard.jsx
C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\components\dashboard\TrendLineChart.jsx
C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\components\Logo.jsx
C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\components\Navbar.jsx
C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\components\SurveyCardStack Component.jsx
C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\components\SurveyCardStack.jsx
C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\components\SurveyQuestion.jsx
C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\pages\Asterix.jsx
C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\pages\Dashboard.jsx
C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\pages\Documentation.jsx
C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\pages\Errors.jsx
C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\pages\EventManager.jsx
C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\pages\Home.jsx
C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\pages\Installation.jsx
C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\pages\InstallationPicker.jsx
C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\pages\LandingPageNew.jsx
C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\pages\Login.jsx
C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\pages\LoginNew.jsx
C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\pages\Settings.jsx
C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\pages\SignUp.jsx
C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\pages\Survey.jsx
C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\pages\SurveyBuilder.jsx
C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\pages\TableView.jsx
C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\pages\ThankYou.jsx
C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\ui\Badge.jsx
C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\ui\Button.jsx
C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\ui\Card.jsx
C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\ui\Input.jsx
C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\ui\Select.jsx
C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\ui\SidebarLayout.jsx
C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\ui\Tabs.jsx
C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\App.jsx
C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\main.jsx
```



**Files Read:**

**C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\App.jsx**
```
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPageNew';
import Installation from './pages/InstallationPicker';
import Survey from './pages/Survey';
import ThankYou from './pages/ThankYou';
import LoginNew from './pages/LoginNew';
import Dashboard from './pages/Dashboard';
import TableView from './pages/TableView';
import EventManager from './pages/EventManager';
import Documentation from './pages/Documentation';
import Settings from './pages/Settings';
import SurveyBuilder from './pages/SurveyBuilder';
import Asterix from './pages/Asterix';
import Errors from './pages/Errors';
import './styles/global.css';
import API from './utils/apiClient';
import { AuthContext } from './utils/AuthContext';
import { SidebarLayout } from './ui/SidebarLayout';function App() {
  const [user, setUser] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [surveyData, setSurveyData] = useState([]);
  const [loading, setLoading] = useState(true);

  // whenever a user logs into the application, we want to authenticate then and store all the necessaey info (survey data, token, user info)
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      API.get("/get-survey-responses")
        .then(res => {
          setSurveyData(res.data);
          setIsAuthenticated(true);
          const storedUser = JSON.parse(localStorage.getItem("user"));
          if (storedUser) setUser(storedUser);
        })
        .catch(err => {
          console.error("Session check failed:", err);
          localStorage.removeItem("jwtToken");
          localStorage.removeItem("user");
          setIsAuthenticated(false);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }
  // using AuthContext so we can carry the state across multiple componenets
  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      isAuthenticated,
      setIsAuthenticated,
      surveyData,
      setSurveyData
    }}>
      <Router>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/installation-selection' element={<Installation />} />
          <Route path='/survey' element={<Survey />} />
          <Route path='/survey-complete' element={<ThankYou />} />
          {/* Dashboard routes wrapped in SidebarLayout */}
          <Route path='/dashboard' element={<SidebarLayout />}>
            <Route index element={<Dashboard />} />
            <Route path='table' element={<TableView />} />
            <Route path='events' element={<EventManager />} />
            <Route path='survey-builder' element={<SurveyBuilder />} />
            <Route path='docs' element={<Documentation />} />
            <Route path='asterix' element={<Asterix />} />
            <Route path='errors' element={<Errors />} />
            <Route path='settings' element={<Settings />} />
          </Route>
          <Route path='/login' element={<LoginNew />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;

```

**C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\main.jsx**
```
// Import the fonts for this project
import '@fontsource/hanken-grotesk/300.css';  // Body Light
import '@fontsource/hanken-grotesk/400.css';  // Body Regular
import '@fontsource/hanken-grotesk/500.css';  // Body Medium
import '@fontsource/hanken-grotesk/600.css';  // Body SemiBold
import '@fontsource/hanken-grotesk/700.css';  // Body Bold
import '@fontsource/inter/400.css';           // Heading Regular
import '@fontsource/inter/500.css';           // Heading Medium
import '@fontsource/inter/600.css';           // Heading SemiBold
import '@fontsource/inter/700.css';           // Heading Bold
import '@fontsource/inter/800.css';           // Heading Extra Bold

// Import Tailwind CSS
import './styles/tailwind-base.css';

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

```

**C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\utils\apiClient.js**
```
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach token dynamically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken'); // read latest token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;





```

**C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src\utils\AuthContext.js**
```
// using React Context for authentication instead of manually passing in props
import { createContext, useContext } from "react";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

```





**Files Read:**

**C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\technical-overview-BASELINE-ANALYSIS.md**
```
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
```

**C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\PHASE-TWO-CHANGELOG.md**
```
# Phase Two Development Changelog

\\MVP Ready for Demo

---

## Overview

Phase Two development focused on developing and validating the system architecture for live data capture flow and analysis. Capture to Firestore with authentification security succesful. Sign-Up and Log-In functions validated and bug regarding browser cache/cookies causing a 200 status error for signed in admins when returning to the landing page. Revised

---
- **Other Features:**
  - UI enhancmenets - VAI Branding
  - Navigation menu items with icons:
    - Dashboard (home analytics view)
    - Table View (detailed data table)
    - Event Manager Suite Skeleton**
    - Settings (placeholder)
    - Logout (clears auth and redirects)
  - Active route highlighting with brand color (#36C0FC)
  - Mobile responsive with hamburger menu and temporary drawer
  - Hover effects and smooth transitions

**Files Modified:**
- `frontend/src/components/dashboard/DashboardLayout.jsx` (57 → 228 lines)

---

### 2. Branding & Typography Overhaul
**Status:** ✅ Complete

- **Font Change:** Replaced Hanken Grotesk with **Inter** font family
  - Modern sans-serif similar to Gotham (used by Van Alen Institute)
  - Improved readability and professional appearance
  - Added weights: 300, 400, 500, 600, 700, 800
- **Logo Integration:**
  - Replaced "VAI ADMIN" text with official logo images
  - Proper vertical stacking in sidebar
  - Consistent branding across all pages

**Files Modified:**
- `frontend/package.json` - Added @fontsource/inter dependency
- `frontend/src/main.jsx` - Updated font imports
- `frontend/src/styles/global.css` - Changed font-family declaration
- `frontend/src/components/dashboard/DashboardLayout.jsx` - Logo implementation

---

### 3. Simplified Filter Panel
**Status:** ✅ Complete

- **Before:** Card-based component with 4 filters (Installation, Start Date, End Date, Zip Code) with drop shadow styling
- **After:** Minimal inline filter with only Installation dropdown and filter icon
- **Rationale:** Reduced visual clutter, focused on essential filtering (installation-based analysis)
- **Design:** No card wrapper, seamless background integration

**Files Modified:**
- `frontend/src/components/dashboard/FilterPanel.jsx` (60 → 24 lines)

---

### 4. 7-Day Attendance Trend Chart
**Status:** ✅ Complete

**New Component:** `TrendLineChart.jsx`
- **Purpose:** Shows daily attendance trends over last 7 days for both installations
- **Chart Type:** Line chart with filled areas
- **Features:**
  - Automatic date calculation (today minus 6 days)
  - Dual-line display (Breathing Pavilion: #4BC0C0, Common Ground: #FF6384)
  - Hover tooltips with response counts
  - Legend with compact labels
  - Responsive height (180px)
- **Location:** Positioned below filter panel, above KPI cards

**Files Created:**
- `frontend/src/components/dashboard/TrendLineChart.jsx` (140 lines)

---

### 5. Dashboard Layout Redesign - 2x2 Chart Grid
**Status:** ✅ Complete

- **Before:** Large grid of 13+ individual survey question charts with chart type selector (pie/doughnut/bar toggle)
- **After:** Clean 2x2 summary grid with expandable detailed views

**Main Dashboard Grid:**
1. **Top Left:** Installation Comparison (dual-axis bar chart)
   - Response count (left y-axis)
   - Average sentiment (right y-axis, max 5.0)
2. **Top Right:** Today's Distribution (pie chart)
   - Installation split with percentages
3. **Bottom Left:** Installation Split (doughnut chart)
   - Same data as pie, different visual style
4. **Bottom Right:** Response Count (bar chart)
   - Horizontal bars showing count per installation

**Design Improvements:**
- Removed chart type selector menu (now handled per-chart)
- Removed table/charts toggle (Table View is separate page)
- Clean card separation with box shadows (boxShadow: 2)
- Consistent spacing with Material UI Grid (spacing: 3)

**Files Modified:**
- `frontend/src/pages/Dashboard.jsx` (349 → 217 lines)
- `frontend/src/components/dashboard/DailySummaryCharts.jsx` (created)
- `frontend/src/components/dashboard/InstallationComparisonChart.jsx` (updated)

---

### 6. Advanced Analytics Modal System
**Status:** ✅ Complete

**New Component:** `AdvancedAnalyticsModal.jsx`

- **Trigger:** Expand icon (📊) in top-right corner of each chart card
- **Modal Size:** Full-width (xl), 90vh height for maximum data visibility
- **Layout:** Two-tab interface

**Tab 1: Demographics**
- 4 charts showing user demographic breakdowns:
  1. Age Group (q3)
  2. Gender (q4)
  3. Race/Ethnicity (q5)
  4. Zip Code (q7)
- Responsive grid: `repeat(auto-fit, minmax(280px, 1fr))`

**Tab 2: Survey Questions**
- All 13 survey questions displayed as charts
- Responsive grid: `repeat(auto-fill, minmax(240px, 1fr))`
- Compact chart sizing (180px height) for overview

**Chart Type Consistency:**
- Clicking expand on **Pie Chart** → All modals show pie charts
- Clicking expand on **Doughnut Chart** → All modals show doughnut charts
- Clicking expand on **Bar Chart** → All modals show bar charts
- Demographics tab respects parent chart type
- Survey Questions tab respects parent chart type

**Features:**
- Clean close button (X)
- Dark overlay backdrop
- Smooth Material UI Dialog transitions
- Chart.js with datalabels plugin
- Percentage labels (pie/doughnut) or count labels (bar)

**Files Created:**
- `frontend/src/components/dashboard/AdvancedAnalyticsModal.jsx` (279 lines)

**Files Modified:**
- `frontend/src/components/dashboard/DailySummaryCharts.jsx` - Added expand button + modal integration
- `frontend/src/components/dashboard/InstallationComparisonChart.jsx` - Added expand button + modal integration

---

### 7. Standalone Table View Page
**Status:** ✅ Complete

**New Page:** `TableView.jsx`

- **Purpose:** Dedicated page for detailed tabular data exploration
- **Features:**
  - Reuses FilterPanel component (installation dropdown)
  - Reuses DataTable component (sortable, color-coded sentiment)
  - Shows "Showing X of Y total responses" count
  - Date formatting with date-fns library
  - Color-coded sentiment chips (green for scores ≥4)
- **Route:** `/dashboard/table`
- **Access:** Sidebar navigation "Table View" menu item

**Files Created:**
- `frontend/src/pages/TableView.jsx` (73 lines)

**Files Modified:**
- `frontend/src/App.jsx` - Added route definition

---

### 8. Event Manager Page
**Status:** ✅ Complete

**New Page:** `EventManager.jsx`

- **Purpose:** Admin interface for managing installations
- **Features:**
  - Grid of installation cards (2 columns on md+ screens)
  - Each card shows:
    - Installation image (CardMedia)
    - Name, description, location, status
    - Action buttons: Generate QR Code, View Analytics, Edit Details
  - Quick stats section (total installations, active events)
- **Data:** Static array of 2 installations:
  1. Breathing Pavilion (id: '1')
  2. Common Ground (id: '2')
- **Images:** `/Breathing_Pavilion.jpeg`, `/Common_Ground.jpeg`
- **Route:** `/dashboard/events`

**Files Created:**
- `frontend/src/pages/EventManager.jsx` (144 lines)

**Files Modified:**
- `frontend/src/App.jsx` - Added route definition

---

### 9. Documentation Page
**Status:** ✅ Complete

**New Page:** `Documentation.jsx`

- **Purpose:** User guide for admin dashboard
- **Style:** Notion/GitHub Pages aesthetic with clean typography
- **Sections:**
  1. Getting Started
  2. Dashboard Overview (features with checkmark icons)
  3. Table View usage
  4. Event Manager usage
  5. Filters Guide (with example Chips)
  6. Understanding Sentiment (4-question breakdown)
  7. Tips & Best Practices (highlighted section)
- **Route:** `/dashboard/docs`
- **Design:** Material UI Paper components, checkmark bullets, light blue accent sections

**Files Created:**
- `frontend/src/pages/Documentation.jsx` (213 lines)

**Files Modified:**
- `frontend/src/App.jsx` - Added route definition

---

### 10. Settings Page Placeholder
**Status:** ✅ Complete

**New Page:** `Settings.jsx`

- **Purpose:** Placeholder for future settings functionality
- **Features:**
  - "Coming Soon" banner with light blue styling
  - Grid of 6 planned features:
    1. User Profile
    2. Notification Preferences
    3. Data Export Options
    4. Security & Privacy
    5. Display Preferences
    6. Language & Region
  - Each feature as card with icon, title, description
  - Help section with link to Documentation
- **Route:** `/dashboard/settings`

**Files Created:**
- `frontend/src/pages/Settings.jsx` (142 lines)

**Files Modified:**
- `frontend/src/App.jsx` - Added route definition

---

## Bug Fixes & Issues Resolved

### 1. Import Path Errors (Critical)
**Issue:** Newly created pages had incorrect relative import paths
- `Documentation.jsx`: Used `../../components` instead of `../components`
- `EventManager.jsx`: Used `../../components` instead of `../components`
- `TableView.jsx`: Used `../../utils` instead of `../utils`

**Impact:** Blank white screen, Vite import resolution errors

**Root Cause:** Confusion about directory depth (`pages/` is one level deep, not two)

**Resolution:** Updated all import paths to use `../` (one level up) instead of `../../`

**Files Fixed:**
- `frontend/src/pages/Documentation.jsx`
- `frontend/src/pages/EventManager.jsx`
- `frontend/src/pages/TableView.jsx`

---

### 2. useEffect Undefined Error (Critical)
**Issue:** Dashboard showed blank page with error "useEffect is not defined"

**Root Cause:** Dashboard.jsx refactored to remove survey question charts, but old `useEffect` code remained that:
- Referenced removed state variables (`loadingCharts`, `chartType`)
- Used removed refs (`chartRefs`, `charts`)
- Called removed helper function (`aggregateResponses`)
- Imported Chart.js and ChartDataLabels (no longer needed in main dashboard)

**Resolution:**
- Removed entire useEffect block (lines 113-175)
- Removed unused imports
- Removed unused state variables
- Simplified component to only handle filtering and KPI calculation

**Files Fixed:**
- `frontend/src/pages/Dashboard.jsx`

---

### 3. Navigation Segmentation Issue
**Issue:** Home page Navbar showed "Dashboard" and "Logout" buttons for authenticated users, confusing the separation between:
- **Mobile-facing survey app** (public, accessible via "Get Started" button)
- **Admin dashboard** (private, accessed via Login)

**Impact:** Blurred lines between two distinct user experiences

**Original Behavior:**
```javascript
if(isAuthenticated) {
  return <Navbar with "Dashboard" and "Logout" />
}
return <Navbar with "Login" and "Sign Up" />
```

**Resolution:** Removed authentication-based conditional rendering from Navbar
- Home page **always** shows "Login" and "Sign Up"
- Login page serves as gateway to admin dashboard
- Logout functionality moved to dashboard sidebar only
- Clear separation: Home = Survey App, Dashboard = Admin Area

**Files Modified:**
- `frontend/src/components/Navbar.jsx` (40 → 15 lines)

---

### 4. Chart Rendering Issues in Advanced Modal
**Issue:** Survey Questions tab in AdvancedAnalyticsModal showed blank charts

**Root Cause:** Chart refs passed incorrectly as callback functions instead of ref objects
```javascript
// WRONG - callback function
chartRef={(el) => (questionRefs.current[questionId] = el)}

// RIGHT - component creates own ref
const chartRef = useRef(null);
```

**Resolution:**
- QuestionChart component now creates its own internal `useRef` hook
- Removed questionRefs object from parent component
- Each chart instance manages its own canvas ref independently

**Files Fixed:**
- `frontend/src/components/dashboard/AdvancedAnalyticsModal.jsx`

---

### 5. Chart Type Inconsistency in Demographics
**Issue:** All demographics charts displayed as pie charts regardless of parent chart type

**Root Cause:** DemographicChart component hardcoded `type: 'pie'`

**Expected Behavior:**
- Expand pie chart → Demographics show as pie
- Expand doughnut chart → Demographics show as doughnut
- Expand bar chart → Demographics show as bar

**Resolution:**
- Added `chartType` prop to DemographicChart
- Conditional chart configuration based on type:
  - **Bar:** Show count labels, black text, y-axis scales, no legend
  - **Pie/Doughnut:** Show percentage labels, white text, legend at bottom
- Pass `chartType` prop from modal to all demographic charts

**Files Fixed:**
- `frontend/src/components/dashboard/AdvancedAnalyticsModal.jsx`

---

### 6. Bar Chart Configuration Issues
**Issue:** Response Count bar chart didn't render properly with appropriate scales

**Root Cause:** DailySummaryCharts used same config for all chart types

**Resolution:**
- Conditional chart options based on `type` prop
- Bar charts now include:
  - Y-axis with `beginAtZero: true` and `stepSize: 1`
  - X-axis with font size adjustments
  - Dataset label "Response Count"
  - Individual bar colors matching installation colors
  - Count labels instead of percentages

**Files Fixed:**
- `frontend/src/components/dashboard/DailySummaryCharts.jsx`

---

### 7. Card Visual Separation
**Issue:** Response Count bar chart appeared to blend with adjacent chart (no visible boundary)

**Root Cause:** Box shadow too subtle (`boxShadow: 1`)

**Resolution:** Increased to `boxShadow: 2` for clearer card separation

**Files Modified:**
- `frontend/src/components/dashboard/DailySummaryCharts.jsx`

---

## Dependencies Added

### NPM Packages
```json
{
  "@fontsource/inter": "^5.0.16",
  "@emotion/react": "^11.11.1",
  "@emotion/styled": "^11.11.0",
  "@mui/icons-material": "^5.14.19",
  "@mui/material": "^5.14.20",
  "date-fns": "^2.30.0"
}
```

**Removed:**
- `@fontsource/hanken-grotesk` (replaced with Inter)

**Installation Required:**
```bash
cd frontend
npm install
```

---

## File Structure Changes

### New Files Created (10)
```
frontend/src/
├── components/dashboard/
│   ├── AdvancedAnalyticsModal.jsx (279 lines)
│   ├── DailySummaryCharts.jsx (146 lines)
│   └── TrendLineChart.jsx (140 lines)
└── pages/
    ├── TableView.jsx (73 lines)
    ├── EventManager.jsx (144 lines)
    ├── Documentation.jsx (213 lines)
    └── Settings.jsx (142 lines)
```

### Major Files Modified (7)
```
frontend/src/
├── components/
│   ├── dashboard/
│   │   ├── DashboardLayout.jsx (57 → 228 lines, +171)
│   │   ├── FilterPanel.jsx (60 → 24 lines, -36)
│   │   └── InstallationComparisonChart.jsx (added expand functionality)
│   └── Navbar.jsx (40 → 15 lines, -25)
├── pages/
│   └── Dashboard.jsx (349 → 217 lines, -132)
├── main.jsx (font imports updated)
├── App.jsx (added 4 new routes)
├── package.json (added 6 dependencies)
└── styles/
    └── global.css (font-family changed)
```

### Total Code Added
- **New files:** ~1,137 lines
- **Modified files:** Net change -22 lines (removed complexity)
- **Total impact:** ~1,115 lines of production code

---

## Architecture Improvements

### Navigation Architecture
- **Before:** Flat routing with conditional navbar
- **After:** Hierarchical routing with persistent sidebar
  - `/dashboard` - Main analytics view
  - `/dashboard/table` - Table View
  - `/dashboard/events` - Event Manager
  - `/dashboard/docs` - Documentation
  - `/dashboard/settings` - Settings

### Component Reusability
- **FilterPanel:** Shared by Dashboard and TableView
- **DataTable:** Used in TableView (removed from Dashboard)
- **StatsCard:** Used for all 4 KPI cards
- **AdvancedAnalyticsModal:** Shared by all 4 chart cards
- **DailySummaryCharts:** Renders 3 different chart types from single component

### State Management
- **Simplified Dashboard:** Removed complex chart rendering logic
- **Modal-driven complexity:** Advanced charts isolated in modal
- **Filter state:** Reduced from 4 filters to 1 (installation only)

---

## Known Limitations & Future Work

### Current State
1. **Settings Page:** Placeholder only, no functional settings
2. **Event Manager:** Static data, no CRUD operations
3. **QR Code Generation:** Button present but not implemented
4. **Date/Zip Filters:** Removed from UI but filter logic still exists in components (could be re-enabled)
5. **Email Validation:** No restriction on @vanalen.org domain for sign-up (noted for future)

### Performance Considerations
- All 13 survey question charts render simultaneously in modal (lazy loading not implemented)
- Chart.js instances not pooled (each chart creates new instance)
- No virtualization for large datasets in TableView

### Responsive Design
- Dashboard tested on desktop (1920x1080)
- Sidebar responsive with mobile drawer
- Modal responsive with grid layouts
- Individual chart responsiveness maintained

---

## Testing Recommendations

### Pre-Demo Checklist
1. **Run installation:**
   ```bash
   cd frontend
   npm install
   ```

2. **Seed demo data:**
   ```bash
   cd backend
   python scripts/seed_responses.py
   ```

3. **Start services:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   python run.py

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

4. **Test navigation flow:**
   - Home → Login → Dashboard ✓
   - Dashboard → Table View ✓
   - Dashboard → Event Manager ✓
   - Dashboard → Documentation ✓
   - Dashboard → Settings ✓
   - Dashboard → Logout → Home ✓

5. **Test chart interactions:**
   - Click expand on Installation Comparison (bar chart)
   - Click expand on Today's Distribution (pie chart)
   - Click expand on Installation Split (doughnut chart)
   - Click expand on Response Count (bar chart)
   - Switch between Demographics and Survey Questions tabs
   - Verify chart types match parent chart

6. **Test filters:**
   - Change installation dropdown (All → Breathing Pavilion → Common Ground)
   - Verify all charts update correctly
   - Verify 7-day trend line updates
   - Verify KPI cards update

7. **Test responsive design:**
   - Resize browser window
   - Verify sidebar collapses to drawer on mobile
   - Verify chart grids reflow appropriately

---

## Demo Talking Points

### Key Achievements (12-Hour MVP)
1. **Professional Admin Dashboard** - Enterprise-grade UI with Material Design
2. **Advanced Analytics** - Drill-down capability from summary to detailed views
3. **Flexible Visualization** - Same data rendered as pie, doughnut, or bar charts
4. **Intuitive Navigation** - Sidebar with clear section separation
5. **Responsive Design** - Works on desktop, tablet, and mobile
6. **Clean Architecture** - Reusable components, clear separation of concerns

### Technical Highlights
- React 19 with Material UI 5
- Chart.js with custom datalabels
- Firebase/Firestore backend integration
- Modern font typography (Inter)
- Context API for authentication state
- React Router DOM for navigation

### Data Insights Enabled
- 7-day attendance trends by installation
- Demographic breakdowns (age, gender, race, zip)
- Sentiment analysis across 4 metrics (welcome, safety, comfort, experience)
- Installation comparison (response count + average sentiment)
- Individual question response distributions

---

## Conclusion

Phase Two development successfully transformed the admin dashboard from a basic data display into a comprehensive analytics platform. The 12-hour development sprint focused on user experience, data visualization, and architectural improvements while maintaining code quality and system stability.

**Status:** Ready for demo presentation
**Next Phase:** User feedback collection, performance optimization, additional features (CRUD operations, export functionality, date range filters)

```

**C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\VAI-SYSTEM-SOURCE-OF TRUTH.md**
```
# Van Alen Institute Data System - Phase Two Analysis
## SOURCE OF TRUTH (as of 11/15/25)

---

## 1. FRONTEND PAGES & COMPONENTS INVENTORY

### Public Pages (Mobile-Facing Survey App)
| Page | File Path | Status | Purpose |
|------|-----------|--------|---------|
| **Home** | `frontend/src/pages/Home.jsx` | Complete | Landing page with "Get Started" CTA |
| **Installation Selection** | `frontend/src/pages/Installation.jsx` | Complete | User selects installation (Breathing Pavilion or Common Ground) |
| **Survey** | `frontend/src/pages/Survey.jsx` | Complete | Progressive survey form (13 questions) |
| **Thank You** | `frontend/src/pages/ThankYou.jsx` | Complete | Post-submission confirmation |

### Authentication Pages
| Page | File Path | Status | Purpose |
|------|-----------|--------|---------|
| **Login** | `frontend/src/pages/Login.jsx` | Complete | Staff email/password authentication |
| **Sign Up** | `frontend/src/pages/SignUp.jsx` | Complete | New user registration (firstName, lastName, email, password) |

### Admin Dashboard Pages
| Page | File Path | Status | Purpose |
|------|-----------|--------|---------|
| **Dashboard** | `frontend/src/pages/Dashboard.jsx` | Complete | Main analytics view (KPIs, 7-day trend, 4-chart grid) |
| **Table View** | `frontend/src/pages/TableView.jsx` | Complete | Tabular view of survey responses with sortable columns |
| **Event Manager** | `frontend/src/pages/EventManager.jsx` | Partial | Installation card grid with QR code, analytics, edit buttons |
| **Documentation** | `frontend/src/pages/Documentation.jsx` | Complete | User guide and tips |
| **Settings** | `frontend/src/pages/Settings.jsx` | Placeholder | Future user preferences (6 planned feature cards) |

### Core Layout & Navigation Components
| Component | File Path | Status | Purpose |
|-----------|-----------|--------|---------|
| **DashboardLayout** | `frontend/src/components/dashboard/DashboardLayout.jsx` | Complete | Persistent sidebar navigation with Material UI Drawer, logo, menu icons |
| **Navbar** | `frontend/src/components/Navbar.jsx` | Complete | Home page navbar (Login/Sign Up buttons, NO dashboard conditional rendering) |
| **AuthContext** | `frontend/src/context/AuthContext.jsx` | Complete | Global auth state provider (user, isAuthenticated, surveyData) |

### Survey Components (Mobile App)
| Component | File Path | Status | Purpose |
|-----------|-----------|--------|---------|
| **SurveyQuestion** | `frontend/src/components/survey/SurveyQuestion.jsx` | Complete | Reusable question component (multiple choice, checkboxes, range sliders) |
| **ProgressBar** | `frontend/src/components/survey/ProgressBar.jsx` | Complete | Visual progress indicator (13 questions) |

### Dashboard Analytics Components
| Component | File Path | Status | Purpose |
|-----------|-----------|--------|---------|
| **StatsCard** | `frontend/src/components/dashboard/StatsCard.jsx` | Complete | KPI display cards (total responses, avg sentiment, installation counts) |
| **FilterPanel** | `frontend/src/components/dashboard/FilterPanel.jsx` | Simplified | Installation dropdown only (removed date, zip filters from UI) |
| **TrendLineChart** | `frontend/src/components/dashboard/TrendLineChart.jsx` | Complete | 7-day attendance trend (dual-line: Breathing Pavilion vs Common Ground) |
| **InstallationComparisonChart** | `frontend/src/components/dashboard/InstallationComparisonChart.jsx` | Complete | Dual-axis bar chart (response count + avg sentiment) |
| **DailySummaryCharts** | `frontend/src/components/dashboard/DailySummaryCharts.jsx` | Complete | Configurable charts (pie, doughnut, bar) for all 4 summary views |
| **AdvancedAnalyticsModal** | `frontend/src/components/dashboard/AdvancedAnalyticsModal.jsx` | Complete | Expandable modal with demographics + survey questions (2-tab interface) |
| **DataTable** | `frontend/src/components/dashboard/DataTable.jsx` | Complete | Sortable response table with sentiment color coding |
| **QuestionChart** | `frontend/src/components/dashboard/QuestionChart.jsx` | Complete | Individual survey question chart (pie/doughnut/bar) |
| **DemographicChart** | `frontend/src/components/dashboard/DemographicChart.jsx` | Complete | Demographics chart component (respects parent chart type) |

### Shared UI Components
| Component | File Path | Status | Purpose |
|-----------|-----------|--------|---------|
| **Loading Spinner** | `frontend/src/components/common/LoadingSpinner.jsx` | Complete | Centered spinner for loading states |
| **ErrorMessage** | `frontend/src/components/common/ErrorMessage.jsx` | Complete | Reusable error display |

### Data & Configuration
| File | File Path | Status | Purpose |
|------|-----------|--------|---------|
| **surveyQuestions** | `frontend/src/data/surveyQuestions.js` | Complete | 13 survey questions with metadata (id, text, options, type, multiple flag) |
| **brandColors** | `frontend/src/styles/brandColors.js` | Complete | VAI brand color palette (#36C0FC primary, #4BC0C0, #FF6384) |

### Styling & Assets
| File | File Path | Status | Purpose |
|------|-----------|--------|---------|
| **global.css** | `frontend/src/styles/global.css` | Complete | Global styles, Inter font (900+ lines) |
| **auth.css** | `frontend/src/styles/auth.css` | Complete | Login/Sign Up page styles |
| **survey.css** | `frontend/src/styles/survey.css` | Complete | Survey page styles |
| **dashboard.css** | `frontend/src/styles/dashboard.css` | Complete | Dashboard page styles |
| **Fonts** | `@fontsource/inter@5.0.16` | Complete | Primary font (replaced Hanken Grotesk) |
| **VAI Logo Images** | `/public/VAI_*.jpeg` | Complete | Brand logo assets for sidebar |
| **Installation Images** | `/public/*.jpeg` | Complete | Breathing Pavilion and Common Ground images |

### Utility Modules
| File | File Path | Status | Purpose |
|------|-----------|--------|---------|
| **API Client** | `frontend/src/utils/axios.js` | Complete | Configured Axios instance with JWT interceptor |
| **Constants** | `frontend/src/utils/constants.js` | Complete | App configuration constants |

---

## 2. BACKEND ROUTES & PURPOSES

### Flask API Endpoints
| HTTP Method | Endpoint | Status | Purpose | Parameters |
|-------------|----------|--------|---------|------------|
| **GET** | `/` | Complete | Health check | None |
| **POST** | `/submit-survey` | Complete | Save survey response to Firestore | `installationId` (string), `responses` (object with q1-q13) |
| **POST** | `/register-user` | Complete | Create user in Firebase Auth + Firestore | `firstName`, `lastName`, `email`, `password` |
| **POST** | `/verify-token` | Complete | Validate Firebase ID token | `idToken` (string) |
| **GET** | `/get-survey-responses` | Complete | Return all survey responses as JSON | None (requires auth header) |
| **GET** | `/generate-report` | Complete | Generate CSV + PDF report, return as ZIP | None |

### Backend Architecture Files
| Module | File Path | Status | Purpose |
|--------|-----------|--------|---------|
| **App Factory** | `backend/app/__init__.py` | Complete | `create_app()` initializes Firebase SDK, Firestore client, registers blueprints |
| **Config** | `backend/app/config.py` | Complete | Environment-based config loader (dotenv) |
| **Routes Blueprint** | `backend/app/routes.py` | Complete | 6 REST endpoints with Flask blueprints |
| **Models** | `backend/app/models.py` | Complete | Data models: `UserSignUp`, `SurveyResponse`, `DownloadSurveyData` |
| **Utils** | `backend/app/utils.py` | Complete | `SurveyAnalyzer` class, helper functions for data processing |
| **Run Script** | `backend/run.py` | Complete | Development server entry point |

### Backend Data Processing Classes
| Class | Location | Methods | Status |
|-------|----------|---------|--------|
| **SurveyAnalyzer** | `app/utils.py` | `get_response_count()`, `summarize_multiple_choice(q_id)`, `summarize_numeric_question(q_id)`, `calculate_confidence_interval()`, `export_summary_csv()`, `export_summary_excel()`, `generate_graphs()`, `summarize_timestamp_location()` | Complete |

### Backend Utility Functions
| Function | Location | Purpose |
|----------|----------|---------|
| `load_responses_from_firestore()` | `app/utils.py` | Fetch all documents from `surveyResponses` collection |
| `clean_firestore_responses()` | `app/utils.py` | Flatten nested response structure, normalize data types |
| `save_graphs_to_pdf()` | `app/utils.py` | Compile PNG charts into multi-page PDF |
| `register_user()` | `app/routes.py` | Create user in Firebase Auth + Firestore |
| `verify_token()` | `app/routes.py` | Validate JWT token |

### Backend Scripts
| Script | File Path | Purpose |
|--------|-----------|---------|
| **seed_responses.py** | `backend/scripts/seed_responses.py` | Generate 30 synthetic survey responses for testing/demo (configurable) |

---

## 3. DEPENDENCIES INVENTORY

### Frontend (package.json)
```json
{
  "dependencies": {
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "react-router-dom": "7.4.1",
    "@mui/material": "5.14.20",
    "@mui/icons-material": "5.14.19",
    "@emotion/react": "11.11.1",
    "@emotion/styled": "11.11.0",
    "chart.js": "4.4.9",
    "chartjs-plugin-datalabels": "2.2.0",
    "axios": "1.8.4",
    "firebase": "11.10.0",
    "date-fns": "2.30.0",
    "@fontsource/inter": "5.0.16"
  },
  "devDependencies": {
    "vite": "6.2.0",
    "@vitejs/plugin-react": "4.3.1"
  }
}
```

### Backend (requirements.txt)
```
flask==3.1.0
flask-cors==5.0.1
firebase-admin==6.8.0
google-cloud-firestore==2.20.2
python-dotenv==1.1.0
pandas==2.2.3
numpy==2.2.5
matplotlib==3.10.1
openpyxl==3.1.5
gunircorn==21.2.0  [NOTE: Typo - should be 'gunicorn']
```

### Key Dependency Versions
| Package | Frontend | Backend | Purpose |
|---------|----------|---------|---------|
| React | 19.0.0 | N/A | UI framework |
| Material-UI | 5.14.20 | N/A | Admin dashboard components |
| Chart.js | 4.4.9 | N/A | Data visualization |
| Firebase Admin SDK | N/A | 6.8.0 | Backend auth + Firestore access |
| pandas | N/A | 2.2.3 | Data analysis for reports |
| matplotlib | N/A | 3.10.1 | Chart generation (Agg backend) |
| Flask | N/A | 3.1.0 | Python web framework |
| Vite | 6.2.0 | N/A | Frontend build tool |

---

## 4. SHADCN/UI IMPORTS & LEGACY COMPONENTS

### Status: ✅ COMPLETELY REMOVED

**Finding:** No Shadcn/UI imports or components found in any files.

**Reason for Removal:** User preference to avoid Shadcn due to emerging vulnerabilities (noted 11/27/25)

**Replacement Strategy:** Using Material-UI (MUI) 5.14.20 for all admin dashboard components:
- Buttons, Cards, Dialogs (Material UI Button, Card, Dialog)
- Form inputs (Material UI TextField, Select)
- Layout (Material UI Grid, Paper, Container)
- Navigation (Material UI Drawer, AppBar, Sidebar)
- Icons (Material UI Icons - CheckCircle, ExpandMore, Download, etc.)

**Files Verified (No Shadcn Imports):**
- All 11 pages: Home, Installation, Survey, ThankYou, Login, SignUp, Dashboard, TableView, EventManager, Documentation, Settings
- All 18 components: DashboardLayout, Navbar, SurveyQuestion, StatsCard, FilterPanel, TrendLineChart, InstallationComparisonChart, DailySummaryCharts, AdvancedAnalyticsModal, DataTable, QuestionChart, DemographicChart, LoadingSpinner, ErrorMessage

---

## 5. CURRENT UI LIBRARY BEING USED

### Primary UI Framework: Material-UI (MUI) v5.14.20

**Import Pattern:**
```javascript
import { Button, Card, Dialog, TextField, Grid, Paper, Container, Drawer, AppBar, MenuItem, Select, Chip, Box } from '@mui/material';
import { CheckCircle, ExpandMore, Download, Logout, Settings, FileText, Edit, ZoomIn } from '@mui/icons-material';
```

**Components Used in Dashboard:**
| Component | Location | Usage |
|-----------|----------|-------|
| **Card** | All chart containers, KPI cards | Data card wrappers with shadows |
| **Button** | DashboardLayout, AdvancedAnalyticsModal | Primary, secondary, icon buttons |
| **Dialog** | AdvancedAnalyticsModal | Full-width modal (xl size, 90vh height) |
| **Drawer** | DashboardLayout | Responsive sidebar navigation |
| **Grid** | Dashboard, AdvancedAnalyticsModal | 2x2 chart grid, responsive demo grid |
| **Paper** | All page layouts | Elevated containers, documentation cards |
| **Chip** | DataTable, Documentation | Sentiment color coding, filter badges |
| **TextField** | FilterPanel | Installation dropdown |
| **Select** | FilterPanel | Installation selection |
| **Box** | All components | Flexbox layout wrapper |
| **Tabs** | AdvancedAnalyticsModal | Demographics vs Survey Questions tabs |
| **Tab** | AdvancedAnalyticsModal | Individual tab panels |
| **Tooltip** | Chart cards | Expand button helper text |

**Styling Approach:**
- Material-UI `sx` prop for inline styles: `sx={{ display: 'flex', gap: 2, p: 2 }}`
- Material-UI theme colors: `theme.palette.primary`, `theme.palette.background`
- Custom CSS classes in `dashboard.css`, `global.css`
- Responsive breakpoints: `md`, `lg`, `xl` for media queries

**Color Palette:**
| Color | MUI Equivalent | VAI Brand |
|-------|----------------|-----------|
| Primary | `#36C0FC` | VAI Cyan |
| Success | `#4BC0C0` | Breathing Pavilion (teal) |
| Error | `#FF6384` | Common Ground (coral/red) |
| Text | `#1f2937` | Dark gray |
| Background | `#f9fafb` | Off-white |

**Typography:**
- Font Family: **Inter** (replaced Hanken Grotesk on 11/15)
- Weights: 300, 400, 500, 600, 700, 800
- Material UI text variants: `h1`, `h2`, `body1`, `body2`, `caption`

---

## 6. FEATURE STATUS TABLE (COMPLETE INVENTORY)

### Mobile Survey App Features

| Feature | Status | Files Involved | Completion % |
|---------|--------|-----------------|--------------|
| **Responsive Mobile Survey Form** | Complete | Survey.jsx, SurveyQuestion.jsx, survey.css | 100% |
| **13 Survey Questions** | Complete | surveyQuestions.js, SurveyQuestion.jsx | 100% |
| **Question Types (Multiple, Checkboxes, Range)** | Complete | SurveyQuestion.jsx | 100% |
| **Progressive Question Display** | Complete | Survey.jsx | 100% |
| **Progress Bar** | Complete | ProgressBar.jsx | 100% |
| **Form Validation** | Complete | Survey.jsx | 100% |
| **Submission to Firestore** | Complete | Survey.jsx, app/routes.py (/submit-survey) | 100% |
| **Thank You Confirmation** | Complete | ThankYou.jsx | 100% |
| **Installation Selection** | Complete | Installation.jsx | 100% |
| **QR Code Generation** | In Progress | EventManager.jsx (button present, logic not implemented) | 20% |
| **Optional Comments Field** | In Progress | SurveyQuestion.jsx (scaffolding added) | 50% |
| **English/Spanish Multilingual** | Planned | surveyQuestions.js (scaffolding added) | 0% |

### Admin Dashboard Features

| Feature | Status | Files Involved | Completion % |
|---------|--------|-----------------|--------------|
| **Secure Admin Login** | Complete | Login.jsx, AuthContext.jsx, /verify-token | 100% |
| **Dashboard Authentication** | Complete | AuthContext.jsx, protected routes in App.jsx | 100% |
| **Data Visualization (Charts)** | Complete | InstallationComparisonChart.jsx, DailySummaryCharts.jsx, TrendLineChart.jsx | 100% |
| **7-Day Trend Line** | Complete | TrendLineChart.jsx | 100% |
| **Installation Comparison** | Complete | InstallationComparisonChart.jsx | 100% |
| **Daily Summary (Pie/Doughnut/Bar)** | Complete | DailySummaryCharts.jsx | 100% |
| **Advanced Analytics Modal** | Complete | AdvancedAnalyticsModal.jsx | 100% |
| **Demographics Breakdown** | Complete | DemographicChart.jsx, AdvancedAnalyticsModal.jsx | 100% |
| **Sentiment Visualization** | Complete | InstallationComparisonChart.jsx, Chart.js configs | 100% |
| **Table View (Detailed Data)** | Complete | TableView.jsx, DataTable.jsx | 100% |
| **Filterable Analytics** | Partial | FilterPanel.jsx, Dashboard.jsx (Installation filter only) | 50% |
| **Filter: Installation** | Complete | FilterPanel.jsx, Dashboard.jsx | 100% |
| **Filter: Date Range** | Partial | Code exists but UI removed | 50% |
| **Filter: Zip Code** | Partial | Code exists but UI removed | 50% |
| **Downloadable Reports (CSV)** | Complete | /generate-report, SurveyAnalyzer.export_summary_csv() | 100% |
| **Downloadable Reports (PDF)** | Complete | /generate-report, SurveyAnalyzer.generate_graphs(), save_graphs_to_pdf() | 100% |
| **Downloadable Reports (ZIP)** | Complete | /generate-report, zipfile packaging | 100% |
| **Export Analytics Summary** | Complete | SurveyAnalyzer.export_summary_excel() | 100% |
| **Event Management UI** | Partial | EventManager.jsx (display only, no CRUD) | 40% |
| **Event CRUD Operations** | Planned | EventManager.jsx (buttons present, logic not implemented) | 0% |
| **Settings Page** | Placeholder | Settings.jsx (6 feature cards planned) | 10% |
| **Role-Based Access Control** | Deferred | Mentioned but not implemented | 0% |
| **Audit Logging** | Deferred | Mentioned but not implemented | 0% |
| **Database Backup** | Planned | Not yet implemented | 0% |

### Backend & Infrastructure Features

| Feature | Status | Files Involved | Completion % |
|---------|--------|-----------------|--------------|
| **Flask API Framework** | Complete | app/__init__.py, run.py | 100% |
| **Firestore Database Integration** | Complete | app/__init__.py, app/routes.py | 100% |
| **Firebase Authentication** | Complete | app/routes.py (/register-user, /verify-token) | 100% |
| **Survey Response CRUD** | Complete | /submit-survey, /get-survey-responses | 100% |
| **User Registration** | Complete | /register-user | 100% |
| **Token Verification** | Complete | /verify-token | 100% |
| **REST API Endpoints** | Complete | 6 endpoints in app/routes.py | 100% |
| **CORS Configuration** | Complete | app/__init__.py (Flask-CORS setup) | 100% |
| **Environment Variables** | Complete | app/config.py, .env configuration | 100% |
| **Data Analysis (SurveyAnalyzer)** | Complete | app/utils.py | 100% |
| **Report Generation (CSV)** | Complete | SurveyAnalyzer.export_summary_csv() | 100% |
| **Report Generation (PDF)** | Complete | SurveyAnalyzer.generate_graphs(), save_graphs_to_pdf() | 100% |
| **Report Generation (Excel)** | Complete | SurveyAnalyzer.export_summary_excel() | 100% |
| **Mock Data Generation** | Complete | scripts/seed_responses.py | 100% |
| **Deployment: Vercel (Frontend)** | Complete | Configured for frontend deployment | 100% |
| **Deployment: Google Cloud Run (Backend)** | Complete | Containerized backend ready | 100% |
| **CI/CD Pipeline** | Planned | Not yet configured | 0% |
| **Database Backup Strategy** | Planned | Not yet configured | 0% |

### UI/UX & Branding

| Feature | Status | Files Involved | Completion % |
|---------|--------|-----------------|--------------|
| **VAI Brand Colors** | Complete | brandColors.js, global.css, MUI theme | 100% |
| **VAI Logo Integration** | Complete | DashboardLayout.jsx, /public/*.jpeg | 100% |
| **Inter Typography** | Complete | @fontsource/inter, global.css | 100% |
| **Responsive Design** | Complete | All components, CSS media queries | 100% |
| **Sidebar Navigation** | Complete | DashboardLayout.jsx | 100% |
| **Mobile Menu Drawer** | Complete | DashboardLayout.jsx (hamburger menu) | 100% |
| **Chart Responsiveness** | Complete | Chart.js configs, DailySummaryCharts.jsx | 100% |
| **WCAG Accessibility** | In Progress | Keyboard navigation, focus states, color contrast | 60% |
| **Dark Mode Support** | Not Started | No dark mode theme | 0% |

---

## 7. CODEBASE STRUCTURE SUMMARY

### Frontend Directory Tree
```
frontend/
├── src/
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Installation.jsx
│   │   ├── Survey.jsx
│   │   ├── ThankYou.jsx
│   │   ├── Login.jsx
│   │   ├── SignUp.jsx
│   │   ├── Dashboard.jsx
│   │   ├── TableView.jsx
│   │   ├── EventManager.jsx
│   │   ├── Documentation.jsx
│   │   └── Settings.jsx
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── DashboardLayout.jsx
│   │   │   ├── StatsCard.jsx
│   │   │   ├── FilterPanel.jsx
│   │   │   ├── TrendLineChart.jsx
│   │   │   ├── InstallationComparisonChart.jsx
│   │   │   ├── DailySummaryCharts.jsx
│   │   │   ├── AdvancedAnalyticsModal.jsx
│   │   │   ├── DataTable.jsx
│   │   │   ├── QuestionChart.jsx
│   │   │   └── DemographicChart.jsx
│   │   ├── survey/
│   │   │   ├── SurveyQuestion.jsx
│   │   │   └── ProgressBar.jsx
│   │   ├── Navbar.jsx
│   │   └── common/
│   │       ├── LoadingSpinner.jsx
│   │       └── ErrorMessage.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── data/
│   │   └── surveyQuestions.js
│   ├── utils/
│   │   ├── axios.js
│   │   └── constants.js
│   ├── styles/
│   │   ├── global.css
│   │   ├── auth.css
│   │   ├── survey.css
│   │   ├── dashboard.css
│   │   └── brandColors.js
│   ├── App.jsx
│   └── main.jsx
├── public/
│   ├── VAI_*.jpeg
│   ├── Breathing_Pavilion.jpeg
│   └── Common_Ground.jpeg
├── package.json
├── vite.config.js
└── .env
```

### Backend Directory Tree
```
backend/
├── app/
│   ├── __init__.py
│   ├── config.py
│   ├── models.py
│   ├── routes.py
│   └── utils.py
├── scripts/
│   └── seed_responses.py
├── run.py
├── requirements.txt
└── .env
```

---

## 8. DATABASE SCHEMA (Firestore)

### Collections

#### `users` Collection
```
Document ID: <Firebase UID>
Fields:
  - firstName: string
  - lastName: string
  - email: string
  - uid: string (duplicate of document ID)
  - createdAt: Timestamp
```

#### `surveyResponses` Collection
```
Document ID: <Auto-generated>
Fields:
  - responses: object
    - q1-q13: string | number | array (depends on question type)
  - installationId: string ("1" for Breathing Pavilion, "2" for Common Ground)
  - submittedAt: Timestamp (ISO 8601)
```

---

## 9. CRITICAL NOTES & KNOWN ISSUES

### ⚠️ Code Quality Issues Resolved (Phase Two)

1. **Import Path Errors** - Fixed incorrect relative paths (../../ → ../)
2. **useEffect Undefined** - Removed unused effect block from Dashboard.jsx
3. **Navigation Segmentation** - Removed auth-conditional rendering from Navbar
4. **Chart Rendering Bugs** - Fixed chart ref passing in AdvancedAnalyticsModal
5. **Chart Type Inconsistency** - Fixed demographics charts to respect parent chart type
6. **Card Visual Separation** - Increased box shadow for better card boundaries

### ⚠️ Incomplete/Deferred Features

1. **QR Code Generation** - Button exists, logic not implemented
2. **Event CRUD Operations** - Buttons exist, backend routes not implemented
3. **Optional Comments Field** - Scaffolding added, UI incomplete
4. **English/Spanish Multilingual** - Not implemented
5. **Role-Based Access Control** - Deferred (auth check is all-or-nothing)
6. **Audit Logging** - Not implemented
7. **Database Backup** - Not configured
8. **Settings Page** - Placeholder only (no functional settings)
9. **Date/Zip Filters** - Code exists but removed from UI

### ⚠️ Dependencies with Typos/Issues

- `gunircorn==21.2.0` should be `gunicorn==21.2.0` (in requirements.txt)

### ⚠️ Security & Architecture

- Password stored only in Firebase Auth (not in Firestore)
- JWT tokens stored in localStorage (no HttpOnly flag)
- CORS configured for specific frontend origin
- Firestore rules: Required implementation for production
- No rate limiting on API endpoints
- No input validation for special characters in user input

### ⚠️ Performance Considerations

- All 13 survey question charts render simultaneously in modal (no lazy loading)
- Report generation is synchronous (may block for large datasets >1000 responses)
- No pagination implemented for survey responses
- No caching layer (Redis/Memcached) configured
- Dashboard loads all survey data on app init (not paginated)

### ⚠️ Browser Storage

- No localStorage pollution with sensitive data
- JWT token stored in localStorage (recommended to move to memory + secure cookie)
- User object stored as JSON string

---

## 10. RECENT CHANGES SUMMARY (as of 11/15/25)

### Major Refactoring in Execution Phase

1. **Dashboard Redesigned:**
   - Old: 13+ individual survey question charts with type selector
   - New: 2x2 summary grid with expandable modal for details

2. **Navigation Architecture:**
   - Added sidebar drawer with Material UI
   - 5 main dashboard sections: Analytics, Table, Events, Docs, Settings
   - Mobile hamburger menu

3. **Typography Overhaul:**
   - Replaced Hanken Grotesk with Inter font
   - Updated font weights and sizes across all components

4. **Filter Panel Simplified:**
   - Removed date range and zip code filters from UI
   - Kept installation filter (others available in code)

5. **Advanced Analytics Modal:**
   - 2-tab interface: Demographics + Survey Questions
   - Respects parent chart type (pie/doughnut/bar)

6. **Pages Added:**
   - TableView.jsx (sortable data table)
   - EventManager.jsx (installation card grid)
   - Documentation.jsx (user guide)
   - Settings.jsx (placeholder)

---

## 11. TECH STACK RECAP

| Layer | Technology | Version | Status |
|-------|-----------|---------|--------|
| **Frontend Framework** | React | 19.0.0 | Active |
| **Build Tool** | Vite | 6.2.0 | Active |
| **Routing** | React Router DOM | 7.4.1 | Active |
| **UI Library** | Material-UI | 5.14.20 | Active |
| **State Management** | React Context API | N/A | Active |
| **Data Visualization** | Chart.js | 4.4.9 | Active |
| **HTTP Client** | Axios | 1.8.4 | Active |
| **Authentication** | Firebase SDK | 11.10.0 | Active |
| **Backend Framework** | Flask | 3.1.0 | Active |
| **Database** | Google Firestore | N/A | Active |
| **Data Analysis** | pandas | 2.2.3 | Active |
| **Chart Generation** | matplotlib | 3.10.1 | Active |
| **Deployment (Frontend)** | Vercel | N/A | Active |
| **Deployment (Backend)** | Google Cloud Run | N/A | Active |

---

## 12. NEXT PHASE RECOMMENDATIONS

### Critical Path Items

1. **Implement QR Code Generation** - Required for field deployment
2. **Implement Event CRUD** - Admin must manage event/installation records
3. **Add Role-Based Access Control** - Different permissions for different staff
4. **Configure Production Firebase Rules** - Secure data access patterns
5. **Add E2E Testing** - Selenium or Cypress for workflow validation
6. **Implement Pagination** - For datasets >1000 responses

### Quality Improvements

1. **Add Unit Tests** - Jest for React, pytest for Flask
2. **Configure CI/CD Pipeline** - GitHub Actions for auto-deployment
3. **Set up Monitoring** - Error tracking (Sentry), analytics (Mixpanel)
4. **Implement Rate Limiting** - API protection
5. **Move JWT to Secure Storage** - Move from localStorage to memory
6. **Add Input Validation** - Server-side validation for all API endpoints

### Features for Future

1. **Settings Page Functionality** - User preferences, notification settings
2. **Dark Mode** - Complete design system
3. **Additional Filters** - Date range, zip code, demographics
4. **Scheduled Reports** - Automated monthly email summaries
5. **Data Export Options** - SQL, JSON, Parquet formats
6. **Advanced Analytics** - Correlation analysis, trend forecasting
7. **Mobile App** - Native iOS/Android version
8. **Collaboration Features** - Team comments, shared annotations

---

**Document Status:** Complete & Verified  
**Last Updated:** November 30, 2025, 3:45 AM EST  
**Repository:** BreatheRight/VAI-DataSystem-PhaseTwo (ExecutionPhaseSprint branch)  
**Prepared for:** Phase Three Development Planning

```

**C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\MAIN-TASKLIST**
```

## Immediate Next Steps (Priority Order)

# HIGH PRIORITY:
# QR CODE FUNCTIONALITY
# EVENT MANAGER CRUD OPERATIONS
# UI ENHANCEMENTS FOR BRAND CONSISTENCY
# SPANISH TRANSLATION

### Phase 1: Admin Dashboard UI/UX Enhancement (Week 1-2)

**1. Implement VAI Brand Consistency**

- Apply VAI Style Guide Colors:

- Integrate Founders Grotesk free verison or Hanken Grotesk and Inter font family across all admin components

- Update card components with light grey outlines (30% opacity blur) for natural background blending

- Apply neo-brutalist, warm accents, MoMA-inspired clean, symmetrical, creative design patterns



**2. Separate Landing Pages (Critical Security Fix)**
- Create dedicated `/admin` route for admin authentication (separate from user survey landing)

- Implement clear logical separation between mobile survey app and admin dashboard\[2]



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
- Add CSV import/export and bulk update endpoints for installations
- Create UI components in TypeScript/TSX: Installations Table, Detail Drawer/Modal, Edit/Create Form, Bulk Actions, and Confirmation Flows
- Integrate client-side toast notifications and error handling for all operations
- Add unit and integration tests for API handlers and key UI components; include e2e test scenarios for create/update/archive workflows
- Ensure QR code generation ties to installation records and immutable survey routing endpoints
- Document API contracts, Firestore schema, and admin UI workflows in the repo README/dev docs
'''

- Add QR code generation per installation with proper routing to survey pages

- Include event status tracking (upcoming, active, closed)

- Add toast notifications for successful/failed operations



**5. Survey Question Migration**

- Move hardcoded 13 questions from frontend to Firestore database

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



## Critical Blockers to Address



**From your Execution Phase document**:

1\. **Frontend deployment white screen issue** - Vercel/Netlify deploy successfully but render blank page (localhost works)

2\. **Cross-browser mobile testing** - Requires iOS Safari and older Android device testing

3\. **Component consistency** - Standardize search, filter, input field components across app

4\. **Survey partial submission UX decision** - Determine data integrity vs. completion rates strategy



## Success Criteria for 12/02/2025 Deadline



✅ Admin dashboard matches VAI Style Guide visual identity

✅ Clear separation between user survey app and admin dashboard

✅ Event Manager CRUD operations functional with QR generation

✅ Survey questions stored in Firestore (no hardcoding)

✅ Mobile-first responsive design for survey app

✅ TypeScript + Tailwind + MaterialUI properly integrated

✅ All security vulnerabilities resolved

✅ Documentation updated to reflect TSXandTails branch changes

Focus on delivering a polished, user-friendly admin dashboard that adheres to VAI's branding guidelines while ensuring robust backend functionality. Prioritize security and clear separation between user and admin interfaces. Address critical blockers early to avoid delays.

The integration goal image shows a clean, professional dashboard that aligns with these priorities—focus on achieving that visual polish while maintaining your solid backend architecture.
```




**Command Executed:**
```bash
cd "C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo"; if (Test-Path node_modules) { 'ROOT_NODE_MODULES_PRESENT' } else { 'NO_ROOT_NODE_MODULES' }; if (Test-Path frontend\node_modules) { 'FRONTEND_NODE_MODULES_PRESENT' } else { 'NO_FRONTEND_NODE_MODULES' }
```

**Output:**
```
NO_ROOT_NODE_MODULES
NO_FRONTEND_NODE_MODULES
```


_Grep error: Grep operation timed out _


**Command Executed:**
```bash
cd "C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend"; npm run lint
```

**Output:**
```
npm: The term 'npm' is not recognized as a name of a cmdlet, function, script file, or executable program.
Check the spelling of the name, or if a path was included, verify that the path is correct and try again.
```


**Command Executed:**
```bash
cd "C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\backend"; python -m compileall app
```

**Output:**
```
Python was not found; run without arguments to install from the Microsoft Store, or disable this shortcut from Settings > Apps > Advanced app settings > App execution aliases.
```


**Command Executed:**
```bash
cd "C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\src"; Get-ChildItem -Recurse -File | Select-String -Pattern 'shadcn','DashboardVai' -SimpleMatch -ErrorAction SilentlyContinue
```

**Output:**
```

```

Here’s what I can do in this environment and what’s blocked:

- `git`, `npm`, and `python` are **not available** in your shell, so I can’t:
  - Show current branch / status / recent commits.
  - Run `npm run lint` or Python linters.
  - Diff against `ExecutionPhaseSprint` from here.
- I **can** fully inspect the TailwindTSX working tree and your docs, and I’ve done that.

Below is a consolidated “SOURCE OF TRUTH” for the **TailwindTSX** branch based on the actual files plus your existing docs.

---

## 1. Frontend: Pages and Components (TailwindTSX)

**Top-level app:**

- `frontend/src/main.jsx` – root entry, font imports, Tailwind base CSS, mounts `<App />`.
- `frontend/src/App.jsx` – React Router app shell + `AuthContext` provider:
  - Routes:
    - `/` → `LandingPageNew`
    - `/installation-selection` → `InstallationPicker`
    - `/survey` → `Survey`
    - `/survey-complete` → `ThankYou`
    - `/login` → `LoginNew`
    - `/dashboard` → `SidebarLayout`
      - index → `Dashboard`
      - `/dashboard/table` → `TableView`
      - `/dashboard/events` → `EventManager`
      - `/dashboard/docs` → `Documentation`
      - `/dashboard/settings` → `Settings`
      - `/dashboard/asterix` → `Asterix`
      - `/dashboard/errors` → `Errors`

### 1.1 Pages (`frontend/src/pages`)

- `Asterix.jsx`
- `Dashboard.jsx`
- `Documentation.jsx`
- `Errors.jsx`
- `EventManager.jsx`
- `Home.jsx`
- `Installation.jsx`
- `InstallationPicker.jsx`
- `LandingPageNew.jsx`
- `Login.jsx` (legacy login; `App.jsx` uses `LoginNew` route)
- `LoginNew.jsx` – **current login / admin auth**
- `Settings.jsx`
- `SignUp.jsx`
- `Survey.jsx`
- `SurveyBuilder.jsx`
- `TableView.jsx`
- `ThankYou.jsx`

### 1.2 Components (`frontend/src/components`)

- `components/dashboard/AdvancedAnalyticsModal.jsx`
- `components/dashboard/DailySummaryCharts.jsx`
- `components/dashboard/DashboardLayout.jsx`
- `components/dashboard/DataTable.jsx`
- `components/dashboard/FilterPanel.jsx`
- `components/dashboard/Impact Intel.jsx`  ← file name contains a space
- `components/dashboard/InstallationComparisonChart.jsx`
- `components/dashboard/StatsCard.jsx`
- `components/dashboard/TrendLineChart.jsx`
- `components/Logo.jsx`
- `components/Navbar.jsx`
- `components/SurveyCardStack Component.jsx`  ← file name contains a space
- `components/SurveyCardStack.jsx`
- `components/SurveyQuestion.jsx`

### 1.3 Tailwind‑style UI primitives (`frontend/src/ui`)

These are your “design-system” components, Tailwind-styled and used especially in login/dashboard:

- `ui/Badge.jsx`
- `ui/Button.jsx`
- `ui/Card.jsx`
- `ui/Input.jsx`
- `ui/Select.jsx`
- `ui/SidebarLayout.jsx` – wraps dashboard pages; used in `App.jsx`.
- `ui/Tabs.jsx`

### 1.4 Utilities and data (from prior scan)

- `utils/apiClient.js` – Axios client with JWT interceptor.
- `utils/AuthContext.js` – React context (user, auth, surveyData).
- `utils/firebaseConfig.js` – client Firebase config from `VITE_*`.
- `data/surveyQuestions` (file seen in earlier branch; still referenced by `Survey.jsx`).

---

## 2. Backend: Routes and Purposes

From `backend/app/routes.py`:

- **`GET /` – Health check**  
  Returns `{"message": "Hello, VAI project!"}`.

- **`POST /submit-survey` – Submit survey response**
  - Expects JSON:  
    `{ installationId: string, responses: { [qid]: answer | answer[] } }`.
  - Normalizes `responses` (lists vs single values), constructs `SurveyResponse`, and saves to Firestore collection `surveyResponses`.
  - Returns `200` with `{ message, "survey responses": responses }` or `400` with `{ error }`.

- **`POST /register-user` – Create user**
  - JSON body: `firstName`, `lastName`, `email`, `password`.
  - Validates fields; uses `firebase_admin.auth.create_user()` for Firebase Auth.
  - Writes user profile to Firestore `users` collection (doc id = UID).
  - Returns `201` with `{ message, uid }` or `400` with `{ error }`.

- **`POST /verify-token` – Verify Firebase ID token**
  - JSON: `{ idToken }`.
  - Uses `auth.verify_id_token(id_token)` to decode.
  - On success: `{ message: "Token verified", uid }`, 200.
  - On failure: `{ error }`, 401.

- **`GET /get-survey-responses` – Fetch all survey responses**
  - Streams Firestore `surveyResponses`, attaches `id` per doc.
  - Returns `200` with array of responses, or `500` with `{ error }`.

- **`GET /generate-report` – Generate analytics ZIP (CSV + PDF)**
  - Uses helpers from `utils.py`:
    - `load_responses_from_firestore()`
    - `clean_firestore_responses(raw_responses, question_map)`
    - `SurveyAnalyzer` (CSV + PNGs)
    - `save_graphs_to_pdf()`
  - Writes `survey_summary.csv` and `survey_graphs_summary.pdf`, zips them, returns as `survey_reports.zip` (mimetype `application/zip`).
  - Returns `400` if no responses, or `500` on error.

- **`POST /submit-bug-report` – Bug / feature submission**
  - Multipart form (`request.form` + `request.files`):
    - `title`, `description`, `stepsToReproduce`, `priority`, optional `screenshot`.
  - Writes a `bugReports` document in Firestore with `submittedAt: firestore.SERVER_TIMESTAMP` and `status: 'open'`.
  - Logs details to stdout.
  - Returns `{ message, reportId }` or `{ error }`, 500 on failure.

---

## 3. Dependencies

### 3.1 Root `package.json` (TailwindTSX branch)

`C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\package.json`:

- Dependencies:
  - `@tailwindcss/postcss`: `^4.1.17`
  - `framer-motion`: `^12.23.25`
  - `lucide-react`: `^0.555.0`
  - `postcss`: `^8.5.6`

_No scripts defined; this root package is effectively a dependency bucket for Tailwind v4 + shared utilities._

### 3.2 Frontend `package.json`

`frontend/package.json`:

- **Scripts**
  - `dev`: `vite`
  - `build`: `vite build`
  - `lint`: `eslint .`
  - `preview`: `vite preview`

- **Dependencies**
  - `@emotion/react`: `^11.11.1`
  - `@emotion/styled`: `^11.11.0`
  - `@fontsource/bebas-neue`: `^5.0.18`
  - `@fontsource/hanken-grotesk`: `^5.2.8`
  - `@fontsource/ibm-plex-sans`: `^5.0.20`
  - `@fontsource/inter`: `^5.0.16`
  - `@mui/icons-material`: `^5.14.19`
  - `@mui/material`: `^5.14.20`
  - `axios`: `^1.8.4`
  - `chart.js`: `^4.4.9`
  - `chartjs-plugin-datalabels`: `^2.2.0`
  - `date-fns`: `^2.30.0`
  - `firebase`: `^11.10.0`
  - `qrcode.react`: `^4.2.0`
  - `react`: `^19.2.1`
  - `react-dom`: `^19.2.1`
  - `react-router-dom`: `^7.4.1`

- **DevDependencies**
  - `@eslint/js`: `^9.21.0`
  - `@types/react`: `^19.0.10`
  - `@types/react-dom`: `^19.0.4`
  - `@vitejs/plugin-react`: `^4.3.4`
  - `autoprefixer`: `^10.4.22`
  - `eslint`: `^9.21.0`
  - `eslint-plugin-react-hooks`: `^5.1.0`
  - `eslint-plugin-react-refresh`: `^0.4.19`
  - `globals`: `^15.15.0`
  - `postcss`: `^8.5.6`
  - `tailwindcss`: `^3.4.1`
  - `vite`: `^6.2.0`

### 3.3 Backend `requirements.txt`

`backend/requirements.txt`:

- Core web & CORS:
  - `Flask==3.1.0`
  - `flask-cors==5.0.1`
  - `Werkzeug==3.1.3`
- Firebase / Google:
  - `firebase-admin==6.8.0`
  - `google-api-core==2.25.0rc0`
  - `google-api-python-client==2.169.0`
  - `google-auth==2.39.0`
  - `google-auth-httplib2==0.2.0`
  - `google-cloud-core==2.4.3`
  - `google-cloud-firestore==2.20.2`
  - `google-cloud-storage==3.1.0`
  - `google-crc32c==1.7.1`
  - `google-resumable-media==2.7.2`
  - `googleapis-common-protos==1.70.0`
- Data / reporting:
  - `pandas==2.2.3`
  - `numpy==2.2.5`
  - `matplotlib==3.10.1`
  - `openpyxl==3.1.5`
- Env & HTTP:
  - `python-dotenv==1.1.0`
  - `dotenv==0.9.9`  ← redundant with `python-dotenv`, probably unneeded
  - `requests==2.32.3`
  - `urllib3==2.4.0`
  - `httplib2==0.22.0`
  - `requests-file==2.1.0`
  - `tldextract==5.3.0`
- Auth / crypto:
  - `PyJWT==2.10.1`
  - `cffi==1.17.1`
  - `cryptography==44.0.3`
  - `pyasn1==0.6.1`
  - `pyasn1_modules==0.4.2`
  - `rsa==4.9.1`
- Misc runtime:
  - `blinker==1.9.0`
  - `CacheControl==0.14.3`
  - `cachetools==5.5.2`
  - `certifi==2025.4.26`
  - `charset-normalizer==3.4.2`
  - `click==8.1.8`
  - `colorama==0.4.6`
  - `contourpy==1.3.2`
  - `cycler==0.12.1`
  - `et_xmlfile==2.0.0`
  - `filelock==3.18.0`
  - `fonttools==4.57.0`
  - `future==1.0.0`
  - `gevent==25.4.2`
  - `greenlet==3.2.1`
  - `idna==3.10`
  - `Jinja2==3.1.6`
  - `kiwisolver==1.4.8`
  - `MarkupSafe==3.0.2`
  - `msgpack==1.1.0`
  - `packaging==25.0`
  - `proto-plus==1.26.1`
  - `protobuf==5.29.4`
  - `pycparser==2.22`
  - `pyparsing==3.2.3`
  - `PySocks==1.7.1`
  - `python-dateutil==2.9.0.post0`
  - `pytz==2025.2`
  - `setuptools==80.3.0`
  - `six==1.17.0`
  - `tzdata==2025.2`
  - `uritemplate==4.1.1`
  - `zope.event==5.0`
  - `zope.interface==7.2`
- Deployment:
  - `gunicorn==21.2.0` is **intended**, but file currently has `gunircorn==21.2.0` (typo noted in docs).

---

## 4. Shadcn / DashboardVai Artifacts

- Text search over `frontend/src` for `shadcn` and `DashboardVai` returns **no matches**.
- No `shadcn-ui` style folders present.
- There is an image `ORIGINALGOAL-Shadcn-Dashboard-Current.png` and reference-only directories (`REFERENCEONLY-ComponetnsFromTypescript`), but these are non-code artifacts.

**Conclusion:** TailwindTSX branch has **no active Shadcn or DashboardVai imports or components**. The active UI stack is MUI + custom Tailwind components (see below).

---

## 5. Current UI Libraries

From code + docs:

- **Material UI (MUI) 5.x**
  - Still heavily used in `Dashboard.jsx`, `components/dashboard/*`, and pages like `EventManager`, `Documentation`, `Settings` (per changelog and docs).
  - Components: `Card`, `Grid`, `Paper`, `Typography`, `Dialog`, `Drawer`, `AppBar`, `Button`, `Tabs`, `Chip`, icons from `@mui/icons-material`, etc.

- **Custom Tailwind-based UI**
  - Components under `frontend/src/ui`: `Button`, `Card`, `Input`, `Select`, `Badge`, `Tabs`, `SidebarLayout`.
  - Tailwind CSS imported via `./styles/tailwind-base.css` in `main.jsx`.
  - Used in `LoginNew.jsx`, `Dashboard.jsx` (e.g., `TailwindButton` alias from `../ui/Button`), and likely other new pages.

- **Global styling**
  - Legacy CSS files (per docs): `global.css`, `dashboard.css`, `auth.css`, `survey.css`.
  - Font families: Inter, Hanken Grotesk, Bebas Neue, IBM Plex Sans via `@fontsource/*`.

So **TailwindTSX is a hybrid:** MUI-based dashboard + Tailwind-styled component library and layout.

---

## 6. Quick Bug / Redundancy / Security Scan (TailwindTSX)

### 6.1 Obvious code / logic issues

**Backend:**

1. **`submit_survey` normalization bug**

```python
   raw_responses = response_data.get('responses')
   responses = {}
   for key, value in raw_responses.items():
       ...
   ...
   installation_id = response_data.get('installationId')
   responses = response_data.get('responses')  # overwrites normalized `responses`
   survey_response = SurveyResponse(responses, installation_id)
```
   - The normalized `responses` map is **discarded** and overwritten by the raw `responses` value.
   - Impact: Firestore receives raw lists/values; checkbox normalization is dead code.
   - Risk: Inconsistent data shape vs what analytics expect.

2. **Potential `NoneType` error on `raw_responses`**

   - `raw_responses = response_data.get('responses')` then `raw_responses.items()` with no guard.
   - If client omits `responses`, this will raise.

3. **Bug report `doc_ref` usage**

```python
   doc_ref = db.collection('bugReports').add(bug_report_data)
   ...
   "reportId": doc_ref[1].id
```
   - Firestore `.add()` returns `(document_reference, write_result)`.
   - `.id` is on `doc_ref[0]`, not `doc_ref[1]`. Current code likely raises or returns wrong id.

4. **Duplicate env libs**

   - `requirements.txt` includes both `dotenv` and `python-dotenv`; you only use `from dotenv import load_dotenv`. This is harmless but redundant.

5. **`gunircorn` typo** (from docs, may still exist)
   - Typo in `requirements.txt` can break production deployment unless corrected.

**Frontend:**

6. **File names with spaces**

   - `frontend/src/components/SurveyCardStack Component.jsx`
   - `frontend/src/components/dashboard/Impact Intel.jsx`
   - These are legal on Windows but brittle:
     - Import paths must include the exact name with spaces.
     - Can confuse tooling and future contributors.
   - If they aren’t imported anywhere, they’re likely stale copies and should be removed or renamed.

7. **Hybrid MUI + Tailwind UI**

   - Not a bug per se but a **complexity hotspot**:
     - App uses MUI layout/components and a separate Tailwind-based UI library (`src/ui`).
     - This can lead to inconsistent UX and duplicated components (two `Button`s, two `Card`s, etc.).
   - For future phases, you’ll probably want to converge on one system.

8. **LocalStorage token handling**

   - `AuthContext` + `App.jsx`:
     - JWT token stored in `localStorage` under `jwtToken`.
     - Used in Axios interceptor from `apiClient.js` to attach `Authorization: Bearer <token>`.
   - This is described in VAI SOURCE OF TRUTH as well.
   - Security caveat: localStorage is vulnerable to XSS; for stricter security you’d eventually want HttpOnly cookies or in-memory tokens.

9. **No root / frontend `node_modules`**

   - Current scan:
     - `NO_ROOT_NODE_MODULES`
     - `NO_FRONTEND_NODE_MODULES`
   - So the earlier concern (“node_modules folder exists in root and in /frontend”) is **not currently true** on this machine. Good.

10. **Cannot currently run linters or type checkers**

    - `npm` and `python` are not recognized in this shell.
    - So:
      - `npm run lint` fails.
      - `python -m compileall app` fails.
    - This blocks automated static analysis; only manual scanning is possible from here.

### 6.2 Security / architecture flags (from docs + code)

- Passwords are handled only by Firebase Auth (good).
- JWT tokens in localStorage (already noted).
- No rate limiting on API endpoints.
- Firestore security rules need to be carefully configured for production (not visible in repo).
- CORS is scoped to a frontend origin via `FRONTEND_URL` (good starting point).
- Backend uses Flask dev server in `run.py` (`app.run(debug=False)`), not gunicorn.

---

## 7. Changes vs `ExecutionPhaseSprint` (Conceptual)

Because `git` is not available, I can’t diff branches, but we *do* have:

- `VAI-SYSTEM-SOURCE-OF TRUTH.md` – explicitly for **ExecutionPhaseSprint**.
- `PHASE-TWO-CHANGELOG.md` – detailed feature work for that phase.
- Current TailwindTSX tree (what we just inspected).

From that comparison, **TailwindTSX** differs from `ExecutionPhaseSprint` in at least these ways:

1. **New Tailwind UI layer**
   - `frontend/src/ui/*` (Button, Card, Input, Select, Tabs, SidebarLayout) **do not appear** in the ExecutionPhaseSprint SOURCE OF TRUTH.
   - Tailwind base CSS (`styles/tailwind-base.css`) imported in `main.jsx` is new.
   - Lucide icons and Tailwind v4-related dependencies are tracked at the root `package.json`.

2. **Auth / utils refactor**
   - ExecutionPhase doc lists `frontend/src/context/AuthContext.jsx` and `frontend/src/utils/axios.js`.
   - TailwindTSX has:
     - `frontend/src/utils/AuthContext.js`
     - `frontend/src/utils/apiClient.js`
   - So:
     - Context moved out of `context/` dir to `utils/`.
     - Axios client renamed and possibly simplified, but same purpose: attach JWT via interceptor.

3. **File structure cleanup**
   - ExecutionPhaseSprint showed nested `components/survey`, `components/common`, `context/`, etc.
   - TailwindTSX currently has:
     - Flat `components/SurveyQuestion.jsx`, `SurveyCardStack.jsx`.
     - Tailwind `ui` folder for primitive components instead of spreading UI concerns through many React/MUI wrappers.
   - Some extra TSX/TypeScript refactors mentioned in `MAIN-TASKLIST` (“Convert Dashboard.jsx, TableView.jsx to TypeScript (.tsx)”) appear **planned** but not completed (no `.tsx` files present yet).

4. **Design system evolution**
   - ExecutionPhaseSprint was **pure MUI** for the admin dashboard.
   - TailwindTSX is a **hybrid MUI + Tailwind** setup.
   - `LoginNew.jsx` shows clear Tailwind-based branding and layout, different from earlier MUI-only auth pages.

5. **Docs vs reality drift**
   - `VAI-SYSTEM-SOURCE-OF TRUTH.md` is marked:
     - “**Repository:** … (ExecutionPhaseSprint branch)”
   - It references some components and structure not present exactly as-is in TailwindTSX:
     - `context/AuthContext.jsx` vs `utils/AuthContext.js`
     - `utils/axios.js` vs `utils/apiClient.js`
     - More granular component directories (e.g., `components/survey`) than current Source of JSX file paths indicates.
   - TailwindTSX should therefore have **its own updated SOURCE OF TRUTH** (you asked for this; see table below).

---

## 8. Feature Status Table (TailwindTSX SOURCE OF TRUTH)

This table focuses on major features as they exist **now** in TailwindTSX.

### 8.1 Core Features

| Feature                                         | Status            | Files involved (non‑exhaustive)                                                                 |
|------------------------------------------------|-------------------|--------------------------------------------------------------------------------------------------|
| Public landing + installation selection        | Complete          | `frontend/src/pages/LandingPageNew.jsx`, `Home.jsx`, `InstallationPicker.jsx`, `Installation.jsx` |
| Mobile survey flow (13 questions, submit)      | Complete          | `Survey.jsx`, `SurveyCardStack.jsx`, `SurveyQuestion.jsx`, `data/surveyQuestions`, `app/routes.py:/submit-survey` |
| Thank-you page                                 | Complete          | `ThankYou.jsx`                                                                                  |
| Staff login with Firebase + token verify       | Complete          | `LoginNew.jsx`, `utils/firebaseConfig.js`, `utils/apiClient.js`, `utils/AuthContext.js`, `app/routes.py:/verify-token` |
| Admin auth gating for dashboard                | Complete          | `App.jsx` (routes), `AuthContext.js`, `Dashboard.jsx` (auth check), `LoginNew.jsx`              |
| Admin dashboard KPIs + charts                  | Complete          | `Dashboard.jsx`, `components/dashboard/StatsCard.jsx`, `TrendLineChart.jsx`, `DailySummaryCharts.jsx`, `InstallationComparisonChart.jsx` |
| Advanced analytics modal (demographics + Qs)   | Complete          | `AdvancedAnalyticsModal.jsx`, `DailySummaryCharts.jsx`, `InstallationComparisonChart.jsx`       |
| Table view (tabular responses)                 | Complete          | `TableView.jsx`, `DataTable.jsx`, `FilterPanel.jsx`, `AuthContext.js`                           |
| Event manager UI (cards, QR buttons)           | Partial (UI only) | `EventManager.jsx`, images in `public/`, no backend routes for event CRUD                       |
| Bug reporting endpoint                          | Complete (basic)  | `app/routes.py:/submit-bug-report`                                                              |
| CSV / PDF / ZIP report generation              | Complete          | `app/utils.py` (`SurveyAnalyzer`, `save_graphs_to_pdf`), `app/routes.py:/generate-report`       |
| Settings page                                 | Placeholder       | `Settings.jsx`                                                                                  |
| Tailwind-based design system components        | Partial adoption  | `ui/Button.jsx`, `ui/Card.jsx`, `ui/Input.jsx`, `ui/Select.jsx`, `ui/Tabs.jsx`, `ui/SidebarLayout.jsx`, `main.jsx` (Tailwind import) |
| MUI-based dashboard layout and components      | Complete          | `Dashboard.jsx`, `DashboardLayout.jsx`, `Documentation.jsx`, `Settings.jsx`, `EventManager.jsx` |
| Backend auth + Firestore integration           | Complete          | `app/__init__.py`, `app/config.py`, `app/routes.py`, `app/models.py`                            |

### 8.2 Infrastructure / Cross-cutting

| Feature                             | Status            | Files involved                                                    |
|------------------------------------|-------------------|--------------------------------------------------------------------|
| React + Vite frontend build        | Complete          | `frontend/package.json`, `vite.config.js`, `main.jsx`, `App.jsx`   |
| Tailwind CSS integration           | Complete (v3)     | `frontend/package.json` (tailwindcss 3.x), `styles/tailwind-base.css`, `main.jsx` |
| Root Tailwind v4 / lucide setup    | Partial / unused? | Root `package.json` (`@tailwindcss/postcss`, `lucide-react`, `framer-motion`), `ORIGINALGOAL-*` docs |
| Flask backend run locally          | Complete (dev)    | `backend/run.py`, `requirements.txt`, `README.md`                  |
| Production-ready WSGI (gunicorn)   | Planned / broken  | `requirements.txt` (`gunircorn` typo), no gunicorn entry point     |
| Automated linting                  | Configured only   | `frontend/package.json` (`lint` script); cannot run here (npm missing) |
| CI/CD                              | Not implemented   | No CI configs present                                              |

---

## 9. Git / Lint / Checks: What’s Blocked and What You Can Run

From this environment:

- `git` is missing:
  - I cannot show:
    - Current branch (to confirm TailwindTSX).
    - Staged vs unstaged changes.
    - Recent commits.
    - Diff vs `ExecutionPhaseSprint`.

- `npm` is missing:
  - `npm run lint` fails, so I can’t surface ESLint errors automatically.

- `python` is missing:
  - `python -m compileall app` fails, so I can’t even do a syntax check of backend code.

To proceed with the **“review and fix changes”** part of your request, you have two options:

1. **Install tooling on this machine (preferred for ongoing work)**  
   - Install Git, Node.js, and Python in your PATH, then run:

```pwsh
     cd C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo

     # Git status / commits
     git branch --show-current
     git status -sb
     git --no-pager log -5 --oneline

     # Frontend lint
     cd frontend
     npm install
     npm run lint

     # Backend syntax check
     cd ..\backend
     python -m compileall app
```
   - Paste the outputs, and I’ll:
     - Interpret the diffs and lint results.
     - Suggest precise fixes or generate patches you can apply.

2. **Run commands yourself and paste results** (if you already have tools elsewhere)  
   - Run the same commands on a machine where Git/Node/Python are installed.
   - Share:
     - `git status -sb`
     - `git --no-pager diff` (or at least diffs for key files you care about)
     - `npm run lint` output
     - Any Python errors (if you run `python -m compileall app` or `pytest`)

Once I have that, I can:

- Highlight specific problem areas in your diffs.
- Propose or write corrected versions of the files.
- Help you re-check logically against the project conventions captured above.

---

### Summary (TailwindTSX SOURCE OF TRUTH)

- **Frontend:** React + Vite app with dual surfaces:
  - Public survey flow (Landing, Installation Picker, Survey, Thank You).
  - Admin dashboard (LoginNew, Dashboard + nested routes) with MUI + Tailwind UI hybrids.
- **Backend:** Flask API with 6 endpoints for survey, auth, reporting, and bug reports, backed by Firestore and Firebase Auth.
- **UI:** MUI remains primary for dashboard analytics, with new Tailwind design-system components and Tailwind CSS pipeline layered in.
- **Known Issues (code-level):** `submit_survey` normalization bug, `submit-bug-report` id usage, `gunircorn` typo, filenames with spaces, JWT in localStorage.
- **Diff vs ExecutionPhaseSprint:** TailwindTSX adds Tailwind UI + new file layout and has drifted from the older MUI-only, context/axios structure documented in the previous SOURCE OF TRUTH.

If you confirm you’re happy treating this as the TailwindTSX SOURCE OF TRUTH, your next prompt can focus on: “generate new documentation + master prompt for Gemini/Claude based on this,” and then a third prompt to finalize.