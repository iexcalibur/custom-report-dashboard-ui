import { DataPoint } from '../types/reportTypes';

export const availableMetrics: DataPoint[] = [
  { 
    name: 'Master-O ID', 
    type: 'id',
    filters: [
      { type: 'count', label: 'Count' },
      { type: 'distinct', label: 'Distinct Count' },
      { type: 'distinct', label: 'Distinct Value' }
    ]
  },
  {
    name: 'Content Launch Date',
    type: 'date',
    filters: [
      { type: 'date', label: 'Date Range' },
      { type: 'date', label: 'Specific Date' }
    ]
  },
  {
    name: 'Challenges',
    type: 'status',
    filters: [
      { type: 'status', label: 'Status' }
    ]
  },
  {
    name: 'Completion Status',
    type: 'status',
    filters: [
      { type: 'status', label: 'Status' },
      { type: 'count', label: 'Status Count' },
      { type: 'percentage', label: 'Status Percentage' },
      { type: 'range', label: 'Less than' },
      { type: 'range', label: 'Greater than' },
      { type: 'range', label: 'Range' }
    ]
  },
  {
    name: 'Completion Date',
    type: 'date',
    filters: [
      { type: 'date', label: 'Date Range' },
      { type: 'date', label: 'Specific Date' }
    ]
  },
  {
    name: 'Completed In Days',
    type: 'number',
    filters: [
      { type: 'count', label: 'Count' },
      { type: 'range', label: 'Less than' },
      { type: 'range', label: 'Greater than' }
    ]
  },
  {
    name: 'Attempts',
    type: 'number',
    filters: [
      { type: 'status', label: 'Status' }
    ]
  },
  {
    name: 'Score',
    type: 'number',
    filters: [
      { type: 'count', label: 'Count' },
      { type: 'average', label: 'Average' },
      { type: 'percentage', label: 'Percentage' }
    ]
  },
  {
    name: 'Max Score',
    type: 'number',
    filters: [
      { type: 'count', label: 'Count' }
    ]
  },
  {
    name: 'Time Spent',
    type: 'duration',
    filters: [
      { type: 'count', label: 'Time Value' },
      { type: 'average', label: 'Average' }
    ]
  },
  {
    name: 'Microskill Name',
    type: 'text',
    filters: [
      { type: 'count', label: 'Count' },
      { type: 'distinct', label: 'Distinct Count' },
      { type: 'distinct', label: 'Distinct Value' }
    ]
  },
  {
    name: 'Login Status',
    type: 'status',
    filters: [
      { type: 'status', label: 'Status' },
      { type: 'count', label: 'Count' }
    ]
  },
  {
    name: 'Last Login Date',
    type: 'date',
    filters: [
      { type: 'date', label: 'Date Range' },
      { type: 'date', label: 'Specific Date' }
    ]
  }
]; 