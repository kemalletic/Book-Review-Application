import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert,
  IconButton,
  Chip,
  SelectChangeEvent,
} from '@mui/material';
import {
  Flag as FlagIcon,
  Close as CloseIcon,
  Report as ReportIcon,
} from '@mui/icons-material';

interface ReviewFlaggingProps {
  reviewId: number;
  reviewContent: string;
  onFlag: (reviewId: number, reason: string, details: string) => Promise<void>;
}

const flagReasons = [
  'Inappropriate Content',
  'Spam',
  'Harassment',
  'Hate Speech',
  'False Information',
  'Off-topic',
  'Other',
];

const ReviewFlagging: React.FC<ReviewFlaggingProps> = ({
  reviewId,
  reviewContent,
  onFlag,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    setError(null);
    setSuccess(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setReason('');
    setDetails('');
    setError(null);
    setSuccess(false);
  };

  const handleReasonChange = (event: SelectChangeEvent) => {
    setReason(event.target.value);
  };

  const handleSubmit = async () => {
    if (!reason) {
      setError('Please select a reason for flagging this review');
      return;
    }

    if (!details.trim()) {
      setError('Please provide additional details about your report');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onFlag(reviewId, reason, details);
      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      setError('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        startIcon={<FlagIcon />}
        color="error"
        variant="outlined"
        size="small"
        onClick={handleOpen}
      >
        Report Review
      </Button>

      <Dialog
        open={isOpen}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ReportIcon color="error" />
              <Typography variant="h6">Report Review</Typography>
            </Box>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Thank you for your report. Our team will review it shortly.
            </Alert>
          )}

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Review Content
            </Typography>
            <Box
              sx={{
                p: 2,
                bgcolor: 'action.hover',
                borderRadius: 1,
                maxHeight: 100,
                overflow: 'auto',
              }}
            >
              <Typography variant="body2">{reviewContent}</Typography>
            </Box>
          </Box>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Reason for Reporting</InputLabel>
            <Select
              value={reason}
              label="Reason for Reporting"
              onChange={handleReasonChange}
              disabled={isSubmitting}
            >
              {flagReasons.map((flagReason) => (
                <MenuItem key={flagReason} value={flagReason}>
                  {flagReason}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Additional Details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Please provide more information about why you're reporting this review..."
            disabled={isSubmitting}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {flagReasons.map((flagReason) => (
              <Chip
                key={flagReason}
                label={flagReason}
                onClick={() => setReason(flagReason)}
                color={reason === flagReason ? 'error' : 'default'}
                variant={reason === flagReason ? 'filled' : 'outlined'}
                size="small"
              />
            ))}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="error"
            disabled={isSubmitting}
            startIcon={<FlagIcon />}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReviewFlagging; 