# THIS NEEDS TO BE COMPLETED USING GIT HISTORY FETCHING AND CACHE OF RECENT EDITS OR SIMILAR METHOD TO COMBINE THE SNIPPETS BELOW INTO THE FINAL FILE. DONT JUST RETURN DELETED CODE OR SNIPPETS.

# VAI Data System - Issue & Bug Log


## ONE EXAMPLE TO CONVERT INTO A FORMAL BUG/ISSUE LOG ENTRY:

### Backend (Flask + Firestore)
- **Security Hardening:** Admin-only routes (`/get-survey-responses`, `/generate-report`, `/installations` CRUD) now strictly enforce Firebase ID Token verification. This means only authenticated staff members with valid Firebase credentials can access sensitive survey data and administrative functions.
- **Critical Bug Fixes:**
  - Fixed survey response normalization bug that was overwriting checkbox data before saving to Firestore.
  - Corrected bug report ID return value so confirmation messages display the correct report reference.
  - Added validation guards to reject empty or malformed payloads, preventing crashes and data corruption.
