import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Tabs,
  Tab,
  Typography,
  Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Chart } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import surveyQuestions from '../../data/surveyQuestions';
import { CHART_COLORS } from '../../utils/brandColors';

Chart.register(ChartDataLabels);

// Helper function to aggregate responses
const aggregateResponses = (data, questionId) => {
  const counts = {};
  data.forEach(entry => {
    const responses = entry.responses;
    if (!responses || typeof responses !== "object") return;

    const response = responses[questionId];
    if (response) {
      const values = Array.isArray(response) ? response : [response];
      values.forEach(val => {
        counts[val] = (counts[val] || 0) + 1;
      });
    }
  });
  return counts;
};

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} style={{ paddingTop: '16px' }}>
      {value === index && children}
    </div>
  );
}

function DemographicChart({ data, field, title, chartRef, chartType = 'pie' }) {
  useEffect(() => {
    if (!chartRef.current || !data) return;

    const ctx = chartRef.current.getContext('2d');
    const counts = {};

    data.forEach(entry => {
      const value = entry.responses?.[field];
      if (value) {
        counts[value] = (counts[value] || 0) + 1;
      }
    });

    const total = Object.values(counts).reduce((a, b) => a + b, 0);

    const chart = new Chart(ctx, {
      type: chartType,
      data: {
        labels: Object.keys(counts),
        datasets: [{
          label: chartType === 'bar' ? 'Count' : undefined,
          data: Object.values(counts),
          backgroundColor: CHART_COLORS,
          borderColor: chartType === 'bar' ? CHART_COLORS : '#fff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: chartType !== 'bar',
            position: 'bottom',
            labels: {
              boxWidth: 12,
              padding: 8,
              font: { size: 10, family: 'Inter' }
            }
          },
          datalabels: {
            color: chartType === 'bar' ? '#000' : '#fff',
            font: { weight: 'bold', size: 11, family: 'Inter' },
            formatter: (value) => {
              if (chartType === 'bar') return value;
              const percentage = ((value / total) * 100).toFixed(0);
              return percentage > 5 ? `${percentage}%` : '';
            }
          }
        },
        scales: chartType === 'bar' ? {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              font: { size: 10, family: 'Inter' }
            }
          },
          x: {
            ticks: {
              font: { size: 9, family: 'Inter' }
            }
          }
        } : undefined
      }
    });

    return () => chart.destroy();
  }, [data, field, chartType]);

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, fontSize: '0.85rem' }}>
        {title}
      </Typography>
      <Box sx={{ height: 220 }}>
        <canvas ref={chartRef} />
      </Box>
    </Paper>
  );
}

function QuestionChart({ data, questionId, question, chartType = 'pie' }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !data) return;

    const ctx = chartRef.current.getContext('2d');
    const counts = aggregateResponses(data, questionId);
    const total = Object.values(counts).reduce((a, b) => a + b, 0);

    const chart = new Chart(ctx, {
      type: chartType,
      data: {
        labels: Object.keys(counts),
        datasets: [{
          data: Object.values(counts),
          backgroundColor: CHART_COLORS,
          borderColor: '#fff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              padding: 8,
              font: { size: 9, family: 'Inter' }
            }
          },
          datalabels: {
            color: '#fff',
            font: { weight: 'bold', size: 10, family: 'Inter' },
            formatter: (value) => {
              const percentage = ((value / total) * 100).toFixed(0);
              return percentage > 5 ? `${percentage}%` : '';
            }
          }
        }
      }
    });

    return () => chart.destroy();
  }, [data, questionId, chartType]);

  return (
    <Paper sx={{ p: 1.5, height: '100%' }}>
      <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 1, fontSize: '0.75rem', minHeight: '32px', lineHeight: 1.2 }}>
        {question}
      </Typography>
      <Box sx={{ height: 180 }}>
        <canvas ref={chartRef} />
      </Box>
    </Paper>
  );
}

export default function AdvancedAnalyticsModal({ open, onClose, data, chartType = 'pie' }) {
  const [tabValue, setTabValue] = useState(0);

  // Create refs for demographic charts
  const ageRef = useRef(null);
  const genderRef = useRef(null);
  const raceRef = useRef(null);
  const zipRef = useRef(null);  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const demographics = [
    { field: 'q3', title: 'Age Group', ref: ageRef },
    { field: 'q4', title: 'Gender', ref: genderRef },
    { field: 'q5', title: 'Race/Ethnicity', ref: raceRef },
    { field: 'q7', title: 'Zip Code', ref: zipRef }
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: {
          height: '90vh',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Advanced Analytics - {chartType === 'pie' ? 'Pie Chart' : chartType === 'doughnut' ? 'Doughnut Chart' : 'Bar Chart'} Breakdown
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Demographics" />
          <Tab label="Survey Questions" />
        </Tabs>
      </Box>

      <DialogContent sx={{ pt: 2 }}>
        {/* Demographics Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 3 }}>
            {demographics.map(({ field, title, ref }) => (
              <DemographicChart
                key={field}
                data={data}
                field={field}
                title={title}
                chartRef={ref}
                chartType={chartType}
              />
            ))}
          </Box>
        </TabPanel>

        {/* Survey Questions Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 2 }}>
            {surveyQuestions.map(({ questionId, question }) => (
              <QuestionChart
                key={questionId}
                data={data}
                questionId={questionId}
                question={question}
                chartType={chartType}
              />
            ))}
          </Box>
        </TabPanel>
      </DialogContent>
    </Dialog>
  );
}
