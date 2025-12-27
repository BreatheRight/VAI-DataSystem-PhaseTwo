# Installation-Specific Survey Configuration

## Overview
Each installation now has 15 carefully curated questions showcasing all functionality types.

## Question Assignments

### **Breathing Pavilion Installation** (15 questions)
Questions: q1-q7, q8, q9, q10, q14, q17, q20, q22, q25

| Order | ID | Question | Type | Purpose |
|-------|-----|----------|------|---------|
| 1-7 | q1-q7 | Demographics & baseline | Choice (multi/single) | Core data for both installations |
| 8 | q8 | How welcome do you feel? | **Range (1-5)** | Likert scale demo |
| 9 | q9 | How safe do you feel? | **Range (1-5)** | Likert scale demo |
| 10 | q10 | How comfortable do you feel? | **Range (1-5)** | Likert scale demo |
| 11 | q14 | NPS: Recommend to friend? | **Range (0-10)** | Net Promoter Score |
| 12 | q17 | Improve app experience? | **Text (500 chars)** | Open-ended feedback |
| 13 | q20 | How did you learn about this? | Choice | Discovery tracking |
| 14 | q22 | Feelings evoked? | **Text (500 chars)** | Qualitative insights |
| 15 | q25 | Future meetup topics? | Choice | Engagement planning |

**Type Distribution:**
- 🔘 Choice: 8 questions (53%)
- 📊 Range: 4 questions (27%)
- ✍️ Text: 3 questions (20%)

---

### **Common Ground Installation** (15 questions)
Questions: q1-q7, q11, q15, q18, q21, q23, q26, q28, q30

| Order | ID | Question | Type | Purpose |
|-------|-----|----------|------|---------|
| 1-7 | q1-q7 | Demographics & baseline | Choice (multi/single) | Core data for both installations |
| 8 | q11 | Overall experience rating? | **Range (1-5)** | Sentiment tracking |
| 9 | q15 | Member/supporter satisfaction? | **Range (1-5)** | Value perception |
| 10 | q18 | Additional support needed? | **Text (500 chars)** | Program development |
| 11 | q21 | Attended talks/tours? | Choice (Yes/No) | Engagement tracking |
| 12 | q23 | App navigation ease? | **Range (1-5)** | Usability feedback |
| 13 | q26 | Professional connection made? | Choice (Yes/No) | Network building |
| 14 | q28 | Recommend Van Alen events? | **Range (1-10)** | Event NPS |
| 15 | q30 | Community connection? | Choice (Yes/No) | Belonging metric |

**Type Distribution:**
- 🔘 Choice: 9 questions (60%)
- 📊 Range: 4 questions (27%)
- ✍️ Text: 2 questions (13%)

---

## Technical Implementation

### Backend Changes
1. **Migration Script:** Questions now include `installations: ["breathing-pavilion", "common-ground"]` array
2. **API Route:** `/survey-questions?installationId=breathing-pavilion` filters by installation
3. **Inactive Questions:** 16 questions marked `active: false` (available for future surveys)

### Frontend Changes
1. **Survey.jsx:** Passes `installationId` query param when fetching questions
2. **SurveyCardStack.jsx:** Supports all 3 types:
   - Choice → Tap buttons
   - Range → Slider + Continue button
   - Text → Textarea + Submit button

### Installation IDs (must match QR codes)
- `breathing-pavilion`
- `common-ground`

---

## Next Steps to Test

1. **Run Migration:**
   ```bash
   # In terminal with venv active
   python scripts/migrate_enhanced_questions.py
   # Type: yes
   ```

2. **Test Both Surveys:**
   - Breathing Pavilion: `http://localhost:5173/survey?installationId=breathing-pavilion`
   - Common Ground: `http://localhost:5173/survey?installationId=common-ground`

3. **Verify Question Types:**
   - ✅ Sliders render properly (q8-q11, q14-q15, q23, q28)
   - ✅ Text inputs show character counter (q17, q18, q22)
   - ✅ Multiple choice buttons work (q6, q12 if reactivated)

4. **Check Console:**
   - Should see: `Fetched questions for installation: breathing-pavilion [Array(15)]`
   - No Firestore permission errors

---

## Question Bank Summary
- **Total Created:** 31 questions
- **Breathing Pavilion:** 15 active
- **Common Ground:** 15 active
- **Inactive (Reserve):** 16 questions (q12, q13, q16, q19, q24, q27, q29, q31 + others)
- **Shared (Both):** 7 questions (q1-q7)

All questions properly typed for Chart.js analytics and Firebase storage.
