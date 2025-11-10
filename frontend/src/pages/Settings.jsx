import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Person,
  Notifications,
  FileDownload,
  Security,
  Palette,
  Language
} from '@mui/icons-material';
import DashboardLayout from '../components/dashboard/DashboardLayout';

export default function Settings() {
  const settingsSections = [
    {
      title: 'User Profile',
      icon: <Person />,
      description: 'Manage your personal information, email, and account details'
    },
    {
      title: 'Notification Preferences',
      icon: <Notifications />,
      description: 'Configure email alerts, system notifications, and data update frequencies'
    },
    {
      title: 'Data Export Options',
      icon: <FileDownload />,
      description: 'Customize CSV/PDF export formats, scheduled reports, and data retention'
    },
    {
      title: 'Security & Privacy',
      icon: <Security />,
      description: 'Password management, two-factor authentication, session timeout settings'
    },
    {
      title: 'Display Preferences',
      icon: <Palette />,
      description: 'Theme customization, chart color schemes, and dashboard layout options'
    },
    {
      title: 'Language & Region',
      icon: <Language />,
      description: 'Interface language, date formats, time zones, and regional settings'
    }
  ];

  return (
    <DashboardLayout>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your dashboard preferences and account settings
        </Typography>
      </Box>

      {/* Coming Soon Notice */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          textAlign: 'center',
          bgcolor: '#f0f9ff',
          border: '1px solid #36C0FC',
          borderRadius: 2
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: '#1e1e2d' }}>
          Settings Coming Soon
        </Typography>
        <Typography variant="body1" color="text.secondary">
          We're working on building comprehensive settings to customize your dashboard experience.
        </Typography>
      </Paper>

      {/* Planned Settings Sections */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Planned Features
      </Typography>
      <Grid container spacing={3}>
        {settingsSections.map((section, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Paper
              sx={{
                p: 3,
                height: '100%',
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: 4,
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box
                  sx={{
                    bgcolor: '#f5f5f5',
                    borderRadius: '50%',
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#36C0FC'
                  }}
                >
                  {section.icon}
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, fontSize: '1rem' }}>
                    {section.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {section.description}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* Quick Info Section */}
      <Paper sx={{ p: 3, bgcolor: '#fafafa' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Need Help?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          For immediate assistance or questions about settings, please refer to the{' '}
          <strong>Documentation</strong> page accessible from the sidebar navigation.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          You can also contact the Van Alen Institute technical team for support with account
          configuration or data access permissions.
        </Typography>
      </Paper>
    </DashboardLayout>
  );
}
