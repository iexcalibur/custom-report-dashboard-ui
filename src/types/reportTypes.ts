export interface FilterOption {
  type: 'count' | 'date' | 'status' | 'percentage' | 'range' | 'average' | 'distinct';
  label: string;
}

export interface DataPoint {
  name: string;
  type: 'id' | 'date' | 'text' | 'status' | 'number' | 'duration';
  filters: FilterOption[];
}

export interface ReportData {
  [key: string]: string | number | Date;
}

export interface SelectedFilter {
  metric: string;
  filter: string;
  value: any;
} 