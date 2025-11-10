import React, { useEffect, useRef } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Chart } from 'chart.js/auto';
import { INSTALLATION_COLORS } from '../../utils/brandColors';

export default function TrendLineChart({ data }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !data) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Get last 7 days of data
    const last7Days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      last7Days.push({
        date: date,
        label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        installation1: 0,
        installation2: 0
      });
    }

    // Count responses per day per installation
    data.forEach(entry => {
      const entryDate = new Date(entry.submittedAt);
      entryDate.setHours(0, 0, 0, 0);

      const dayData = last7Days.find(d => d.date.getTime() === entryDate.getTime());
      if (dayData) {
        if (entry.installationId === '1') {
          dayData.installation1++;
        } else if (entry.installationId === '2') {
          dayData.installation2++;
        }
      }
    });

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: last7Days.map(d => d.label),
        datasets: [
          {
            label: 'Breathing Pavilion',
            data: last7Days.map(d => d.installation1),
            borderColor: INSTALLATION_COLORS.breathingPavilion,
            backgroundColor: `${INSTALLATION_COLORS.breathingPavilion}1A`,
            tension: 0.3,
            fill: true,
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
          },
          {
            label: 'Common Ground',
            data: last7Days.map(d => d.installation2),
            borderColor: INSTALLATION_COLORS.commonGround,
            backgroundColor: `${INSTALLATION_COLORS.commonGround}1A`,
            tension: 0.3,
            fill: true,
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              boxWidth: 12,
              padding: 15,
              font: { size: 11, family: 'Inter' }
            }
          },
          title: {
            display: false
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${context.parsed.y} responses`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              font: { size: 10, family: 'Inter' }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            ticks: {
              font: { size: 10, family: 'Inter' }
            },
            grid: {
              display: false
            }
          }
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <Paper sx={{ p: 2, mb: 3, borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5, fontSize: '0.95rem' }}>
        7-Day Attendance Trend
      </Typography>
      <Box sx={{ height: 180 }}>
        <canvas ref={chartRef} />
      </Box>
    </Paper>
  );
}
