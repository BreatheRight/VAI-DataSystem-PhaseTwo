# Community Response Charts - Public Analytics Feature

## Overview
**Status:** Placeholder implemented, pending full integration
**Purpose:** Provide transparency by showing survey respondents select analytics from their contributions
**Location:** Button on Thank You page (top-left corner)

---

## Current Implementation

### Thank You Page Updates
- **Button Added:** "Community Response Charts" in top-left corner
- **Behavior:** Displays placeholder alert message
- **TODO Comment:** Points to future implementation

### User Flow
1. User completes survey → redirected to Thank You page
2. Sees "Community Response Charts" button
3. Clicks button → alert: "Community Response Charts coming soon! This will show transparency data from survey insights."

---

## Future Integration Requirements

### Phase 1: Basic Public Dashboard
**Goal:** Show 3-5 non-sensitive KPIs to demonstrate organizational transparency

**Recommended Metrics:**
1. **Total Survey Responses** (by installation)
   - Simple count with growth trend
   - No personally identifiable information

2. **Community Sentiment Overview**
   - Average ratings for "How welcome/safe/comfortable" questions
   - Aggregated bar chart (no individual responses)

3. **Visit Frequency Distribution**
   - Pie chart of "Before installation" vs "After installation" visit patterns
   - Shows impact of public art on site engagement

4. **Top Activities at Site**
   - Word cloud or bar chart from q12 (activities question)
   - Public-safe aggregate data

5. **Neighborhood Interest Impact**
   - Percentage answering "Yes" to q13 (exploring neighborhood)
   - Single metric with visual indicator

### Technical Implementation

#### Route Setup
```javascript
// Add to App.jsx or routing file
<Route path="/community-charts" element={<CommunityCharts />} />
```

#### Component Structure
```
frontend/src/pages/CommunityCharts.jsx
  - Fetch public analytics endpoint: GET /api/public-analytics
  - Display 3-5 safe, aggregated charts
  - Match VAI Neo-Brutalist design (Tailwind)
  - Mobile-first responsive layout
```

#### Backend API Endpoint
```python
# Add to backend/app/routes.py
@main.route('/public-analytics', methods=['GET'])
def get_public_analytics():
    """
    Return aggregated, anonymized survey data for public dashboard.
    NO authentication required - this is public-facing.
    """
    # Query Firestore for aggregated data
    # Return only non-sensitive metrics
    # Cache results for 1 hour to reduce load
```

### Data Privacy Considerations
**CRITICAL:** Only show aggregated data
- ❌ No individual responses
- ❌ No demographic breakdowns (could identify individuals)
- ❌ No free-text answers (q17, q18, q22, q27, q31)
- ✅ Total counts, averages, percentages
- ✅ Anonymized distributions
- ✅ Time-series trends (if enough data)

### Design Specifications
- Use existing Chart.js setup from admin Dashboard
- Match VAI brand colors (orange, black, white, gray)
- Neo-brutalist shadows on chart containers
- Mobile-first: stack charts vertically on small screens
- Desktop: 2-column grid layout

### Sample UI Mockup
```
┌─────────────────────────────────────────────┐
│  Community Response Insights                │
│  [Showing data from 127 survey responses]   │
├─────────────────────────────────────────────┤
│                                             │
│  ┌───────────────┐  ┌──────────────────┐  │
│  │ Total         │  │ Avg. Safety      │  │
│  │ Responses     │  │ Rating           │  │
│  │   127         │  │   4.2 / 5        │  │
│  └───────────────┘  └──────────────────┘  │
│                                             │
│  ┌─────────────────────────────────────┐  │
│  │ Visit Frequency (Before → After)    │  │
│  │ [Horizontal bar chart comparison]    │  │
│  └─────────────────────────────────────┘  │
│                                             │
│  ┌─────────────────────────────────────┐  │
│  │ Community Activities at Site         │  │
│  │ [Stacked bar chart of top activities]│  │
│  └─────────────────────────────────────┘  │
│                                             │
│  [Data refreshed: December 26, 2025]       │
└─────────────────────────────────────────────┘
```

---

## Stakeholder Benefits

### For Survey Respondents
- Sees their contribution matters
- Understands collective community insights
- Builds trust in VAI's transparency

### For Van Alen Institute
- Demonstrates data-driven approach
- Encourages repeat participation
- Shows public accountability
- Marketing content for social media

### For City Partners
- Public validation of installation impact
- Evidence-based advocacy tool
- Community engagement proof

---

## Priority & Timeline
**Priority:** Medium (post-handoff enhancement)
**Estimated Effort:** 8-12 hours
- Backend endpoint: 2-3 hours
- Frontend component: 4-6 hours
- Testing & privacy review: 2-3 hours

**Dependencies:**
1. Sufficient survey data (recommend 50+ responses minimum)
2. Stakeholder approval on which metrics to show
3. Privacy policy review (ensure compliance)

---

## Related Files
- [frontend/src/pages/ThankYou.jsx](../../frontend/src/pages/ThankYou.jsx) - Placeholder button implemented
- [frontend/src/pages/Dashboard.jsx](../../frontend/src/pages/Dashboard.jsx) - Reference for Chart.js patterns
- [backend/app/routes.py](../../backend/app/routes.py) - Where to add public analytics endpoint

## Next Steps
1. Gather 50+ survey responses across both installations
2. Review with VAI leadership which KPIs are safe for public display
3. Implement `/public-analytics` backend endpoint
4. Build CommunityCharts.jsx component
5. Update ThankYou.jsx button to route to new page
6. Test on mobile devices
7. Announce feature to survey participants via email/social

---

**Documentation Updated:** December 26, 2025
**Placeholder Active:** Yes
**Full Feature:** Pending post-handoff development
