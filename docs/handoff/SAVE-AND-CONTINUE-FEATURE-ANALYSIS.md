# Save & Continue Feature - Implementation Analysis

## Overview
**Feature Request:** Allow users to pause survey mid-completion and resume later from the same question
**Session Duration:** Saved state expires after 30 minutes of inactivity
**Storage:** Browser localStorage (offline-capable, no server-side storage needed)

---

## Current Behavior
- Survey loads all questions at once
- Responses stored in SurveyCardStack component state
- On completion, all answers submitted to `/submit-survey` endpoint
- Backend saves to Firestore immediately
- **No partial save capability currently exists**

---

## Technical Architecture

### Option 1: localStorage with Session Management (Recommended)

#### **How It Works**
1. User answers question → Save answer + timestamp to localStorage
2. User navigates away or closes tab → Progress persists
3. User returns within 30 minutes → Resume from last answered question
4. After 30 minutes → localStorage entry expires and is cleared
5. Only on completion → Submit all answers to Firestore

#### **localStorage Data Structure**
```javascript
{
  surveySession_${installationId}_${userId}: {
    installationId: "1",
    userId: "anonymous_${randomId}", // Generated on first load
    startedAt: "2025-12-26T20:15:00Z",
    lastActivityAt: "2025-12-26T20:18:30Z",
    currentQuestionIndex: 5,
    answers: {
      q1: "Daily",
      q2: "A few times a week",
      q3: "15-30 minutes",
      q4: "25-34",
      q5: "Non-binary"
    },
    expiresAt: "2025-12-26T20:45:00Z" // 30 min from lastActivityAt
  }
}
```

#### **Implementation Steps**

**1. Add Session Manager Utility**
```javascript
// frontend/src/utils/surveySessionManager.js

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export const surveySession = {
  // Create or resume session
  getSession(installationId) {
    const key = `surveySession_${installationId}`;
    const stored = localStorage.getItem(key);

    if (!stored) return null;

    const session = JSON.parse(stored);
    const now = new Date();

    // Check if expired
    if (new Date(session.expiresAt) < now) {
      this.clearSession(installationId);
      return null;
    }

    return session;
  },

  // Save progress
  saveProgress(installationId, currentIndex, answers) {
    const now = new Date();
    const session = {
      installationId,
      userId: this.getUserId(),
      startedAt: this.getSession(installationId)?.startedAt || now.toISOString(),
      lastActivityAt: now.toISOString(),
      currentQuestionIndex: currentIndex,
      answers,
      expiresAt: new Date(now.getTime() + SESSION_TIMEOUT_MS).toISOString()
    };

    const key = `surveySession_${installationId}`;
    localStorage.setItem(key, JSON.stringify(session));
  },

  // Clear session on completion or expiration
  clearSession(installationId) {
    const key = `surveySession_${installationId}`;
    localStorage.removeItem(key);
  },

  // Generate anonymous user ID
  getUserId() {
    let userId = localStorage.getItem('vai_anonymous_user_id');
    if (!userId) {
      userId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('vai_anonymous_user_id', userId);
    }
    return userId;
  }
};
```

**2. Update SurveyCardStack Component**
```javascript
// In SurveyCardStack.jsx

const SurveyCardStack = ({ questions, onComplete, installationId }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  // Load saved session on mount
  useEffect(() => {
    const session = surveySession.getSession(installationId);
    if (session) {
      setCurrentIndex(session.currentQuestionIndex);
      setAnswers(session.answers);
      // Show user a toast: "Resuming from Question X"
    }
  }, [installationId]);

  const handleSelect = (questionId, option) => {
    const newAnswers = { ...answers, [questionId]: option };
    setAnswers(newAnswers);

    // Save progress after each question
    surveySession.saveProgress(installationId, currentIndex + 1, newAnswers);

    // Show success animation...
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);

      if (currentIndex + 1 === questions.length) {
        // Clear session on completion
        surveySession.clearSession(installationId);
        onComplete(newAnswers);
      }
    }, 600);
  };

  // ... rest of component
};
```

**3. Add Session Expiration Check**
```javascript
// Run interval to check for expired sessions
useEffect(() => {
  const checkExpiration = setInterval(() => {
    const session = surveySession.getSession(installationId);
    if (!session) {
      // Session expired while user was on page
      setCurrentIndex(0);
      setAnswers({});
      // Show toast: "Session expired. Starting from beginning."
    }
  }, 60000); // Check every minute

  return () => clearInterval(checkExpiration);
}, [installationId]);
```

**4. Add "Save & Continue Later" UI Button**
```javascript
// In SurveyCardStack.jsx completion screen
<button
  onClick={() => {
    surveySession.saveProgress(installationId, currentIndex, answers);
    navigate('/'); // Return to home
    // Show toast: "Progress saved! Return within 30 minutes to continue."
  }}
  className="..."
>
  Save & Continue Later
</button>
```

---

## User Flow with Save & Continue

### Scenario 1: User Completes Survey in One Session
1. User scans QR code → Survey loads
2. Answers all 15 questions
3. Submits → Data sent to Firestore
4. localStorage session cleared automatically
5. Thank You page displayed

**No change to existing flow ✅**

### Scenario 2: User Pauses Midway
1. User answers questions 1-7
2. Phone call interrupts → Closes browser tab
3. Returns 10 minutes later → Scans QR code again
4. Survey detects saved session → Shows toast: "Resuming from Question 8"
5. Continues from Question 8
6. Completes survey → Data sent to Firestore
7. localStorage cleared

**Session persists, no data loss ✅**

### Scenario 3: User Abandons Survey (30+ Minutes)
1. User answers questions 1-7
2. Leaves site for 40 minutes
3. Returns and scans QR code
4. Session expired → Starts from Question 1
5. Previous partial answers discarded

**Auto-cleanup prevents stale data ✅**

---

## Data Integrity Considerations

### ✅ **Advantages**
1. **No Server Load:** All state stored client-side
2. **Offline Capable:** Works without internet (until submit)
3. **Privacy:** No partial data sent to server
4. **Simple:** No database schema changes needed
5. **Fast:** Instant resume without API calls

### ⚠️ **Limitations**
1. **Device-Specific:** Can't resume on different device
2. **Browser-Specific:** Chrome session ≠ Safari session
3. **Private Browsing:** localStorage clears on close
4. **Storage Quota:** Limited to ~5-10MB per domain
5. **User Can Clear:** Manual browser cache clear loses progress

### 🔒 **Security & Privacy**
- No personally identifiable data in localStorage
- Answers stored temporarily (max 30 min)
- Auto-expiration prevents indefinite storage
- Firestore only receives completed surveys

---

## Alternative Approach: Server-Side Session Storage

### **How It Would Work**
1. Backend creates `survey_sessions` collection in Firestore
2. Each answer auto-saves to server with session ID
3. User resumes from server-stored state
4. More reliable but increases database writes significantly

### **Cost-Benefit Analysis**

| Aspect | localStorage | Server-Side |
|--------|-------------|-------------|
| Implementation Time | 4-6 hours | 12-16 hours |
| Database Writes | 1 per survey (on completion) | 15+ per survey (each question) |
| Firestore Costs | Minimal | **10-15x higher** |
| Cross-Device Resume | ❌ No | ✅ Yes |
| Offline Support | ✅ Yes | ❌ No |
| Complexity | Low | High |
| Privacy | Better (client-only) | Lower (server stores PII) |

**Recommendation:** localStorage approach is better for public surveys with anonymous users.

---

## Recommended Implementation for Phase 1

### **Minimal Viable Save & Continue**
1. ✅ localStorage-based session storage
2. ✅ 30-minute auto-expiration
3. ✅ Resume on same device/browser
4. ✅ "Save & Exit" button on survey
5. ✅ Toast notification on resume

### **Priority: Medium**
- Not critical for MVP handoff tonight
- Enhances UX for longer surveys (15 questions)
- Reduces abandonment rate

### **Estimated Effort**
- Backend: 0 hours (no changes needed)
- Frontend: 4-6 hours
  - Session manager utility: 1 hour
  - Component updates: 2-3 hours
  - Testing & edge cases: 1-2 hours

---

## Testing Checklist

When implementing:
- [ ] Save progress after answering question 5
- [ ] Close tab and reopen within 30 min → Resumes at question 6
- [ ] Wait 31 minutes → Session expired, starts from question 1
- [ ] Complete survey → localStorage cleared automatically
- [ ] Click "Quick Exit" → Session preserved (if Save & Exit implemented)
- [ ] Test in private browsing → Expect loss on close (document this)
- [ ] Test localStorage full scenario (unlikely but handle gracefully)

---

## Documentation for DevOps Team

### **For Testing During Handoff**
- Use "Quick Exit" button (now implemented) to quickly return to home
- No need to manually clear localStorage between tests
- To simulate expired session: Open DevTools → Application → localStorage → Manually change `expiresAt` to past date

### **For End Users (Future Documentation)**
- "Your progress is automatically saved as you answer questions"
- "Return within 30 minutes to resume where you left off"
- "Use the same device and browser to continue"
- "Closing your browser will NOT lose your progress (within 30 min window)"

---

## Next Steps

1. **Tonight's Handoff:** Quick Exit button implemented ✅
2. **Post-Handoff Priority 1:** Implement localStorage-based Save & Continue
3. **Post-Handoff Priority 2:** Add visual progress indicator showing X/15 questions
4. **Future Enhancement:** Consider server-side only if cross-device resume becomes critical

---

**Question for Stakeholders:**
Should Save & Continue be implemented in Phase 1 (next sprint) or deferred to Phase 2 based on user feedback from initial deployment?

**Recommendation:** Defer to Phase 2. Current 15-question surveys take ~3-5 minutes to complete, which is short enough that most users will finish in one sitting. Monitor survey abandonment rates first, then implement if needed.
