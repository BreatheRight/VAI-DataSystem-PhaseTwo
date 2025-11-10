import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Paper, IconButton } from '@mui/material';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import { Chart } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import AdvancedAnalyticsModal from './AdvancedAnalyticsModal';
import { INSTALLATION_COLORS } from '../../utils/brandColors';

Chart.register(ChartDataLabels);

export default function DailySummaryCharts({ data, type = 'pie' }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!chartRef.current || !data) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Count responses per installation
    const installation1Count = data.filter(d => d.installationId === '1').length;
    const installation2Count = data.filter(d => d.installationId === '2').length;
    const total = installation1Count + installation2Count;

    const ctx = chartRef.current.getContext('2d');

    const chartConfig = {
      type: type,
      data: {
        labels: ['Breathing Pavilion', 'Common Ground'],
        datasets: [{
          label: 'Response Count',
          data: [installation1Count, installation2Count],
          backgroundColor: [INSTALLATION_COLORS.breathingPavilion, INSTALLATION_COLORS.commonGround],
          borderColor: type === 'bar' ? [INSTALLATION_COLORS.breathingPavilion, INSTALLATION_COLORS.commonGround] : '#fff',
          borderWidth: 2,
          hoverBackgroundColor: [INSTALLATION_COLORS.breathingPavilion, INSTALLATION_COLORS.commonGround],
          hoverBorderColor: '#fff',
          hoverBorderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: type !== 'bar',
            position: 'bottom',
            labels: {
              boxWidth: 12,
              padding: 10,
              font: { size: 11, family: 'Inter' }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const percentage = total > 0 ? ((context.parsed.y || context.parsed) / total * 100).toFixed(1) : 0;
                const value = context.parsed.y || context.parsed;
                return `${context.label}: ${value} (${percentage}%)`;
              }
            }
          },
          datalabels: {
            color: type === 'bar' ? '#000' : '#fff',
            font: {
              weight: 'bold',
              size: 14,
              family: 'Inter'
            },
            formatter: (value, ctx) => {
              if (total === 0) return '';
              if (type === 'bar') return value;
              const percentage = ((value / total) * 100).toFixed(0);
              return percentage > 5 ? `${percentage}%` : '';
            }
          }
        },
        scales: type === 'bar' ? {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              font: { size: 10, family: 'Inter' }
            }
          },
          x: {
            ticks: {
              font: { size: 10, family: 'Inter' }
            }
          }
        } : undefined
      }
    };

    chartInstance.current = new Chart(ctx, chartConfig);

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, type]);

  const getTitleByType = () => {
    switch(type) {
      case 'pie': return "Today's Distribution";
      case 'doughnut': return "Installation Split";
      case 'bar': return "Response Count";
      default: return "Summary";
    }
  };

  return (
    <>
      <Paper sx={{
        p: 2,
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        height: '100%',
        position: 'relative',
        bgcolor: '#FFFFFF'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
            {getTitleByType()}
          </Typography>
          <IconButton
            size="small"
            onClick={() => setModalOpen(true)}
            sx={{
              color: '#36C0FC',
              '&:hover': { bgcolor: 'rgba(54, 192, 252, 0.1)' }
            }}
          >
            <OpenInFullIcon fontSize="small" />
          </IconButton>
        </Box>
        <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <canvas ref={chartRef} />
        </Box>
      </Paper>

      <AdvancedAnalyticsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        data={data}
        chartType={type}
      />
    </>
  );
}
