import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../../../shared/components/Badge';

const AcuerdosTable = ({ acuerdos }) => {
  if (!acuerdos || acuerdos.length === 0) {
    return <p className="empty-state">No hay acuerdos cargados para estos filtros.</p>;
  }

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>Acuerdo</th>
            <th>Cliente</th>
            <th>Obra</th>
            <th>Fecha</th>
            <th>Monto total</th>
            <th>Estado</th>
            <th>Vía</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {acuerdos.map((item) => (
            <tr key={item.id}>
              <td>{item.numeroAcuerdo}</td>
              <td>{item.clienteNombre || item.clienteExternoId}</td>
              <td>{item.obraNombre || item.obraExternaId}</td>
              <td>{new Date(item.fechaAcuerdo).toLocaleDateString()}</td>
              <td>${item.montoTotal.toLocaleString()}</td>
              <td><Badge type={item.estado}>{item.estado}</Badge></td>
              <td>{item.viaOperacion}</td>
              <td><Link className="btn-link" to={`/comercial/${item.id}`}>Ver detalle</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AcuerdosTable;
