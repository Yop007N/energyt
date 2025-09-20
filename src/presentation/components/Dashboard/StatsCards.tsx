import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { TrendingUp, TrendingDown, Bolt, People, Assessment, Warning } from '@mui/icons-material';
import { DashboardStats } from '../../../application/usecases/GetDashboardStatsUseCase';

interface StatsCardsProps {
  stats: DashboardStats;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

function StatCard({ title, value, icon, trend, color }: StatCardProps): JSX.Element {
  const getTrendIcon = () => {
    if (trend === undefined) return null;
    return trend >= 0 ? <TrendingUp color="success" /> : <TrendingDown color="error" />;
  };

  const getTrendColor = () => {
    if (trend === undefined) return 'text.secondary';
    return trend >= 0 ? 'success.main' : 'error.main';
  };

  return (
    <Card elevation={2}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="text.secondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </Typography>
            {trend !== undefined && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {getTrendIcon()}
                <Typography
                  variant="body2"
                  sx={{ ml: 0.5, color: getTrendColor() }}
                >
                  {Math.abs(trend).toFixed(1)}%
                </Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ color: `${color}.main` }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export function StatsCards({ stats }: StatsCardsProps): JSX.Element {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatEnergy = (kwh: number): string => {
    if (kwh >= 1000000) {
      return `${(kwh / 1000000).toFixed(2)} GWh`;
    }
    if (kwh >= 1000) {
      return `${(kwh / 1000).toFixed(2)} MWh`;
    }
    return `${kwh.toFixed(2)} kWh`;
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Consumo Total"
          value={formatEnergy(stats.totalConsumption)}
          icon={<Bolt sx={{ fontSize: 40 }} />}
          trend={stats.consumptionTrend}
          color="primary"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Costo Total"
          value={formatCurrency(stats.totalCost)}
          icon={<Assessment sx={{ fontSize: 40 }} />}
          trend={stats.costTrend}
          color="secondary"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Dispositivos Activos"
          value={stats.activeDevices}
          icon={<Warning sx={{ fontSize: 40 }} />}
          color="success"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Clientes"
          value={stats.totalClients}
          icon={<People sx={{ fontSize: 40 }} />}
          color="warning"
        />
      </Grid>
    </Grid>
  );
}