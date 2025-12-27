# Gemini Pro 3 Prompt: Full Tailwind Admin Dashboard for VAI Data System

## Context
I am building an admin dashboard for the Van Alen Institute's Community Engagement Data System. The dashboard currently uses Material UI (MUI) components, but I need to migrate it to use **Tailwind CSS exclusively** to match our brand's clean, Neo-Brutalist design language.

## Design Requirements

### Brand Identity (VAI Style Guide)
- **Colors:**
  - Black: `#121212` (primary text, borders)
  - Orange: `#FF710F` (primary accent, CTAs)
  - White: `#FFFFFF` (backgrounds)
  - Light Grey: `#F4F4F4` (subtle backgrounds)
  - Success Green: `#27AE60`

- **Typography:**
  - Body text: **Inter** (font-family: 'Inter', sans-serif)
  - Headings: **Hanken Grotesk** (font-family: 'Hanken Grotesk', sans-serif)
  - Font sizes: Use Tailwind's default scale (`text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, etc.)

- **Design Style:**
  - **Neo-Brutalist / MoMA-inspired:** Clean lines, high contrast, minimal decoration
  - **No emojis or icons unless absolutely necessary** – use typography and layout instead
  - Sharp borders (`border-[#121212]`), generous white space
  - Hover states: subtle color shifts (`hover:bg-[#F4F4F4]`, `hover:text-[#FF710F]`)

### Current Dashboard Structure
The dashboard displays:
1. **Executive KPIs** (5 stat cards):
   - Total Responses
   - Average Sentiment (1-5 scale)
   - Installation 1 Count (Breathing Pavilion)
   - Installation 2 Count (Common Ground)
   - **Average Survey Time** (minutes) – fetched from `/get-session-metrics` API endpoint

2. **Search Bar:**
   - Text input that filters survey responses by searching across response text, demographics, and installation names
   - Clear button to reset search

3. **Filter Panel:**
   - Installation dropdown (All, Installation 1, Installation 2)
   - Date range pickers (Start Date, End Date)
   - Zip code text input
   - "Clear Filters" and "Apply Filters" buttons

4. **Charts Section:**
   - **7-Day Trend Line Chart** (line chart showing response volume over time)
   - **Installation Comparison Chart** (bar chart comparing engagement between installations)
   - **Daily Summary Charts** (pie/doughnut charts for demographics and sentiment)

4. **Download Report Button:**
   - Large CTA button that triggers a `/generate-report` API call and downloads a ZIP file

### Technical Requirements
- **Framework:** React (JavaScript/JSX, not TypeScript)
- **Styling:** Tailwind CSS only (no MUI imports)
- **Charts:** Use **Chart.js** with `react-chartjs-2` (already installed)
- **Data Source:** Props-based data passed from parent component (`filteredData` array of survey responses)
- **Responsive:** Mobile-first design (stack cards on small screens, grid on desktop)

### Component File Name
`Dashboard.jsx`

## Your Task
Generate a complete, production-ready `Dashboard.jsx` component that:
1. **Removes all Material UI imports** (`@mui/material`, `@mui/icons-material`)
2. **Uses Tailwind utility classes** for all layout, spacing, and styling
3. **Preserves all existing functionality:**
   - KPI calculations (total responses, average sentiment, installation counts)
   - Filter logic (installation, date range, zip code)
   - Chart rendering (7-day trend, installation comparison, daily summaries)
   - Download report button with API call
4. **Matches the VAI brand style:**
   - Clean, high-contrast Neo-Brutalist design
   - Inter for body text, Hanken Grotesk for headings
   - Orange (`#FF710F`) accents on buttons and highlights
   - No emojis or excessive iconography

### Example Code Structure
```jsx
import React, { useMemo, useState } from "react";
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { useAuth } from '../utils/AuthContext';
import API from '../utils/apiClient';

export default function Dashboard() {
  const { surveyData } = useAuth();
  const [filters, setFilters] = useState({ installation: 'all', startDate: '', endDate: '', zipCode: '' });

  // Filter logic here...
  const filteredData = useMemo(() => { /* ... */ }, [surveyData, filters]);

  // KPI calculations here...
  const kpis = useMemo(() => { /* ... */ }, [filteredData]);

  const handleDownload = async () => {
    // API call to /generate-report
  };

  return (
    <div className="min-h-screen bg-white font-inter text-[#121212] p-8">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-4xl font-hanken font-bold mb-2">Dashboard</h1>
        <p className="text-[#888]">Real-time community engagement analytics</p>
      </header>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Stat card components here */}
      </div>

      {/* Filter Panel */}
      <div className="bg-[#F4F4F4] p-6 rounded-lg mb-12">
        {/* Filters here */}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart components here */}
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        className="mt-12 w-full md:w-auto px-8 py-4 bg-[#FF710F] text-white font-hanken font-bold text-lg hover:bg-[#121212] transition-colors"
      >
        Download Report
      </button>
    </div>
  );
}
```

### Deliverable
Provide the complete, copy-paste-ready `Dashboard.jsx` file with:
- All MUI dependencies removed
- Pure Tailwind styling
- Preserved Chart.js integration
- VAI brand compliance
- Clean, commented code

**Do not include MUI, do not use emojis, do not add Lucide icons. Keep it minimal, functional, and brand-aligned.**
