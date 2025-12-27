import React, { useMemo, useState, useEffect } from "react";
import { Box, Grid, Button, Typography, Paper } from '@mui/material';
import { Download, Search, Timer } from '@mui/icons-material';
import PeopleIcon from '@mui/icons-material/People';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import "../styles/dashboard.css";
import "../styles/global.css";
import { useAuth } from '../utils/AuthContext';
import API from '../utils/apiClient';
import StatsCard from "../components/dashboard/StatsCard";
import FilterPanel from "../components/dashboard/FilterPanel";
import InstallationComparisonChart from "../components/dashboard/InstallationComparisonChart";
import TrendLineChart from "../components/dashboard/TrendLineChart";
import DailySummaryCharts from "../components/dashboard/DailySummaryCharts";
import { Button as TailwindButton } from '../ui/Button';
import { Card } from '../ui/Card';
import { Tabs, TabPanel } from '../ui/Tabs';

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
  const { isAuthenticated, surveyData, setSurveyData } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [sessionMetrics, setSessionMetrics] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [filters, setFilters] = useState({
    installation: 'all'
  });

  // Refresh survey data
  const refreshSurveyData = async () => {
    setRefreshing(true);
    try {
      const res = await API.get('/get-survey-responses');
      setSurveyData(res.data);
      console.log('Survey data refreshed:', res.data.length, 'responses');
    } catch (err) {
      console.error('Error refreshing survey data:', err);
    } finally {
      setRefreshing(false);
    }
  };

  // Fetch session metrics and refresh survey data on mount
  useEffect(() => {
    const fetchSessionMetrics = async () => {
      try {
        const response = await API.get('/get-session-metrics');
        setSessionMetrics(response.data);
      } catch (err) {
        console.error('Error fetching session metrics:', err);
      }
    };

    const fetchSurveyData = async () => {
      try {
        const res = await API.get('/get-survey-responses');
        setSurveyData(res.data);
        console.log('Survey data loaded:', res.data.length, 'responses');
      } catch (err) {
        console.error('Error loading survey data:', err);
      }
    };

    fetchSessionMetrics();
    fetchSurveyData();
  }, [setSurveyData]); // Depend on setSurveyData to avoid stale reference

  // Filter survey data based on current filters AND search query
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

      // Search filter (case-insensitive search across responses and demographics)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const responsesString = JSON.stringify(entry.responses || {}).toLowerCase();
        const installationId = (entry.installationId || '').toLowerCase();

        if (!responsesString.includes(query) && !installationId.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [surveyData, filters, searchQuery]);

  // Calculate executive KPIs
  const kpis = useMemo(() => {
    if (!filteredData.length) {
      return {
        totalResponses: 0,
        avgSentiment: 0,
        installation1Count: 0,
        installation2Count: 0,
        installation3Count: 0
      };
    }

    let sentimentSum = 0;
    let sentimentCount = 0;
    let installation1Count = 0;
    let installation2Count = 0;
    let installation3Count = 0;

    filteredData.forEach(entry => {
      if (entry.installationId === "1") installation1Count++;
      if (entry.installationId === "2") installation2Count++;
      if (entry.installationId === "3") installation3Count++;

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
      installation2Count,
      installation3Count
    };
  }, [filteredData]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (!isAuthenticated) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-3xl font-semibold mb-4">Error - 404, Cannot Access this Page!</h1>
        <p className="text-vai-grayText">Please log in to view the dashboard.</p>
      </div>
    );
  }

  const tabs = [
    { label: 'Overview', value: 'overview' },
    { label: 'Analytics', value: 'analytics' },
    { label: 'Survey Data', value: 'survey' },
    { label: 'Reports', value: 'reports' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-vai-black mb-1">Analytics Dashboard</h1>
          <p className="text-vai-grayText">Real-time insights from community engagement surveys</p>
        </div>
        <div className="flex gap-3">
          <TailwindButton
            onClick={refreshSurveyData}
            disabled={refreshing}
            variant="outline"
          >
            {refreshing ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-vai-orange border-t-transparent rounded-full"></div>
                Refreshing...
              </>
            ) : (
              'Refresh Data'
            )}
          </TailwindButton>
          <TailwindButton onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </TailwindButton>
        </div>
      </div>

      {/* Search Bar */}
      <Paper className="p-4">
        <div className="flex items-center gap-2">
          <Search className="text-vai-grayText" />
          <input
            type="text"
            placeholder="Search survey responses, demographics, or installation names..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 outline-none text-vai-black placeholder-vai-grayText"
            style={{ fontSize: '14px' }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-vai-grayText hover:text-vai-black"
            >
              Clear
            </button>
          )}
        </div>
      </Paper>

      {/* Filter Panel */}
      <FilterPanel filters={filters} onFilterChange={handleFilterChange} />

      {/* 7-Day Trend Line Chart */}
      <Card title="Traffic Overview" className="mb-6">
        <div style={{ height: '256px' }}>
          <TrendLineChart data={filteredData} />
        </div>
      </Card>

      {/* Executive KPIs */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Responses"
            value={kpis.totalResponses}
            icon={PeopleIcon}
            color="#FF710F"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Avg Sentiment"
            value={`${kpis.avgSentiment} / 5.0`}
            subtitle="Across welcome, safety, comfort, experience"
            icon={SentimentSatisfiedAltIcon}
            color="#27AE60"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Breathing Pavilion"
            value={kpis.installation1Count}
            subtitle="responses"
            icon={LocationOnIcon}
            color="#FF710F"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Common Ground"
            value={kpis.installation2Count}
            subtitle="responses"
            icon={LocationOnIcon}
            color="#27AE60"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Los Circulos"
            value={kpis.installation3Count}
            subtitle="responses"
            icon={LocationOnIcon}
            color="#F2B84B"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Avg Survey Time"
            value={sessionMetrics ? `${sessionMetrics.avgCompletionTimeMinutes} min` : 'Loading...'}
            subtitle={sessionMetrics ? `${sessionMetrics.totalSessions} completed sessions` : ''}
            icon={Timer}
            color="#3498DB"
          />
        </Grid>
      </Grid>

      {/* Tabs Section */}
      <Card>
        <Tabs tabs={tabs} value={activeTab} onChange={setActiveTab} />

        <TabPanel value="overview" activeValue={activeTab}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card title="Referrers">
                <InstallationComparisonChart data={filteredData} />
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card title="Installation Visits Summary">
                <DailySummaryCharts data={filteredData} type="doughnut" />
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value="analytics" activeValue={activeTab}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card title="Today's Distribution">
                <DailySummaryCharts data={filteredData} type="pie" />
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card title="Response Count">
                <DailySummaryCharts data={filteredData} type="bar" />
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value="survey" activeValue={activeTab}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card title="Installation Split">
                <DailySummaryCharts data={filteredData} type="doughnut" />
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card title="Installation Comparison">
                <InstallationComparisonChart data={filteredData} />
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value="reports" activeValue={activeTab}>
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-vai-black mb-2">Reports Coming Soon</h3>
            <p className="text-vai-grayText mb-4">Advanced reporting features will be available here.</p>
            <TailwindButton onClick={handleDownload}>
              Download Current Report
            </TailwindButton>
          </div>
        </TabPanel>
      </Card>
    </div>
  );
}
