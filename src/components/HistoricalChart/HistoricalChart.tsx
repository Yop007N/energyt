import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartOptions } from 'chart.js';
import './HistoricalChart.css'; // Importar el CSS independiente

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface HistoricalChartProps {
  filters: { startDate: string; endDate: string; id_dispositivo: string };
}

const fetchMensajeUplinks = async (filters: { startDate: string; endDate: string; id_dispositivo: string }) => {
  const { data } = await axios.get('/api/uplink-messages', { params: filters });
  return data;
};

const HistoricalChart: React.FC<HistoricalChartProps> = ({ filters }) => {
  const { data, error, isLoading } = useQuery(['historicalMensajeUplinks', filters], () => fetchMensajeUplinks(filters), {
    enabled: !!filters.startDate && !!filters.endDate && !!filters.id_dispositivo
  });

  if (isLoading) return <div className="loading">Cargando datos...</div>;
  if (error instanceof Error) {
    if (error.message.includes('404')) {
      return <div className="error">Error 404: No se encontraron datos para las fechas seleccionadas. Por favor, intenta con otros rangos de fechas.</div>;
    }
    return <div className="error">Error: {error.message}</div>;
  }
  if (!data || data.length === 0) return <div className="no-data">No hay datos disponibles para las fechas seleccionadas.</div>;

  const chartData = {
    labels: data.map((mensaje: { received_at: Date }) => new Date(mensaje.received_at).toLocaleString()),
    datasets: [
      {
        label: 'Consumo de Energía (kWh)',
        data: data.map((mensaje: { decoded_payload_float: number }) => mensaje.decoded_payload_float),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.4, // Makes the line smoother
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const, // Ensure the correct type is used
        labels: {
          font: {
            size: 14,
            weight: 'bold',
          },
          color: '#333',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        titleFont: {
          size: 16,
          weight: 'bold',
        },
        bodyFont: {
          size: 14,
        },
        bodySpacing: 10,
        padding: 10,
        cornerRadius: 4,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            weight: 'bold',
          },
          color: '#333',
        },
      },
      y: {
        grid: {
          color: 'rgba(200, 200, 200, 0.2)',
        },
        ticks: {
          font: {
            size: 12,
            weight: 'bold',
          },
          color: '#333',
          callback: (value: string | number) => `${value} kWh`, // Ensure correct type for callback
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <h2>Datos Históricos</h2>
      <div className="chart-wrapper">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default HistoricalChart;
