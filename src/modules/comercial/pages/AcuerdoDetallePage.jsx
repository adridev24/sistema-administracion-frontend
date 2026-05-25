import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SectionCard from '../../../shared/components/SectionCard';
import LoadingSpinner from '../../../shared/components/LoadingSpinner';
import externalDataService from '../services/externalDataService';
import EstadoComercialResumen from '../components/EstadoComercialResumen';
import PlanPagoForm from '../components/PlanPagoForm';
import CuotasComercialesTable from '../components/CuotasComercialesTable';
import useAcuerdoDetalle from '../hooks/useAcuerdoDetalle';
import acuerdosService from '../services/acuerdosService';
import '../comercial.css';

const AcuerdoDetallePage = () => {
  const { id } = useParams();
  const { detalle, loading, error, setDetalle } = useAcuerdoDetalle(id);
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState('');
  const [success, setSuccess] = useState('');
  const [clienteNombre, setClienteNombre] = useState('');
  const [obraNombre, setObraNombre] = useState('');

  useEffect(() => {
    if (!detalle) {
      setClienteNombre('');
      setObraNombre('');
      return;
    }

    const clienteId = Number(detalle.clienteExternoId);
    const obraId = Number(detalle.obraExternaId);

    if (!Number.isNaN(clienteId)) {
      externalDataService.getClientById(clienteId)
        .then((client) => {
          if (client) setClienteNombre(client.nombreCliente);
        })
        .catch(() => {
          setClienteNombre('');
        });
    }

    if (!Number.isNaN(obraId)) {
      externalDataService.getObraById(obraId)
        .then((obra) => {
          if (obra) setObraNombre(obra.nombreObra);
        })
        .catch(() => {
          setObraNombre('');
        });
    }
  }, [detalle]);

  const estadoComercial = useMemo(() => {
    if (!detalle) return null;
    return {
      totalPrometido: detalle.montoTotal,
      totalPagado: detalle.pagos?.reduce((sum, pago) => sum + pago.aplicaciones.reduce((inner, app) => inner + app.importeAplicado, 0), 0) || 0,
      saldoRestante: Math.max(detalle.montoTotal - (detalle.pagos?.reduce((sum, pago) => sum + pago.aplicaciones.reduce((inner, app) => inner + app.importeAplicado, 0), 0) || 0), 0)
    };
  }, [detalle]);

  const handleCreatePlan = async (payload) => {
    setPlanLoading(true);
    setPlanError('');
    setSuccess('');
    try {
      const plan = await acuerdosService.crearPlanPago(Number(id), payload);
      setDetalle({ ...detalle, planPago: plan });
      setSuccess('Plan de pago generado correctamente.');
    } catch (err) {
      setPlanError('No se pudo generar el plan. Revisa los datos y vuelve a intentar.');
    } finally {
      setPlanLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="page-container"><p className="form-error">{error}</p></div>;
  }

  if (!detalle) {
    return <div className="page-container"><p className="empty-state">Acuerdo no encontrado.</p></div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Detalle del acuerdo {detalle.numeroAcuerdo}</h1>
          <p className="page-subtitle">Revisa el plan de pago, cuotas y los pagos aplicados sobre este compromiso comercial.</p>
        </div>
        <Link className="btn-secondary" to="/comercial">Volver a acuerdos</Link>
      </div>

      <SectionCard title="Resumen del acuerdo" description="Información principal del compromiso comercial.">
        <div className="info-grid">
          <div><strong>Cliente</strong><p>{clienteNombre || detalle.clienteExternoId}</p></div>
          <div><strong>Obra</strong><p>{obraNombre || detalle.obraExternaId}</p></div>
          <div><strong>Estado</strong><p>{detalle.estado}</p></div>
          <div><strong>Vía</strong><p>{detalle.viaOperacion}</p></div>
          <div><strong>Monto Total</strong><p>${detalle.montoTotal.toLocaleString()}</p></div>
          <div><strong>Fecha Acuerdo</strong><p>{new Date(detalle.fechaAcuerdo).toLocaleDateString()}</p></div>
        </div>
      </SectionCard>

      <SectionCard title="Estado comercial" description="Suma pagada y deuda restante del acuerdo.">
        <EstadoComercialResumen estado={estadoComercial} />
      </SectionCard>

      {!detalle.planPago ? (
        <SectionCard title="Generar plan de pago" description="Crea el plan de cuotas para este acuerdo.">
          <PlanPagoForm onSubmit={handleCreatePlan} loading={planLoading} />
          {planError && <p className="form-error">{planError}</p>}
          {success && <p className="form-success">{success}</p>}
        </SectionCard>
      ) : (
        <SectionCard title="Plan de pago" description="Visualiza las cuotas generadas automáticamente." >
          <div className="info-grid">
            <div><strong>Anticipo</strong><p>{detalle.planPago.tieneAnticipo ? 'Sí' : 'No'}</p></div>
            <div><strong>Monto anticipo</strong><p>${detalle.planPago.montoAnticipo.toLocaleString()}</p></div>
            <div><strong>Cuotas</strong><p>{detalle.planPago.cantidadCuotas}</p></div>
            <div><strong>Periodicidad</strong><p>{detalle.planPago.periodicidad}</p></div>
            <div><strong>Primer vencimiento</strong><p>{new Date(detalle.planPago.fechaPrimerVencimiento).toLocaleDateString()}</p></div>
          </div>
          <CuotasComercialesTable cuotas={detalle.planPago.cuotas} />
        </SectionCard>
      )}

      <SectionCard title="Pagos aplicados" description="Pagos comerciales registrados y su aplicación a cuotas.">
        {detalle.pagos && detalle.pagos.length > 0 ? (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha pago</th>
                  <th>Importe total</th>
                  <th>Medio</th>
                  <th>Estado</th>
                  <th>Aplicado</th>
                </tr>
              </thead>
              <tbody>
                {detalle.pagos.map((pago) => (
                  <tr key={pago.id}>
                    <td>{pago.id}</td>
                    <td>{new Date(pago.fechaPago).toLocaleDateString()}</td>
                    <td>${pago.importeTotal.toLocaleString()}</td>
                    <td>{pago.medioPago}</td>
                    <td>{pago.estado}</td>
                    <td>${pago.aplicaciones.reduce((sum, app) => sum + app.importeAplicado, 0).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="empty-state">Aún no se registran pagos aplicados.</p>
        )}
      </SectionCard>
    </div>
  );
};

export default AcuerdoDetallePage;
