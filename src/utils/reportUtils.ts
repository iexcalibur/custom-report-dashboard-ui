import { ReportData, SelectedFilter } from '../types/reportTypes';
import { sampleData, SampleDataType } from '../constants/sampleData';

export const generateDummyData = (
  selectedMetrics: string[], 
  selectedFilters: SelectedFilter[]
): ReportData[] => {
  let data: ReportData[] = [];

  data = sampleData.map(item => {
    const row: ReportData = {};
    selectedMetrics.forEach(metric => {
      const metricKey = Object.keys(item).find(
        key => key.toLowerCase() === metric.toLowerCase()
      );
      if (metricKey) {
        row[metricKey] = item[metricKey];
      }
    });
    return row;
  });

  if (selectedFilters.length > 0) {
    const filtersWithValues = selectedFilters.filter(filter => {
      if (filter.value === undefined || filter.value === null || filter.value === '') {
        return false;
      }
      if (typeof filter.value === 'object' && 
          (!filter.value.from || !filter.value.to)) {
        return false;
      }
      return true;
    });

    if (filtersWithValues.length === 0) {
      return data;
    }

    filtersWithValues.forEach(filter => {
      const metricKey = Object.keys(data[0]).find(
        key => key.toLowerCase() === filter.metric.toLowerCase()
      );

      if (!metricKey) return;

      switch (filter.metric) {
        case 'Content launch date':
        case 'Completion Date':
        case 'Last Login Date':
          switch (filter.filter) {
            case 'Date Range':
              if (filter.value?.from && filter.value?.to) {
                const fromDate = new Date(filter.value.from);
                const toDate = new Date(filter.value.to);
                data = data.filter(row => {
                  const [day, month, year] = (row[metricKey] as string).split('/');
                  const rowDate = new Date(Number(year), Number(month) - 1, Number(day));
                  return rowDate >= fromDate && rowDate <= toDate;
                });
              }
              break;
            case 'Specific Date':
              if (filter.value) {
                const inputDate = new Date(filter.value);
                const formattedDate = `${String(inputDate.getDate()).padStart(2, '0')}/${String(inputDate.getMonth() + 1).padStart(2, '0')}/${inputDate.getFullYear()}`;
                data = data.filter(row => row[metricKey] === formattedDate);
              }
              break;
          }
          break;

        case 'Master-O ID':
          switch (filter.filter) {
            case 'Count':
              if (filter.value && !isNaN(Number(filter.value))) {
                const count = Math.min(Number(filter.value), data.length);
                data = data.slice(0, count);
              }
              break;
            case 'Distinct Count':
              if (filter.value && !isNaN(Number(filter.value))) {
                const uniqueValues = Array.from(new Set(data.map(row => row[metricKey])));
                const requestedCount = Math.min(Number(filter.value), uniqueValues.length);
                const selectedUniqueValues = uniqueValues.slice(0, requestedCount);
                data = data.filter(row => selectedUniqueValues.includes(row[metricKey]));
              }
              break;
            case 'Distinct Value':
              if (filter.value) {
                data = data.filter(row => row[metricKey] === filter.value);
              }
              break;
          }
          break;

        case 'Challenges':
          if (filter.filter === 'Status') {
            const filterValue = filter.value.toLowerCase();
            data = data.filter(row => {
              const challengeStatus = (row['Challenges'] as string).toLowerCase();
              switch (filterValue) {
                case 'completed':
                  return challengeStatus === 'completed';
                case 'ongoing':
                  return challengeStatus === 'ongoing';
                case 'not started':
                  return challengeStatus === 'not started';
                default:
                  return true;
              }
            });
          }
          break;

        case 'Completion Status':
          switch (filter.filter) {
            case 'Status':
              data = data.filter(row => row['Completion Status'] === filter.value);
              break;
            case 'Status Count':
              const statusCount = data.filter(row => 
                row['Completion Status'] === 'Completed'
              ).length;
              if (statusCount > Number(filter.value)) {
                data = data.slice(0, Number(filter.value));
              }
              break;
            case 'Status Percentage':
              break;
          }
          break;

        case 'Completed In Days':
          switch (filter.filter) {
            case 'Count':
              if (filter.value && !isNaN(Number(filter.value))) {
                data = data.filter(row => {
                  const value = Number(row[metricKey]);
                  return !isNaN(value) && value <= Number(filter.value);
                });
              }
              break;
            case 'Less than':
              if (filter.value && !isNaN(Number(filter.value))) {
                data = data.filter(row => {
                  const value = Number(row[metricKey]);
                  return !isNaN(value) && value < Number(filter.value);
                });
              }
              break;
            case 'Greater than':
              if (filter.value && !isNaN(Number(filter.value))) {
                data = data.filter(row => {
                  const value = Number(row[metricKey]);
                  return !isNaN(value) && value > Number(filter.value);
                });
              }
              break;
          }
          break;

        case 'Attempts':
          if (filter.filter === 'Status') {
            const filterValue = filter.value.toLowerCase();
            data = data.filter(row => {
              const attempts = Number(row[metricKey]);
              const score = Number(row['Score'] || 0);
              const completionStatus = row['Completion Status'] as string;
              
              switch (filterValue) {
                case 'successful':
                  return !isNaN(attempts) && attempts > 0 && !isNaN(score) && score > 70;
                case 'failed':
                  return !isNaN(attempts) && attempts > 0 && !isNaN(score) && score <= 70;
                case 'ongoing':
                  return !isNaN(attempts) && attempts > 0 && completionStatus !== 'Completed';
                default:
                  return true;
              }
            });
          }
          break;

        case 'Score':
          switch (filter.filter) {
            case 'Count':
              if (filter.value && !isNaN(Number(filter.value))) {
                data = data.filter(row => Number(row[metricKey]) === Number(filter.value));
              }
              break;
            case 'Average':
              if (filter.value && !isNaN(Number(filter.value))) {
                const average = data.reduce((acc, row) => acc + Number(row[metricKey]), 0) / data.length;
                data = data.filter(row => Number(row[metricKey]) >= average);
              }
              break;
            case 'Percentage':
              if (filter.value && !isNaN(Number(filter.value))) {
                const percentage = Number(filter.value);
                data = data.filter(row => {
                  const score = Number(row[metricKey]);
                  const maxScore = Number(row['Max Score']);
                  return (score / maxScore * 100) >= percentage;
                });
              }
              break;
          }
          break;

        case 'Max Score':
          if (filter.filter === 'Count' && filter.value && !isNaN(Number(filter.value))) {
            data = data.filter(row => Number(row[metricKey]) === Number(filter.value));
          }
          break;

        case 'Time Spent':
          switch (filter.filter) {
            case 'Time Value':
              if (filter.value && !isNaN(Number(filter.value))) {
                data = data.filter(row => Number(row[metricKey]) === Number(filter.value));
              }
              break;
            case 'Average':
              if (filter.value && !isNaN(Number(filter.value))) {
                const average = data.reduce((acc, row) => acc + Number(row[metricKey]), 0) / data.length;
                data = data.filter(row => Number(row[metricKey]) >= average);
              }
              break;
          }
          break;

        case 'Microskill Name':
          switch (filter.filter) {
            case 'Count':
              if (filter.value && !isNaN(Number(filter.value))) {
                const skillCounts = new Map();
                data.forEach(row => {
                  const skill = row[metricKey] as string;
                  skillCounts.set(skill, (skillCounts.get(skill) || 0) + 1);
                });
                data = data.filter(row => 
                  skillCounts.get(row[metricKey]) <= Number(filter.value)
                );
              }
              break;
            case 'Distinct Count':
              if (filter.value && !isNaN(Number(filter.value))) {
                const uniqueSkills = Array.from(new Set(data.map(row => row[metricKey])));
                const limitedSkills = uniqueSkills.slice(0, Number(filter.value));
                data = data.filter(row => limitedSkills.includes(row[metricKey]));
              }
              break;
            case 'Distinct Value':
              if (filter.value) {
                data = data.filter(row => row[metricKey] === filter.value);
              }
              break;
          }
          break;

        case 'Login Status':
          switch (filter.filter) {
            case 'Status':
              if (filter.value) {
                data = data.filter(row => 
                  (row[metricKey] as string).toLowerCase() === filter.value.toLowerCase()
                );
              }
              break;
            case 'Count':
              if (filter.value && !isNaN(Number(filter.value))) {
                const statusCounts = new Map();
                data.forEach(row => {
                  const status = row[metricKey] as string;
                  statusCounts.set(status, (statusCounts.get(status) || 0) + 1);
                });
                data = data.filter(row => 
                  statusCounts.get(row[metricKey]) <= Number(filter.value)
                );
              }
              break;
          }
          break;
      }
    });
  }

  return data;
};

export const downloadCSV = (data: ReportData[], filename: string) => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        return value === null || value === undefined ? '' : JSON.stringify(value);
      }).join(',')
    )
  ];

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const sendReportByEmail = async (data: ReportData[], email: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        console.log('Sending report to:', email);
        console.log('Report data:', data);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    }, 1000);
  });
}; 