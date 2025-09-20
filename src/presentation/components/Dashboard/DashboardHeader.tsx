import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Refresh } from '@mui/icons-material';

interface DashboardHeaderProps {
  title: string;
  onRefresh: () => void;
}

export function DashboardHeader({ title, onRefresh }: DashboardHeaderProps): JSX.Element {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        {title}
      </Typography>

      <Button
        variant="outlined"
        startIcon={<Refresh />}
        onClick={onRefresh}
        sx={{ height: 'fit-content' }}
      >
        Actualizar
      </Button>
    </Box>
  );
}