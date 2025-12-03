import React, { useMemo, useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useAuth } from '../utils/AuthContext';
import FilterPanel from '../components/dashboard/FilterPanel';
import DataTable from '../components/dashboard/DataTable';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

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
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-vai-black mb-1">Survey Responses - Table View</h1>
        <p className="text-vai-grayText">Detailed view of all survey submissions with sortable columns and filters</p>
      </div>

      <FilterPanel filters={filters} onFilterChange={handleFilterChange} />

      <Card
        title="All Survey Responses"
        actions={
          <Badge active={filteredData.length > 0}>
            {filteredData.length} responses
          </Badge>
        }
      >
        <DataTable data={filteredData} />
      </Card>

      <div className="text-right">
        <p className="text-sm text-vai-grayText">
          Showing {filteredData.length} of {surveyData.length} total responses
        </p>
      </div>
    </div>
  );
}
