import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import { Chart } from 'chart.js/auto';
import AdvancedAnalyticsModal from './AdvancedAnalyticsModal';
import { INSTALLATION_COLORS } from '../../utils/brandColors';

export default function InstallationComparisonChart({ data }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!chartRef.current || !data) return;

    const ctx = chartRef.current.getContext('2d');

    // Count responses per installation
    const installation1 = data.filter(d => d.installationId === "1").length;
    const installation2 = data.filter(d => d.installationId === "2").length;

    // Calculate average sentiment per installation
    const calcAvgSentiment = (installationId) => {
      const responses = data.filter(d => d.installationId === installationId);
      if (responses.length === 0) return 0;

      let sum = 0;
      let count = 0;
      responses.forEach(entry => {
        ['q8', 'q9', 'q10', 'q11'].forEach(qid => {
          const val = parseFloat(entry.responses?.[qid]);
          if (!isNaN(val)) {
            sum += val;
            count++;
          }
        });
      });
      return count > 0 ? (sum / count).toFixed(2) : 0;
    };

    const avgSentiment1 = calcAvgSentiment("1");
    const avgSentiment2 = calcAvgSentiment("2");

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Breathing Pavilion', 'Common Ground'],
        datasets: [
          {
            label: 'Response Count',
            data: [installation1, installation2],
            backgroundColor: [INSTALLATION_COLORS.breathingPavilion, INSTALLATION_COLORS.commonGround],
            borderColor: [INSTALLATION_COLORS.breathingPavilion, INSTALLATION_COLORS.commonGround],
            borderWidth: 2,
            yAxisID: 'y'
          },
          {
            label: 'Avg Sentiment (out of 5)',
            data: [avgSentiment1, avgSentiment2],
            backgroundColor: [`${INSTALLATION_COLORS.breathingPavilion}80`, `${INSTALLATION_COLORS.commonGround}80`],
            borderColor: [INSTALLATION_COLORS.breathingPavilion, INSTALLATION_COLORS.commonGround],
            borderWidth: 2,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top'
          },
          title: {
            display: true,
            text: 'Installation Comparison: Responses & Sentiment',
            font: { size: 16, weight: 'bold' }
          }
        },
        scales: {
          y: {
            type: 'linear',
            position: 'left',
            title: { display: true, text: 'Response Count' },
            beginAtZero: true
          },
          y1: {
            type: 'linear',
            position: 'right',
            title: { display: true, text: 'Avg Sentiment' },
            beginAtZero: true,
            max: 5,
            grid: { drawOnChartArea: false }
          }
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
    <>
      <Card sx={{
        boxShadow: '0 4px 12px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)',
        borderRadius: 2,
        mb: 3,
        position: 'relative',
        bgcolor: '#FFFFFF'
      }}>
        <CardContent>
          <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}>
            <IconButton
              size="small"
              onClick={() => setModalOpen(true)}
              sx={{
                color: '#36C0FC',
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                '&:hover': { bgcolor: 'rgba(54, 192, 252, 0.1)' }
              }}
            >
              <OpenInFullIcon fontSize="small" />
            </IconButton>
          </Box>
          <Box sx={{ height: 400 }}>
            <canvas ref={chartRef} />
          </Box>
        </CardContent>
      </Card>

      <AdvancedAnalyticsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        data={data}
        chartType="bar"
      />
    </>
  );
}
