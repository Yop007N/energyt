import React from 'react';
import { Box, Container, Grid, Alert } from '@mui/material';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { DashboardHeader } from './DashboardHeader';
import { StatsCards } from './StatsCards';
import { ChartsSection } from './ChartsSection';
import { AlertsSection } from './AlertsSection';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorDisplay } from '../common/ErrorDisplay';

export function EnergyDashboard(): JSX.Element {
  const { data, loading, error, refetch } = useDashboardStats();

  if (loading) {
    return <LoadingSpinner message="Cargando dashboard de energía..." />;
  }

  if (error) {
    return (
      <ErrorDisplay
        error={error}
        onRetry={refetch}
        title="Error al cargar el dashboard"
      />
    );
  }

  if (!data) {
    return (
      <Container maxWidth="lg">
        <Alert severity="warning">
          No se encontraron datos para mostrar en el dashboard
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <DashboardHeader
        title="Dashboard de Energía"
        onRefresh={refetch}
      />

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <StatsCards stats={data} />
        </Grid>

        <Grid item xs={12}>
          <ChartsSection
            peakHours={data.peakHours}
            monthlyData={data.monthlyData}
          />
        </Grid>

        <Grid item xs={12}>
          <AlertsSection alerts={data.alerts} />
        </Grid>
      </Grid>
    </Container>
  );
}