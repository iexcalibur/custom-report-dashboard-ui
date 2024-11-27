import React from 'react';
import { Button, Stack } from '@mui/material';
import { Email as EmailIcon, Download as DownloadIcon } from '@mui/icons-material';

interface ActionButtonsProps {
  disabled: boolean;
  onGenerate: () => void;
  onEmail: () => void;
  onClear: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  disabled,
  onGenerate,
  onEmail,
  onClear
}) => {
  return (
    <Stack direction="row" spacing={2} mt={3}>
      <Button
        variant="contained"
        color="primary"
        onClick={onGenerate}
        disabled={disabled}
        startIcon={<DownloadIcon />}
      >
        Download Report
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={onEmail}
        disabled={disabled}
        startIcon={<EmailIcon />}
      >
        Email Report
      </Button>
      <Button
        variant="outlined"
        color="primary"
        onClick={onClear}
      >
        Clear Selection
      </Button>
    </Stack>
  );
};

export default ActionButtons; 