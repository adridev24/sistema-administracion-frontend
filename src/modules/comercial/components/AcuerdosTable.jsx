import { Link } from 'react-router-dom';
import Badge from '../../../shared/components/Badge';

const AcuerdosTable = ({ acuerdos }) => {
  if (!acuerdos || acuerdos.length === 0) {
    return (
      <div className="empty-state empty-state-box">
        <strong>No hay acuerdos para mostrar</strong>
        <p>Selecciona un cliente para consultar acuerdos o crea uno nuevo desde la acción principal.</p>
      </div>
    );
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
              <td><strong>{item.numeroAcuerdo}</strong></td>
              <td>{item.clienteNombre || item.clienteExternoId}</td>
              <td>{item.obraNombre || item.obraExternaId}</td>
              <td>{new Date(item.fechaAcuerdo).toLocaleDateString()}</td>
              <td>${item.montoTotal.toLocaleString()}</td>
              <td><Badge type={item.estado}>{item.estado}</Badge></td>
              <td>{item.viaOperacion}</td>
              <td><Link className="btn-link" to={`/comercial/${item.id}`}>Detalle</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AcuerdosTable;
