import React from 'react';
import './MensajeUplinkList.css';

interface MensajeUplink {
  id: number;
  decoded_payload_float: number;
  received_at: string;
}

interface MensajeUplinkListProps {
  mensajes: MensajeUplink[];
}

const MensajeUplinkList: React.FC<MensajeUplinkListProps> = ({ mensajes }) => {
  return (
    <div>
      <h2>Lecturas  de Consumo del Medidor</h2>
      <table className="styled-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Lecturas</th>
            <th>Fecha </th>
          </tr>
        </thead>
        <tbody>
          {mensajes.map((mensaje) => (
            <tr key={mensaje.id}>
              <td>{mensaje.id}</td>
              <td>{mensaje.decoded_payload_float}</td>
              <td>{new Date(mensaje.received_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MensajeUplinkList;
