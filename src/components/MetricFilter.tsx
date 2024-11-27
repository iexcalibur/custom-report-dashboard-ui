import React from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Select,
  MenuItem,
  Stack,
} from '@mui/material';
import { DataPoint, FilterOption } from '../types/reportTypes';

interface MetricFilterProps {
  metric: DataPoint;
  onFilterChange: (metric: string, filter: string, value: any) => void;
}

const MetricFilter: React.FC<MetricFilterProps> = ({ metric, onFilterChange }) => {
  const renderFilterInput = (filter: FilterOption) => {
    switch (filter.type) {
      case 'date':
        if (filter.label === 'Date Range') {
          return (
            <Stack direction="row" spacing={1}>
              <TextField
                type="date"
                size="small"
                label="From"
                InputLabelProps={{ shrink: true }}
                onChange={(e) => onFilterChange(metric.name, `${filter.label}_from`, e.target.value)}
              />
              <TextField
                type="date"
                size="small"
                label="To"
                InputLabelProps={{ shrink: true }}
                onChange={(e) => onFilterChange(metric.name, `${filter.label}_to`, e.target.value)}
              />
            </Stack>
          );
        }
        return (
          <TextField
            type="date"
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
            onChange={(e) => onFilterChange(metric.name, filter.label, e.target.value)}
          />
        );
      
      case 'status':
        const statusOptions = getStatusOptions(metric.name);
        return (
          <Select
            size="small"
            fullWidth
            defaultValue=""
            onChange={(e) => onFilterChange(metric.name, filter.label, e.target.value)}
          >
            {statusOptions.map(option => (
              <MenuItem key={option} value={option.toLowerCase()}>
                {option}
              </MenuItem>
            ))}
          </Select>
        );

      case 'range':
        return (
          <TextField
            type="number"
            size="small"
            fullWidth
            InputProps={{
              endAdornment: filter.label.includes('Percentage') ? '%' : null
            }}
            onChange={(e) => onFilterChange(metric.name, filter.label, e.target.value)}
          />
        );

      default:
        return (
          <TextField
            type={filter.type === 'count' || filter.type === 'percentage' || filter.type === 'average' ? 'number' : 'text'}
            size="small"
            fullWidth
            onChange={(e) => onFilterChange(metric.name, filter.label, e.target.value)}
          />
        );
    }
  };

  const getStatusOptions = (metricName: string) => {
    switch (metricName) {
      case 'Challenges':
        return ['Completed', 'Ongoing', 'Not Started'];
      case 'Attempts':
        return ['Successful', 'Failed', 'Ongoing'];
      case 'Completion Status':
        return ['Completed', 'Not Completed'];
      case 'Login Status':
        return ['Logged In', 'Logged Out'];
      default:
        return ['Completed', 'In Progress', 'Not Started'];
    }
  };

  return (
    <Box sx={{ ml: 4, mt: 1 }}>
      {metric.filters.map(filter => (
        <Box key={`${metric.name}-${filter.label}`} sx={{ mb: 1 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={4}>
              <Typography variant="body2">{filter.label}</Typography>
            </Grid>
            <Grid item xs={8}>
              {renderFilterInput(filter)}
            </Grid>
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

export default MetricFilter; 