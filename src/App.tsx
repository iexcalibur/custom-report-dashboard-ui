import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import CustomReportBuilder from './components/CustomReportBuilder';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <CustomReportBuilder />
      </div>
    </ThemeProvider>
  );
}

export default App;
