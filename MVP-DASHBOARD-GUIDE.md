# MVP Dashboard Setup & Testing Guide

## Quick Start (12-Hour MVP Demo Ready)

### 1. Install Material UI Dependencies

```bash
cd frontend
npm install
```

This will install the new dependencies added to `package.json`:
- @mui/material
- @emotion/react & @emotion/styled
- @mui/icons-material
- date-fns

### 2. Seed Demo Data

Add 30 synthetic survey responses for impressive visualizations:

```bash
cd backend
source venv/Scripts/activate  # or .\venv\Scripts\Activate.ps1 on PowerShell
python scripts/seed_responses.py
```

Optional: Specify custom count
```bash
python scripts/seed_responses.py 50
```

### 3. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
source venv/Scripts/activate
python run.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 4. Access the Dashboard

1. Navigate to http://localhost:5173
2. Log in with your Firebase staff account
3. Click "Dashboard" in the navbar

## MVP Features Implemented

### ✅ Executive Snapshot (KPI Cards)
- Total Responses count
- Average Sentiment score (q8-q11 average)
- Breathing Pavilion response count
- Common Ground response count

### ✅ Filters
- Installation selector (All/Breathing Pavilion/Common Ground)
- Date range (start and end dates)
- Zip code search

### ✅ Charts/Table Toggle
- **Charts View**:
  - Installation comparison chart (dual-axis: response count + avg sentiment)
  - All 13 survey question visualizations
  - Toggle between Pie/Doughnut/Bar chart types
- **Table View**:
  - Sortable data table with all responses
  - Color-coded sentiment scores
  - Installation badges

### ✅ Material UI Integration
- Professional dashboard layout with AppBar
- Card-based KPI display
- Consistent theming aligned with reference UI
- Responsive grid system

### ✅ Download Functionality
- Existing CSV/PDF report download preserved
- Now with filters applied to exports

## Demo Tips

1. **Show filters in action**: Change installation filter → KPIs and charts update instantly
2. **Toggle views**: Switch between Charts and Table to show data flexibility
3. **Installation comparison**: Highlight the dual-axis chart showing both volume and sentiment
4. **Executive snapshot**: Point out the 4 KPI cards at the top for quick insights
5. **Data table**: Show the detailed respondent view with color-coded sentiment scores

## Architecture Changes

### New Components Created:
- `frontend/src/components/dashboard/DashboardLayout.jsx` - MUI layout shell
- `frontend/src/components/dashboard/StatsCard.jsx` - Reusable KPI card
- `frontend/src/components/dashboard/FilterPanel.jsx` - Multi-filter controls
- `frontend/src/components/dashboard/DataTable.jsx` - Tabular data view
- `frontend/src/components/dashboard/InstallationComparisonChart.jsx` - Comparison viz

### Enhanced Files:
- `frontend/src/pages/Dashboard.jsx` - Integrated all new components, added filter logic, KPI calculations
- `frontend/package.json` - Added Material UI dependencies

### Backend Utilities:
- `backend/scripts/seed_responses.py` - Data seeding for demo

## Known Limitations (Post-MVP Improvements)

- No pagination on data table (fine for <100 responses)
- Filter persistence not saved to localStorage
- No real-time Firestore listeners (manual refresh needed)
- Chart colors are static (could be customized per installation)

## Next Steps After Demo

1. Add pagination to DataTable for larger datasets
2. Implement filter state persistence
3. Add export filters to backend `/generate-report` endpoint
4. Create user management interface (view/edit staff users)
5. Deploy to production environment

---

**Time to Demo**: ~2 minutes to seed data, 30 seconds to start servers, ready to present!
