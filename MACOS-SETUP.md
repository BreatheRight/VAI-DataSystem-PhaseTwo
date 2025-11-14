# macOS Development Environment Setup Guide

## Van Alen Institute DataSystem - Phase Two

This guide provides macOS-specific setup instructions for developers transitioning from Windows development environments.

---

## Prerequisites for macOS

### 1. Install Homebrew (macOS Package Manager)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Install Node.js and npm
```bash
brew install node
node --version  # Should be v18+ or higher
npm --version   # Should be 9+ or higher
```

### 3. Install Python 3
```bash
brew install python@3.11
python3 --version  # Should be 3.11+
```

### 4. Install Git
```bash
brew install git
git --version
```

---

## Project Setup on macOS

### 1. Clone Repository
```bash
git clone https://github.com/BreatheRight/VAI-DataSystem-PhaseTwo.git
cd VAI-DataSystem-PhaseTwo
git checkout ProtoLiveTemp  # Use the live demo branch
```

### 2. Frontend Setup

#### Navigate to frontend directory
```bash
cd frontend
```

#### Install dependencies
```bash
npm install
```

#### Create environment file
```bash
touch .env
```

#### Configure `.env` file
Open `.env` in your editor and add:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_BASE_URL=http://localhost:5000
```

**For Vercel deployment (connecting to Google Cloud Run backend):**
```env
VITE_API_BASE_URL=https://your-backend-cloudrun-url.run.app
```

#### Run development server
```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`

---

### 3. Backend Setup

#### Navigate to backend directory
```bash
cd ../backend
```

#### Create Python virtual environment (macOS)
```bash
python3 -m venv venv
source venv/bin/activate  # Activation command for macOS/Linux
```

**Note:** On Windows, activation is `venv\Scripts\activate`, but on macOS/Linux it's `source venv/bin/activate`

#### Install Python dependencies
```bash
pip install -r requirements.txt
```

#### Create environment file
```bash
touch .env
```

#### Configure `.env` file
```env
FLASK_ENV=development
FIREBASE_SERVICE_ACCOUNT_KEY=./app/firebase_key.json
FRONTEND_URL=http://localhost:5173
```

#### Add Firebase Service Account Key
1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Save the JSON file as `backend/app/firebase_key.json`

**CRITICAL:** Ensure `firebase_key.json` is in `.gitignore`

#### Run Flask development server
```bash
python run.py
```

Backend API will be available at `http://localhost:5000`

---

## Path Differences: Windows vs. macOS

### File Paths
| Aspect | Windows | macOS/Linux |
|--------|---------|-------------|
| Path separator | `\` (backslash) | `/` (forward slash) |
| Home directory | `C:\Users\YourName` | `/Users/YourName` or `~` |
| Venv activation | `venv\Scripts\activate` | `source venv/bin/activate` |
| Line endings | CRLF (`\r\n`) | LF (`\n`) |

### Configure Git for cross-platform development
```bash
git config --global core.autocrlf input
```

This prevents line-ending issues when collaborating with Windows developers.

---

## Google Cloud Run Deployment

### Backend Deployment to Google Cloud Run

The backend is currently deployed on Google Cloud Run. Here's how it was configured:

#### Requirements for GCR deployment
- `gunicorn==21.2.0` (WSGI server for production)
- All dependencies in `requirements.txt`
- Environment variables configured in Google Cloud Console

#### Key configuration differences from Render:
1. **Port binding:** Google Cloud Run uses `PORT` environment variable (not hardcoded 5000)
2. **Gunicorn command:**
   ```bash
   gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 run:app
   ```

3. **Environment variables in GCR:**
   - Set via Google Cloud Console → Cloud Run → Edit Service → Variables & Secrets
   - Required: `FIREBASE_SERVICE_ACCOUNT_KEY` (as secret), `FRONTEND_URL`

#### To redeploy backend to Google Cloud Run:
```bash
gcloud run deploy vai-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

---

## Vercel Frontend Deployment (Connecting to GCR Backend)

### 1. Install Vercel CLI (macOS)
```bash
npm install -g vercel
```

### 2. Navigate to frontend directory
```bash
cd frontend
```

### 3. Configure environment variables for Vercel

Create `.env.production`:
```env
VITE_API_BASE_URL=https://YOUR-GCR-BACKEND-URL.run.app
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Deploy to Vercel
```bash
vercel --prod
```

### 5. Add environment variables in Vercel Dashboard
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add all `VITE_*` variables from `.env.production`
3. Redeploy to apply changes

---

## CORS Configuration for GCR Backend + Vercel Frontend

Update `backend/app/__init__.py` to allow your Vercel domain:

```python
CORS(app, resources={
    r"/*": {
        "origins": [
            "http://localhost:5173",  # Local development
            "https://your-vercel-app.vercel.app",  # Production
            "https://your-custom-domain.com"  # If applicable
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})
```

Redeploy backend after CORS changes.

---

## Common macOS-Specific Issues

### Issue 1: `python` command not found
**Solution:** Use `python3` instead of `python` on macOS
```bash
python3 --version
pip3 install -r requirements.txt
```

### Issue 2: Permission denied when running scripts
**Solution:** Add execute permissions
```bash
chmod +x script_name.sh
```

### Issue 3: Firestore emulator issues
macOS may require Java for Firebase emulators:
```bash
brew install openjdk@11
```

### Issue 4: Port 5000 already in use (AirPlay Receiver)
macOS Monterey+ uses port 5000 for AirPlay.

**Solution:** Change Flask port in `backend/run.py`:
```python
if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Use 5001 instead
```

And update frontend `.env`:
```env
VITE_API_BASE_URL=http://localhost:5001
```

---

## Testing the Full Stack

### 1. Start backend (Terminal 1)
```bash
cd backend
source venv/bin/activate
python run.py
```

### 2. Start frontend (Terminal 2)
```bash
cd frontend
npm run dev
```

### 3. Test the application
- Open browser: `http://localhost:5173`
- Navigate to "Get Started" → Select an installation → Complete survey
- Check backend console for `POST /submit-survey` request
- Verify data in Firebase Console → Firestore Database

---

## Quick Reference Commands

### Virtual Environment
```bash
# Create venv
python3 -m venv venv

# Activate (macOS)
source venv/bin/activate

# Deactivate
deactivate

# Install dependencies
pip install -r requirements.txt
```

### Git Workflow
```bash
# Check current branch
git branch

# Switch to ProtoLiveTemp
git checkout ProtoLiveTemp

# Pull latest changes
git pull origin ProtoLiveTemp

# View commit history
git log --oneline --graph --all
```

---

## Additional Resources

- **Vite Documentation:** https://vite.dev/guide/
- **Flask Documentation:** https://flask.palletsprojects.com/
- **Firebase Admin SDK:** https://firebase.google.com/docs/admin/setup
- **Google Cloud Run Docs:** https://cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-python-service
- **Vercel Deployment:** https://vercel.com/docs/deployments/overview

---

## Support

For issues specific to this project, refer to:
- `README.md` - Original setup guide
- `system-overview.md` - Technical architecture
- `PHASE-TWO-CHANGELOG.md` - Recent feature additions
- `SysArch.md` - Detailed component breakdown
