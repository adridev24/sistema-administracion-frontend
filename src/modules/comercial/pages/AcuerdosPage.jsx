import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SectionCard from '../../../shared/components/SectionCard';
import LoadingSpinner from '../../../shared/components/LoadingSpinner';
import AcuerdosTable from '../components/AcuerdosTable';
import ClienteObraSelector from '../components/ClienteObraSelector';
import useAcuerdos from '../hooks/useAcuerdos';
import '../comercial.css';

const AcuerdosPage = () => {
  const [filters, setFilters] = useState({ clienteExternoId: '', obraExternoId: '' });
  const { acuerdos, loading, error, fetchAcuerdosPorCliente } = useAcuerdos();

  const canSearchCliente = Boolean(filters.clienteExternoId);

  const handleSearchCliente = () => {
    if (canSearchCliente) {
      fetchAcuerdosPorCliente(filters.clienteExternoId, filters.obraExternaId);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Acuerdos comerciales</h1>
          <p className="page-subtitle">Consulta acuerdos comerciales por cliente u obra y revisa su estado comercial.</p>
        </div>
        <div className="header-actions">
          <Link className="btn-secondary" to="/">Dashboard</Link>
          <Link className="btn-primary" to="/comercial/nuevo">Nuevo acuerdo</Link>
        </div>
      </div>

      <SectionCard title="Filtros de búsqueda" description="Selecciona un cliente desde la lista para ver sus acuerdos.">
        <div className="filter-grid">
          <div className="filter-card">
            <h4>Buscar por cliente</h4>
            <ClienteObraSelector
              clienteExternoId={filters.clienteExternoId}
              obraExternoId={filters.obraExternoId}
              onChange={(values) => setFilters((prev) => ({ ...prev, ...values }))}
            />
            <button
              className="btn-secondary"
              type="button"
              onClick={handleSearchCliente}
              disabled={!canSearchCliente}
            >
              Ver acuerdos del cliente
            </button>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Resultados" description="Los acuerdos aparecen aquí después de una búsqueda exitosa.">
        {loading ? <LoadingSpinner /> : <AcuerdosTable acuerdos={acuerdos} />}
        {error && <p className="form-error">{error}</p>}
      </SectionCard>
    </div>
  );
};

export default AcuerdosPage;
