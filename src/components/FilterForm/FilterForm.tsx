import React, { useState, useRef } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { es } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';
import './FilterForm.css';

// Registrar el idioma español para el DatePicker
registerLocale('es', es);

interface FilterFormProps {
  onFilter: (id_dispositivo: string, startDate: string, endDate: string) => void;
}

const FilterForm: React.FC<FilterFormProps> = ({ onFilter }) => {
  const [idDispositivo, setIdDispositivo] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const startDatePickerRef = useRef<DatePicker>(null);
  const endDatePickerRef = useRef<DatePicker>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idDispositivo) {
      setErrorMessage('Por favor, ingrese el ID del dispositivo.');
      return;
    }
    if (!startDate || !endDate) {
      setErrorMessage('Por favor, seleccione las fechas de inicio y fin.');
      return;
    }
    setErrorMessage('');
    onFilter(idDispositivo, startDate.toISOString(), endDate.toISOString());
  };

  return (
    <form className="filter-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="idDispositivo">ID Dispositivo</label>
        <input
          type="text"
          id="idDispositivo"
          className="form-control"
          value={idDispositivo}
          onChange={(e) => setIdDispositivo(e.target.value)}
          placeholder="Ingrese ID del dispositivo"
          required
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
          />
          {startDate && (
            <div className="date-display">
              {startDate.toLocaleDateString('es-ES')}
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
          />
          {endDate && (
            <div className="date-display">
              {endDate.toLocaleDateString('es-ES')}
            </div>
          )}
        </div>
      </div>
      <div className="btn-container">
        <button type="submit" className="btn btn-primary">Filtrar</button>
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </form>
  );
};

export default FilterForm;
