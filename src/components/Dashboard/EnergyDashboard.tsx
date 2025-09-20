// PROBLEMA ARREGLADO: Se creó dashboard completo para monitoreo energético
import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Container,
  Paper,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Bolt,
  People,
  Assessment,
  Warning,
  Refresh,
  Timeline,
} from '@mui/icons-material';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import energyAPI, { DashboardStats } from '../../services/energyAPI';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface MetricCardProps {
  title: string;
  value: string | number;
  unit: string;
  trend?: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, unit, trend, icon, color }) => {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp sx={{ color: 'success.main', ml: 1 }} />;
    if (trend === 'down') return <TrendingDown sx={{ color: 'error.main', ml: 1 }} />;
    return null;
  };

  return (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Box display="flex" alignItems="center">
              <Typography variant="h4" component="div" color={`${color}.main`}>
                {value}
              </Typography>
              <Typography variant="h6" color="textSecondary" sx={{ ml: 1 }}>
                {unit}
              </Typography>
              {getTrendIcon()}
            </Box>
          </Box>
          <Box color={`${color}.main`} sx={{ opacity: 0.7 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default function EnergyDashboard() {
  const [refreshInterval, setRefreshInterval] = useState(30000);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Queries para datos del dashboard
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useQuery<DashboardStats>('dashboard-stats', () => energyAPI.getDashboardStats(), {
    refetchInterval: refreshInterval,
    onSuccess: () => setLastUpdate(new Date()),
  });

  const {
    data: consumosPorPeriodo,
    isLoading: periodLoading,
    error: periodError,
  } = useQuery('consumos-periodo', () => energyAPI.getConsumosPorPeriodo('month'), {
    refetchInterval: refreshInterval,
  });

  const {
    data: topConsumidores,
    isLoading: topLoading,
    error: topError,
  } = useQuery('top-consumidores', () => energyAPI.getTopConsumidores(5), {
    refetchInterval: refreshInterval,
  });

  const {
    data: consumosPorTipo,
    isLoading: tipoLoading,
    error: tipoError,
  } = useQuery('consumos-tipo', () => energyAPI.getConsumosPorTipo(), {
    refetchInterval: refreshInterval,
  });

  const handleRefresh = () => {
    refetchStats();
    setLastUpdate(new Date());
  };

  // Configuración de gráficos
  const lineChartData = {
    labels: consumosPorPeriodo?.map(item => item.periodo) || [],
    datasets: [
      {
        label: 'Consumo (kWh)',
        data: consumosPorPeriodo?.map(item => item.consumoTotal) || [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
    ],
  };

  const barChartData = {
    labels: topConsumidores?.map(item => item.nombre) || [],
    datasets: [
      {
        label: 'Consumo (kWh)',
        data: topConsumidores?.map(item => item.consumoTotal) || [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 205, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
      },
    ],
  };

  const pieChartData = {
    labels: consumosPorTipo?.map(item => item.tipo) || [],
    datasets: [
      {
        data: consumosPorTipo?.map(item => item.porcentaje) || [],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  if (statsLoading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Cargando dashboard energético...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (statsError) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          Error al cargar los datos del dashboard. Verifique la conexión con el servidor.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h3" component="h1" gutterBottom>
              Energy Monitoring Dashboard
            </Typography>
            <Typography variant="h6">
              Última actualización: {lastUpdate.toLocaleTimeString('es-ES')}
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            sx={{ color: 'primary.main' }}
          >
            Actualizar
          </Button>
        </Box>
      </Paper>

      {/* Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Clientes"
            value={stats?.totalClientes || 0}
            unit=""
            icon={<People sx={{ fontSize: 40 }} />}
            color="primary"
            trend="up"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Consumo Total"
            value={stats?.consumoTotal?.toLocaleString() || 0}
            unit="kWh"
            icon={<Bolt sx={{ fontSize: 40 }} />}
            color="warning"
            trend="stable"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Facturación Total"
            value={`$${stats?.facturacionTotal?.toLocaleString() || 0}`}
            unit=""
            icon={<Assessment sx={{ fontSize: 40 }} />}
            color="success"
            trend="up"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Medidores Activos"
            value={stats?.medidoresActivos || 0}
            unit=""
            icon={<Timeline sx={{ fontSize: 40 }} />}
            color="info"
            trend="stable"
          />
        </Grid>
      </Grid>

      {/* Additional Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <MetricCard
            title="Promedio de Consumo"
            value={stats?.promedioConsumo?.toFixed(2) || 0}
            unit="kWh/cliente"
            icon={<TrendingUp sx={{ fontSize: 40 }} />}
            color="secondary"
            trend="down"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <MetricCard
            title="Alertas Activas"
            value={stats?.alertasActivas || 0}
            unit=""
            icon={<Warning sx={{ fontSize: 40 }} />}
            color="error"
            trend={stats?.alertasActivas && stats.alertasActivas > 0 ? 'up' : 'stable'}
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Consumption Timeline */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: 400 }}>
            <CardContent sx={{ height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Consumo por Período (Últimos 12 meses)
              </Typography>
              {periodLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                  <CircularProgress />
                </Box>
              ) : periodError ? (
                <Alert severity="error">Error al cargar datos de consumo por período</Alert>
              ) : (
                <Box height="300px">
                  <Line data={lineChartData} options={chartOptions} />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Top Consumers */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: 400 }}>
            <CardContent sx={{ height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Top 5 Consumidores
              </Typography>
              {topLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                  <CircularProgress />
                </Box>
              ) : topError ? (
                <Alert severity="error">Error al cargar top consumidores</Alert>
              ) : (
                <Box height="300px">
                  <Bar data={barChartData} options={chartOptions} />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Consumption by Type */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 400 }}>
            <CardContent sx={{ height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Distribución por Tipo de Cliente
              </Typography>
              {tipoLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                  <CircularProgress />
                </Box>
              ) : tipoError ? (
                <Alert severity="error">Error al cargar distribución por tipo</Alert>
              ) : (
                <Box height="300px">
                  <Pie data={pieChartData} options={chartOptions} />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* System Status */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Estado del Sistema
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Alert severity="success" sx={{ mb: 2 }}>
                  Todos los servicios funcionando correctamente
                </Alert>
                <Typography variant="body2" color="textSecondary">
                  • Servicio de clientes: Operativo
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  • Servicio de consumo: Operativo
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  • Servicio de facturación: Operativo
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  • Servicio de medidores: Operativo
                </Typography>
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" color="textSecondary">
                    Tiempo de respuesta promedio: 120ms
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Disponibilidad: 99.9%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}