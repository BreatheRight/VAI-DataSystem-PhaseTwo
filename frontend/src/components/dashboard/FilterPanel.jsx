import React from 'react';
import { Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

export default function FilterPanel({ filters, onFilterChange }) {
  return (
    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
      <FilterListIcon sx={{ color: '#36C0FC', fontSize: 28 }} />

      {/* Installation Filter */}
      <FormControl sx={{ minWidth: 220 }} size="small">
        <InputLabel>Installation</InputLabel>
        <Select
          value={filters.installation}
          label="Installation"
          onChange={(e) => onFilterChange('installation', e.target.value)}
        >
          <MenuItem value="all">All Installations</MenuItem>
          <MenuItem value="1">Breathing Pavilion</MenuItem>
          <MenuItem value="2">Common Ground</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
