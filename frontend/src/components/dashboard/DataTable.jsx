import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip
} from '@mui/material';
import { format } from 'date-fns';

const INSTALLATION_NAMES = {
  "1": "Breathing Pavilion",
  "2": "Common Ground",
  "3": "Los Circulos"
};

export default function DataTable({ data }) {
  if (!data || data.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No survey responses found
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: '#f5f5f5' }}>
            <TableCell sx={{ fontWeight: 700 }}>Submitted</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Installation</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Age Group</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Gender</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Zip Code</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Welcome Score</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Safety Score</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Comfort Score</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Overall Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => {
            const responses = row.responses || {};
            const submittedDate = row.submittedAt
              ? format(new Date(row.submittedAt), 'MMM dd, yyyy HH:mm')
              : 'N/A';

            return (
              <TableRow
                key={row.id || index}
                sx={{
                  '&:hover': { bgcolor: '#fafafa' },
                  '&:nth-of-type(odd)': { bgcolor: '#f9f9f9' }
                }}
              >
                <TableCell>{submittedDate}</TableCell>
                <TableCell>
                  <Chip
                    label={INSTALLATION_NAMES[row.installationId] || `Installation ${row.installationId}`}
                    size="small"
                    color={row.installationId === "1" ? "primary" : "secondary"}
                  />
                </TableCell>
                <TableCell>{responses.q4 || 'N/A'}</TableCell>
                <TableCell>{responses.q5 || 'N/A'}</TableCell>
                <TableCell>{responses.q7 || 'N/A'}</TableCell>
                <TableCell>
                  <Chip
                    label={responses.q8 || 'N/A'}
                    size="small"
                    color={parseInt(responses.q8) >= 4 ? 'success' : 'default'}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={responses.q9 || 'N/A'}
                    size="small"
                    color={parseInt(responses.q9) >= 4 ? 'success' : 'default'}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={responses.q10 || 'N/A'}
                    size="small"
                    color={parseInt(responses.q10) >= 4 ? 'success' : 'default'}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={responses.q11 || 'N/A'}
                    size="small"
                    color={parseInt(responses.q11) >= 4 ? 'success' : 'default'}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
