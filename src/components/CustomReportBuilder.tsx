import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Divider,
} from '@mui/material';
import { DataPoint, SelectedFilter } from '../types/reportTypes';
import { downloadCSV, generateDummyData, sendReportByEmail } from '../utils/reportUtils';
import EmailDialog from './EmailDialog';
import MetricFilter from './MetricFilter';
import ActionButtons from './ActionButtons';
import { availableMetrics } from '../constants/metrics';

const CustomReportBuilder: React.FC = () => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilter[]>([]);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);

  const handleMetricChange = (metric: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(metric)
        ? prev.filter((m) => m !== metric)
        : [...prev, metric]
    );
  };

  const handleFilterChange = (metric: string, filter: string, value: any) => {
    setSelectedFilters(prev => {
      const existing = prev.findIndex(f => f.metric === metric && f.filter === filter);
      
      if (filter.includes('Date Range')) {
        return handleDateRangeFilter(prev, metric, filter, value);
      }

      if (existing >= 0) {
        const newFilters = [...prev];
        newFilters[existing] = { metric, filter, value };
        return newFilters;
      }
      return [...prev, { metric, filter, value }];
    });
  };

  const handleDateRangeFilter = (
    prev: SelectedFilter[],
    metric: string,
    filter: string,
    value: any
  ) => {
    const isFromDate = filter.includes('from');
    const baseFilter = 'Date Range';
    const existingDateRange = prev.find(f => f.metric === metric && f.filter === baseFilter);
    
    const newValue = isFromDate
      ? { from: value, to: existingDateRange?.value?.to || '' }
      : { from: existingDateRange?.value?.from || '', to: value };

    if (existingDateRange) {
      return prev.map(f =>
        f.metric === metric && f.filter === baseFilter
          ? { ...f, value: newValue }
          : f
      );
    }
    
    return [...prev, { metric, filter: baseFilter, value: newValue }];
  };

  const handleGenerateReport = () => {
    if (selectedMetrics.length === 0) {
      alert('Please select at least one metric');
      return;
    }

    try {
      const dummyData = generateDummyData(selectedMetrics, selectedFilters);
      if (dummyData.length === 0) {
        alert('No data matches your filter criteria');
        return;
      }
      downloadCSV(dummyData, 'custom-report');
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error generating report. Please check your filters and try again.');
    }
  };

  const handleSendEmail = async (email: string) => {
    if (selectedMetrics.length === 0) {
      alert('Please select at least one metric');
      return;
    }

    try {
      const dummyData = generateDummyData(selectedMetrics, selectedFilters);
      await sendReportByEmail(dummyData, email);
      alert('Report sent successfully!');
    } catch (error) {
      alert('Failed to send report. Please try again.');
    }
    setIsEmailDialogOpen(false);
  };

  return (
    <Box p={3}>
      <Paper elevation={3}>
        <Box p={3}>
          <Typography variant="h5" gutterBottom>
            Custom Report Builder
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle1" gutterBottom>
            Select Metrics and Filters for Your Report
          </Typography>
          
          <FormGroup>
            {availableMetrics.map((metric) => (
              <Box key={metric.name}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedMetrics.includes(metric.name)}
                      onChange={() => handleMetricChange(metric.name)}
                    />
                  }
                  label={metric.name}
                />
                {selectedMetrics.includes(metric.name) && (
                  <MetricFilter
                    metric={metric}
                    onFilterChange={handleFilterChange}
                  />
                )}
              </Box>
            ))}
          </FormGroup>

          <ActionButtons
            disabled={selectedMetrics.length === 0}
            onGenerate={handleGenerateReport}
            onEmail={() => setIsEmailDialogOpen(true)}
            onClear={() => setSelectedMetrics([])}
          />
        </Box>
      </Paper>
      <EmailDialog 
        open={isEmailDialogOpen}
        onClose={() => setIsEmailDialogOpen(false)}
        onSend={handleSendEmail}
      />
    </Box>
  );
};

export default CustomReportBuilder; 