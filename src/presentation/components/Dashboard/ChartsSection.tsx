import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  PeakHourData,
  MonthlyData
} from '../../../application/usecases/GetDashboardStatsUseCase';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartsSectionProps {
  peakHours: PeakHourData[];
  monthlyData: MonthlyData[];
}

export function ChartsSection({ peakHours, monthlyData }: ChartsSectionProps): JSX.Element {
  const peakHoursChartData = {
    labels: peakHours.map(hour => `${hour.hour}:00`),
    datasets: [
      {
        label: 'Consumo por Hora (kWh)',
        data: peakHours.map(hour => hour.consumption),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
      },
    ],
  };

  const monthlyChartData = {
    labels: monthlyData.map(month => month.month),
    datasets: [
      {
        label: 'Consumo (kWh)',
        data: monthlyData.map(month => month.consumption),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        yAxisID: 'y',
      },
      {
        label: 'Costo (€)',
        data: monthlyData.map(month => month.cost),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        yAxisID: 'y1',
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

  const monthlyChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Consumo (kWh)',
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Costo (€)',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={6}>
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Consumo por Horas Pico
            </Typography>
            <Box sx={{ height: 300 }}>
              <Bar
                data={peakHoursChartData}
                options={chartOptions}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} lg={6}>
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Tendencia Mensual
            </Typography>
            <Box sx={{ height: 300 }}>
              <Line
                data={monthlyChartData}
                options={monthlyChartOptions}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}