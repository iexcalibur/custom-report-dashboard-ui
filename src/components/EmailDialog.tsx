import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Stack
} from '@mui/material';

interface EmailDialogProps {
  open: boolean;
  onClose: () => void;
  onSend: (email: string) => void;
}

const EmailDialog: React.FC<EmailDialogProps> = ({ open, onClose, onSend }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSend = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    onSend(email);
    setEmail('');
    setError('');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Send Report via Email</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            autoFocus
            label="Email Address"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!error}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSend} variant="contained">
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailDialog; 