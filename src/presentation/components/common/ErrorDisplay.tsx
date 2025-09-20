import React from 'react';
import { Box, Alert, Button, Typography } from '@mui/material';
import { Refresh, Error as ErrorIcon } from '@mui/icons-material';

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  title?: string;
  showRetryButton?: boolean;
}

export function ErrorDisplay({
  error,
  onRetry,
  title = 'Ha ocurrido un error',
  showRetryButton = true
}: ErrorDisplayProps): JSX.Element {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        gap: 2,
        textAlign: 'center',
        p: 3
      }}
    >
      <ErrorIcon color="error" sx={{ fontSize: 48 }} />

      <Typography variant="h5" component="h2" gutterBottom>
        {title}
      </Typography>

      <Alert severity="error" sx={{ maxWidth: 600 }}>
        {error}
      </Alert>

      {showRetryButton && onRetry && (
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={onRetry}
          sx={{ mt: 2 }}
        >
          Intentar de nuevo
        </Button>
      )}
    </Box>
  );
}