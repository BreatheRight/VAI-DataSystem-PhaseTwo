import React from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import EventIcon from '@mui/icons-material/Event';
import QrCodeIcon from '@mui/icons-material/QrCode';

const INSTALLATIONS = [
  {
    id: '1',
    name: 'Breathing Pavilion',
    description: 'An interactive public art installation featuring illuminated columns that respond to community engagement.',
    image: '/Breathing_Pavilion.jpeg',
    location: 'Northern Manhattan',
    status: 'Active'
  },
  {
    id: '2',
    name: 'Common Ground',
    description: 'A vibrant public plaza installation with colorful geometric patterns designed to foster community gathering.',
    image: '/Common_Ground.jpeg',
    location: 'Washington Heights',
    status: 'Active'
  }
];

export default function EventManager() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <EventIcon sx={{ fontSize: 36, color: '#36C0FC' }} />
          Event & Installation Manager
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage public art installations, view engagement metrics, and generate QR codes for survey distribution
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {INSTALLATIONS.map((installation) => (
          <Grid item xs={12} md={6} key={installation.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}
            >
              <CardMedia
                component="img"
                height="300"
                image={installation.image}
                alt={installation.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {installation.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      bgcolor: installation.status === 'Active' ? '#4caf50' : '#9e9e9e',
                      color: '#fff',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      fontWeight: 600
                    }}
                  >
                    {installation.status}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  📍 {installation.location}
                </Typography>

                <Typography variant="body1" sx={{ mb: 3 }}>
                  {installation.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<QrCodeIcon />}
                    sx={{ bgcolor: '#36C0FC', '&:hover': { bgcolor: '#2aa3d9' } }}
                  >
                    Generate QR Code
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate('/dashboard')}
                  >
                    View Analytics
                  </Button>
                  <Button
                    variant="text"
                    size="small"
                    color="secondary"
                  >
                    Edit Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, p: 3, bgcolor: '#fff', borderRadius: 2, border: '1px dashed #ccc' }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          📊 Quick Stats Across All Installations
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="text.secondary">Total Installations</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>2</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="text.secondary">Active Events</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>2</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="text.secondary">Total Survey Responses</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>--</Typography>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
}
