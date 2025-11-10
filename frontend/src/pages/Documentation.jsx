import React from 'react';
import { Box, Typography, Divider, List, ListItem, ListItemText } from '@mui/material';
import DashboardLayout from '../components/dashboard/DashboardLayout';

export default function Documentation() {
  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 800, mx: 'auto', py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, fontFamily: 'Bebas Neue' }}>
            Admin Dashboard Documentation
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
            Complete guide to analyzing community engagement data
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Getting Started */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, fontFamily: 'Bebas Neue' }}>
            Getting Started
          </Typography>
          <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.primary' }}>
            The Van Alen Institute Admin Dashboard provides real-time analytics for survey responses
            collected from public art installations. Use the sidebar navigation to explore different
            sections of the platform.
          </Typography>
        </Box>

        {/* Dashboard Section */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, fontFamily: 'Bebas Neue' }}>
            Dashboard
          </Typography>
          <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
            The main analytics view displays survey data through interactive visualizations and key metrics.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}>
            Features
          </Typography>
          <List sx={{ pl: 2 }}>
            <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
              <ListItemText
                primary={<Typography variant="body1" sx={{ fontWeight: 600 }}>Executive KPIs</Typography>}
                secondary={<Typography variant="body2" sx={{ mt: 0.5, lineHeight: 1.7 }}>View total responses, average sentiment scores, and installation-specific counts</Typography>}
              />
            </ListItem>
            <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
              <ListItemText
                primary={<Typography variant="body1" sx={{ fontWeight: 600 }}>7-Day Attendance Trend</Typography>}
                secondary={<Typography variant="body2" sx={{ mt: 0.5, lineHeight: 1.7 }}>Track daily response patterns over the past week to identify trends</Typography>}
              />
            </ListItem>
            <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
              <ListItemText
                primary={<Typography variant="body1" sx={{ fontWeight: 600 }}>Installation Comparison</Typography>}
                secondary={<Typography variant="body2" sx={{ mt: 0.5, lineHeight: 1.7 }}>Compare response volume and sentiment between installations</Typography>}
              />
            </ListItem>
            <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
              <ListItemText
                primary={<Typography variant="body1" sx={{ fontWeight: 600 }}>Advanced Analytics</Typography>}
                secondary={<Typography variant="body2" sx={{ mt: 0.5, lineHeight: 1.7 }}>Click the expand icon on any chart to view detailed demographic and question-level breakdowns</Typography>}
              />
            </ListItem>
          </List>
        </Box>

        {/* Table View Section */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, fontFamily: 'Bebas Neue' }}>
            Table View
          </Typography>
          <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
            Access detailed tabular data with sorting and filtering capabilities.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}>
            Functionality
          </Typography>
          <List sx={{ pl: 2 }}>
            <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
              <ListItemText
                primary={<Typography variant="body2" sx={{ lineHeight: 1.7 }}>Sort by submission date, installation, or sentiment scores</Typography>}
              />
            </ListItem>
            <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
              <ListItemText
                primary={<Typography variant="body2" sx={{ lineHeight: 1.7 }}>Filter responses by installation or date range</Typography>}
              />
            </ListItem>
            <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
              <ListItemText
                primary={<Typography variant="body2" sx={{ lineHeight: 1.7 }}>Color-coded sentiment indicators (green for positive scores ≥4)</Typography>}
              />
            </ListItem>
          </List>
        </Box>

        {/* Event Manager Section */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, fontFamily: 'Bebas Neue' }}>
            Event Manager
          </Typography>
          <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
            Manage installations and view quick statistics for each location.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}>
            Available Actions
          </Typography>
          <List sx={{ pl: 2 }}>
            <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
              <ListItemText
                primary={<Typography variant="body2" sx={{ lineHeight: 1.7 }}>Generate QR codes for survey access</Typography>}
              />
            </ListItem>
            <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
              <ListItemText
                primary={<Typography variant="body2" sx={{ lineHeight: 1.7 }}>View installation-specific analytics</Typography>}
              />
            </ListItem>
            <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
              <ListItemText
                primary={<Typography variant="body2" sx={{ lineHeight: 1.7 }}>Edit installation details and metadata</Typography>}
              />
            </ListItem>
          </List>
        </Box>

        {/* Filters Section */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, fontFamily: 'Bebas Neue' }}>
            Using Filters
          </Typography>
          <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
            Refine your data analysis by applying filters to focus on specific installations or time periods.
          </Typography>

          <Box sx={{ bgcolor: '#f8f9fa', p: 2.5, borderRadius: 1, mt: 2, borderLeft: '4px solid #D94854' }}>
            <Typography variant="body2" sx={{ lineHeight: 1.7, fontFamily: 'IBM Plex Sans' }}>
              <strong>Installation Filter:</strong> Select "All Installations", "Breathing Pavilion", or "Common Ground"
            </Typography>
          </Box>
        </Box>

        {/* Understanding Sentiment Section */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, fontFamily: 'Bebas Neue' }}>
            Understanding Sentiment Scores
          </Typography>
          <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
            Sentiment is calculated as an average across four key metrics (scale 1-5):
          </Typography>

          <List sx={{ pl: 2 }}>
            <ListItem sx={{ display: 'list-item', listStyleType: 'decimal', pl: 0 }}>
              <ListItemText primary={<Typography variant="body2">How welcome do you feel on this site?</Typography>} />
            </ListItem>
            <ListItem sx={{ display: 'list-item', listStyleType: 'decimal', pl: 0 }}>
              <ListItemText primary={<Typography variant="body2">How safe do you feel on this site?</Typography>} />
            </ListItem>
            <ListItem sx={{ display: 'list-item', listStyleType: 'decimal', pl: 0 }}>
              <ListItemText primary={<Typography variant="body2">How comfortable do you feel on this site?</Typography>} />
            </ListItem>
            <ListItem sx={{ display: 'list-item', listStyleType: 'decimal', pl: 0 }}>
              <ListItemText primary={<Typography variant="body2">How positive is your overall experience?</Typography>} />
            </ListItem>
          </List>
        </Box>

        {/* Best Practices Section */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, fontFamily: 'Bebas Neue' }}>
            Best Practices
          </Typography>

          <Box sx={{ bgcolor: '#f0f9ff', p: 3, borderRadius: 2, border: '1px solid #88D4F2' }}>
            <List sx={{ pl: 0 }}>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 2 }}>
                <ListItemText primary={<Typography variant="body2" sx={{ lineHeight: 1.7 }}>Check the 7-day trend chart daily to monitor attendance patterns</Typography>} />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 2 }}>
                <ListItemText primary={<Typography variant="body2" sx={{ lineHeight: 1.7 }}>Use advanced analytics (expand icon) for detailed demographic insights</Typography>} />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 2 }}>
                <ListItemText primary={<Typography variant="body2" sx={{ lineHeight: 1.7 }}>Download reports regularly for presentations and stakeholder updates</Typography>} />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 2 }}>
                <ListItemText primary={<Typography variant="body2" sx={{ lineHeight: 1.7 }}>Compare sentiment scores between installations to identify successful design patterns</Typography>} />
              </ListItem>
            </List>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Footer */}
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="body2" color="text.secondary">
            For technical support or questions, contact the Van Alen Institute development team.
          </Typography>
        </Box>
      </Box>
    </DashboardLayout>
  );
}
