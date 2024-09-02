import React, { useState, useEffect } from 'react';
import FilterForm from './components/FilterForm/FilterForm';
import MensajeUplinkList from './components/MensajesUplinkList/MensajeUplinkList';
import HistoricalChart from './components/HistoricalChart/HistoricalChart';
import './App.css';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

const App: React.FC = () => {
  const [mensajes, setMensajes] = useState([]);
  const [filters, setFilters] = useState({ id_dispositivo: '', startDate: '', endDate: '' });

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/listar-capturas`);
      const data = await response.json();
      if (response.ok) {
        setMensajes(data);
      } else {
        console.error('Error fetching data:', data.message);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilter = async (id_dispositivo: string, startDate: string, endDate: string) => {
    setFilters({ id_dispositivo, startDate, endDate });

    try {
      const response = await fetch(`/api/uplink-messages?id_dispositivo=${id_dispositivo}&startDate=${startDate}&endDate=${endDate}`);
      const data = await response.json();
      if (response.ok) {
        setMensajes(data);
      } else {
        console.error('Error fetching data:', data.message);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="app-container">
        <header>
          <h1>Sistema de Monitoreo de Energía OBIS 15.8.0</h1>
        </header>
        <main>
          <div className="main-container">
            <section className="filter-section">
              <FilterForm onFilter={handleFilter} />
            </section>
            <section className="content">
              <div className="list">
                <MensajeUplinkList mensajes={mensajes} />
              </div>
              <div className="chart">
                <HistoricalChart filters={filters} />
              </div>
            </section>
          </div>
        </main>
      </div>
    </QueryClientProvider>
  );
};

export default App;
