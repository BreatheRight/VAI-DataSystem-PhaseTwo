import React, { useMemo, useState } from "react";
import { Box, Grid, Button, Typography, Paper } from '@mui/material';
import { Download } from '@mui/icons-material';
import PeopleIcon from '@mui/icons-material/People';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import "../styles/dashboard.css";
import "../styles/global.css";
import { useAuth } from '../utils/AuthContext';
import API from '../utils/apiClient';
import DashboardLayout from "../components/dashboard/DashboardLayout";
import StatsCard from "../components/dashboard/StatsCard";
import FilterPanel from "../components/dashboard/FilterPanel";
import InstallationComparisonChart from "../components/dashboard/InstallationComparisonChart";
import TrendLineChart from "../components/dashboard/TrendLineChart";
import DailySummaryCharts from "../components/dashboard/DailySummaryCharts";

const handleDownload = async () => {
  try {
    const response = await API.get('/generate-report', {
      responseType: 'blob',
    });

    // creates a URL for the blob and triggers download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'survey_reports.zip'); // file name
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error('Error downloading the report:', err);
  }
};

export default function Dashboard() {
  const { isAuthenticated, surveyData } = useAuth();

  const [filters, setFilters] = useState({
    installation: 'all'
  });

  // Filter survey data based on current filters
  const filteredData = useMemo(() => {
    if (!Array.isArray(surveyData)) return [];

    return surveyData.filter(entry => {
      // Installation filter
      if (filters.installation !== 'all' && entry.installationId !== filters.installation) {
        return false;
      }

      // Date range filter
      if (filters.startDate || filters.endDate) {
        const entryDate = new Date(entry.submittedAt);
        if (filters.startDate && entryDate < new Date(filters.startDate)) return false;
        if (filters.endDate && entryDate > new Date(filters.endDate + 'T23:59:59')) return false;
      }

      // Zip code filter
      if (filters.zipCode && entry.responses?.q7) {
        const zip = entry.responses.q7;
        if (!zip.includes(filters.zipCode)) return false;
      }

      return true;
    });
  }, [surveyData, filters]);

  // Calculate executive KPIs
  const kpis = useMemo(() => {
    if (!filteredData.length) {
      return {
        totalResponses: 0,
        avgSentiment: 0,
        installation1Count: 0,
        installation2Count: 0
      };
    }

    let sentimentSum = 0;
    let sentimentCount = 0;
    let installation1Count = 0;
    let installation2Count = 0;

    filteredData.forEach(entry => {
      if (entry.installationId === "1") installation1Count++;
      if (entry.installationId === "2") installation2Count++;

      // Average sentiment from q8, q9, q10, q11
      ['q8', 'q9', 'q10', 'q11'].forEach(qid => {
        const val = parseFloat(entry.responses?.[qid]);
        if (!isNaN(val)) {
          sentimentSum += val;
          sentimentCount++;
        }
      });
    });

    return {
      totalResponses: filteredData.length,
      avgSentiment: sentimentCount > 0 ? (sentimentSum / sentimentCount).toFixed(2) : 0,
      installation1Count,
      installation2Count
    };
  }, [filteredData]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (!isAuthenticated) {
    return (
      <DashboardLayout>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h4">Error - 404, Cannot Access this Page!</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            Please log in to view the dashboard.
          </Typography>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Page Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Analytics Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Real-time insights from community engagement surveys
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={handleDownload}
          sx={{ bgcolor: '#36C0FC', '&:hover': { bgcolor: '#2aa3d9' } }}
        >
          Download Report
        </Button>
      </Box>

      {/* Filter Panel */}
      <FilterPanel filters={filters} onFilterChange={handleFilterChange} />

      {/* 7-Day Trend Line Chart */}
      <TrendLineChart data={filteredData} />

      {/* Executive KPIs */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Responses"
            value={kpis.totalResponses}
            icon={PeopleIcon}
            color="#36C0FC"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Avg Sentiment"
            value={`${kpis.avgSentiment} / 5.0`}
            subtitle="Across welcome, safety, comfort, experience"
            icon={SentimentSatisfiedAltIcon}
            color="#FF77C9"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Breathing Pavilion"
            value={kpis.installation1Count}
            subtitle="responses"
            icon={LocationOnIcon}
            color="#4BC0C0"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Common Ground"
            value={kpis.installation2Count}
            subtitle="responses"
            icon={LocationOnIcon}
            color="#FF6384"
          />
        </Grid>
      </Grid>

      {/* Main Charts Grid: 2x2 Layout */}
      <Grid container spacing={3}>
        {/* Top Left: Installation Comparison Bar Chart */}
        <Grid item xs={12} md={6}>
          <InstallationComparisonChart data={filteredData} />
        </Grid>

        {/* Top Right: Today's Distribution Pie Chart */}
        <Grid item xs={12} md={6}>
          <DailySummaryCharts data={filteredData} type="pie" />
        </Grid>

        {/* Bottom Left: Installation Split Doughnut Chart */}
        <Grid item xs={12} md={6}>
          <DailySummaryCharts data={filteredData} type="doughnut" />
        </Grid>

        {/* Bottom Right: Response Count Bar Chart */}
        <Grid item xs={12} md={6}>
          <DailySummaryCharts data={filteredData} type="bar" />
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}