import React, { useState, useRef } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { es } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt, FaTimes } from 'react-icons/fa';
import { FilterParams } from '../../types';
import './FilterForm.css';

// Registrar el idioma español para el DatePicker
registerLocale('es', es);

interface FilterFormProps {
  onFilterChange: (filters: FilterParams) => void;
  loading?: boolean;
}

const FilterForm: React.FC<FilterFormProps> = ({ onFilterChange, loading = false }) => {
  const [deviceId, setDeviceId] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [limit, setLimit] = useState<number>(100);
  const [errorMessage, setErrorMessage] = useState('');
  const startDatePickerRef = useRef<DatePicker>(null);
  const endDatePickerRef = useRef<DatePicker>(null);

  const validateForm = (): boolean => {
    if (startDate && endDate && startDate > endDate) {
      setErrorMessage('La fecha de inicio no puede ser mayor que la fecha de fin.');
      return false;
    }
    if (limit < 1 || limit > 1000) {
      setErrorMessage('El límite debe estar entre 1 y 1000.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const filters: FilterParams = {
      ...(deviceId && { deviceId }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
      limit,
    };

    onFilterChange(filters);
  };

  const clearFilters = () => {
    setDeviceId('');
    setStartDate(null);
    setEndDate(null);
    setLimit(100);
    setErrorMessage('');
    onFilterChange({ limit: 100 });
  };

  return (
    <form className="filter-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="deviceId">ID Dispositivo</label>
        <input
          type="text"
          id="deviceId"
          className="form-control"
          value={deviceId}
          onChange={(e) => setDeviceId(e.target.value)}
          placeholder="Ingrese ID del dispositivo (opcional)"
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="limit">Límite de resultados</label>
        <input
          type="number"
          id="limit"
          className="form-control"
          value={limit}
          onChange={(e) => setLimit(parseInt(e.target.value) || 100)}
          min="1"
          max="1000"
          disabled={loading}
        />
      </div>

      <div className="form-group date-group">
        <label>Fecha de Inicio</label>
        <div className="date-picker-wrapper">
          <FaCalendarAlt className="calendar-icon" onClick={() => startDatePickerRef.current?.setOpen(true)} />
          <DatePicker
            selected={startDate}
            onChange={(date: Date | null) => setStartDate(date)}
            dateFormat="dd/MM/yyyy"
            locale="es"
            className="date-picker"
            showYearDropdown
            showMonthDropdown
            dropdownMode="select"
            popperPlacement="bottom-start"
            ref={startDatePickerRef}
            disabled={loading}
            maxDate={endDate || new Date()}
          />
          {startDate && (
            <div className="date-display">
              {startDate.toLocaleDateString('es-ES')}
              <FaTimes
                className="clear-date-icon"
                onClick={() => setStartDate(null)}
                title="Limpiar fecha"
              />
            </div>
          )}
        </div>
      </div>

      <div className="form-group date-group">
        <label>Fecha de Fin</label>
        <div className="date-picker-wrapper">
          <FaCalendarAlt className="calendar-icon" onClick={() => endDatePickerRef.current?.setOpen(true)} />
          <DatePicker
            selected={endDate}
            onChange={(date: Date | null) => setEndDate(date)}
            dateFormat="dd/MM/yyyy"
            locale="es"
            className="date-picker"
            showYearDropdown
            showMonthDropdown
            dropdownMode="select"
            popperPlacement="bottom-start"
            ref={endDatePickerRef}
            disabled={loading}
            minDate={startDate}
            maxDate={new Date()}
          />
          {endDate && (
            <div className="date-display">
              {endDate.toLocaleDateString('es-ES')}
              <FaTimes
                className="clear-date-icon"
                onClick={() => setEndDate(null)}
                title="Limpiar fecha"
              />
            </div>
          )}
        </div>
      </div>

      <div className="btn-container">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Filtrando...' : 'Filtrar'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={clearFilters} disabled={loading}>
          Limpiar
        </button>
      </div>

      {errorMessage && (
        <div className="error-message" role="alert">
          {errorMessage}
        </div>
      )}
    </form>
  );
};

export default FilterForm;
