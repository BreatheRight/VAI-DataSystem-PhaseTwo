# Community Response Charts - Public Analytics Feature

## Overview
**Status:** Placeholder implemented, pending full integration
**Purpose:** Provide transparency by showing survey respondents select analytics from their contributions
**Location:** Button on Thank You page (top-left corner)

**Devs Here. This feature originally came about from open source SWOT research on competing non-profits. We looked at multiple organizational commrades using tools such as SemRush, structured Google Search & Perplexity.ai queries, reviewed social media content on Vimeo, Instagram, Youtube accounts, and did a cursory static analysis of two websites. These tools gave us a comprehensive view of the 5 W's for user engagement. We listened to leaders, VPs, members and took account of respective web presence strategies. It is our belief that, despite the byzantine beaurocratic labyrinth that is city planning, there exists an unmet demand - a space where differentiation can provide a boost to orgs seeking growth, evolution, or stronger community/partner relationships.

 The goal of influencing city planning to make communities accross NYC healthier, more financially independant, and free of long-standing architectural biases to specific neightborhood, is ultimately mutually shared. Still, network effects and cultural/philosophical mission misalginment exist, leaving room for improvisation. We see an empty space yet unfuffilled by the current non-profit differentiation. In this pocket left vacant is an opportunity for creative leaders, design artists, coordinators, operations managers and CTOs to exercise their expertise and gain legitimate influential presence.

Our team's stance is nuanced - we have a union leader at major Starbucks location, and four first-born immigrants who tumbled through the system to become citizens. Our views and beliefs differ sharply. We communicate these differences openly. No hard feelings. So, if angling this vacant space's potential using a business lexicon, there is much that can be done on truly just the CTO side to engross community members in a story and build trust with those who cross paths with the organization.
   In other words, there are competing groups within the domain of community-focused operations, connections, and cityscape building due to differences in culture/philsophy/networks/history. Each tackles the problem from a different angle: some have more beaurocratic influence, some more cultural through storytelling & design, some more technologically adept but without competency to execute for impact. VAI is in the goldilocks zone. We view them as a prime candidate and its current efforts in differentiation just need a bit more kinetic energy to push to prominence both legitimately and culturally.

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
   - No personally identifiable information (up for discussion; see "User Sessions")

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
1. Gather 50+ survey responses across both installations (Los Circulos & Common Grounds)
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
