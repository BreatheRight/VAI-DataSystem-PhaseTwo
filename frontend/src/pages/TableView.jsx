import React, { useMemo, useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useAuth } from '../utils/AuthContext';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import FilterPanel from '../components/dashboard/FilterPanel';
import DataTable from '../components/dashboard/DataTable';

export default function TableView() {
  const { surveyData } = useAuth();
  const [filters, setFilters] = useState({
    installation: 'all',
    startDate: '',
    endDate: '',
    zipCode: ''
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

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <DashboardLayout>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Survey Responses - Table View
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Detailed view of all survey submissions with sortable columns and filters
        </Typography>
      </Box>

      <FilterPanel filters={filters} onFilterChange={handleFilterChange} />

      <Paper sx={{ mt: 3, borderRadius: 2, overflow: 'hidden' }}>
        <DataTable data={filteredData} />
      </Paper>

      <Box sx={{ mt: 2, textAlign: 'right' }}>
        <Typography variant="body2" color="text.secondary">
          Showing {filteredData.length} of {surveyData.length} total responses
        </Typography>
      </Box>
    </DashboardLayout>
  );
}
