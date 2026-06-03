import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SectionCard from '../../../shared/components/SectionCard';
import LoadingSpinner from '../../../shared/components/LoadingSpinner';
import externalDataService from '../services/externalDataService';
import EstadoComercialResumen from '../components/EstadoComercialResumen';
import PlanPagoForm from '../components/PlanPagoForm';
import PlanPagoEditor from '../components/PlanPagoEditor';
import CuotasComercialesTable from '../components/CuotasComercialesTable';
import AjusteCuotaModal from '../components/AjusteCuotaModal';
import AgregarCuotaModal from '../components/AgregarCuotaModal';
import useAcuerdoDetalle from '../hooks/useAcuerdoDetalle';
import acuerdosService from '../services/acuerdosService';
import '../comercial.css';

const AcuerdoDetallePage = () => {
  const { id } = useParams();
  const { detalle, loading, error, setDetalle } = useAcuerdoDetalle(id);
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState('');
  const [approving, setApproving] = useState(false);
  const [approveError, setApproveError] = useState('');
  const [success, setSuccess] = useState('');
  const [clienteNombre, setClienteNombre] = useState('');
  const [obraNombre, setObraNombre] = useState('');
  const [ajustarModalOpen, setAjustarModalOpen] = useState(false);
  const [selectedCuota, setSelectedCuota] = useState(null);
  const [agregarModalOpen, setAgregarModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  const planExists = detalle?.planPago?.id > 0;

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
      await acuerdosService.crearPlanPago(Number(id), payload);
      const updatedDetalle = await acuerdosService.getAcuerdoDetalle(id);
      setDetalle(updatedDetalle);
      setSuccess('Plan de pago generado correctamente.');
    } catch (err) {
      setPlanError('No se pudo generar el plan. Revisa los datos y vuelve a intentar.');
    } finally {
      setPlanLoading(false);
    }
  };

  const handleApprove = async () => {
    setApproveError('');
    setSuccess('');
    setApproving(true);
    try {
      const updated = await acuerdosService.aprobarAcuerdo(Number(id));
      setDetalle({ ...detalle, estado: updated.estado });
      setSuccess('Acuerdo aprobado correctamente.');
    } catch (err) {
      setApproveError('No se pudo aprobar el acuerdo. Intenta nuevamente.');
    } finally {
      setApproving(false);
    }
  };

  const openAjustarCuota = (cuota) => {
    setSelectedCuota(cuota);
    setModalError('');
    setSuccess('');
    setAjustarModalOpen(true);
  };

  const closeAjustarCuota = () => {
    setAjustarModalOpen(false);
    setSelectedCuota(null);
    setModalError('');
  };

  const handleAjustarCuota = async (payload) => {
    setModalLoading(true);
    setModalError('');
    setSuccess('');
    try {
      await acuerdosService.ajustarCuota(selectedCuota.id, payload);
      const updatedDetalle = await acuerdosService.getAcuerdoDetalle(id);
      setDetalle(updatedDetalle);
      setSuccess('Ajuste de cuota registrado correctamente.');
      closeAjustarCuota();
    } catch (err) {
      setModalError('No se pudo guardar el ajuste. Revisa los datos e intenta nuevamente.');
    } finally {
      setModalLoading(false);
    }
  };

  const openAgregarCuota = () => {
    setAgregarModalOpen(true);
    setModalError('');
    setSuccess('');
  };

  const closeAgregarCuota = () => {
    setAgregarModalOpen(false);
    setModalError('');
  };

  const handleAgregarCuota = async (payload) => {
    if (!detalle?.planPago) return;
    setModalLoading(true);
    setModalError('');
    setSuccess('');
    try {
      await acuerdosService.agregarCuotaAjuste(detalle.planPago.id, payload);
      const updatedDetalle = await acuerdosService.getAcuerdoDetalle(id);
      setDetalle(updatedDetalle);
      setSuccess('Cuota adicional agregada correctamente.');
      closeAgregarCuota();
    } catch (err) {
      setModalError('No se pudo agregar la cuota. Revisa los datos e intenta nuevamente.');
    } finally {
      setModalLoading(false);
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
        <div className="page-actions">
          {detalle.estado === 'Borrador' && (
            <button className="btn-primary" type="button" onClick={handleApprove} disabled={approving}>
              {approving ? 'Aprobando...' : 'Aprobar acuerdo'}
            </button>
          )}
          <Link className="btn-secondary" to="/comercial">Volver a acuerdos</Link>
        </div>
      </div>

      {approveError && <p className="form-error">{approveError}</p>}
      {success && <p className="form-success">{success}</p>}

      <section className="detail-hero">
        <div>
          <span className="eyebrow">Resumen del acuerdo</span>
          <h2>{clienteNombre || detalle.clienteExternoId}</h2>
          <p>{obraNombre || detalle.obraExternaId}</p>
        </div>
        <div className="detail-hero-facts">
          <div><span>Estado</span><strong>{detalle.estado}</strong></div>
          <div><span>Vía</span><strong>{detalle.viaOperacion}</strong></div>
          <div><span>Monto total</span><strong>${detalle.montoTotal.toLocaleString()}</strong></div>
          <div><span>Fecha</span><strong>{new Date(detalle.fechaAcuerdo).toLocaleDateString()}</strong></div>
        </div>
      </section>

      <SectionCard title="Estado comercial" description="Suma pagada y deuda restante del acuerdo.">
        <EstadoComercialResumen estado={estadoComercial} />
      </SectionCard>

      {!planExists ? (
        <SectionCard title="Generar plan de pago" description="Crea el plan de cuotas para este acuerdo.">
          <PlanPagoForm onSubmit={handleCreatePlan} loading={planLoading} />
          {planError && <p className="form-error">{planError}</p>}
          {success && <p className="form-success">{success}</p>}
        </SectionCard>
      ) : detalle.estado === 'Borrador' ? (
        <SectionCard title="Plan de pago editable" description="Personaliza las cuotas antes de aprobar el acuerdo.">
          <PlanPagoEditor
            planPago={detalle.planPago}
            onSave={async (payload) => {
              setPlanLoading(true);
              setPlanError('');
              setSuccess('');
              try {
                await acuerdosService.actualizarPlanPago(Number(id), payload);
                const updatedDetalle = await acuerdosService.getAcuerdoDetalle(id);
                setDetalle(updatedDetalle);
                setSuccess('Personalización guardada correctamente.');
              } catch (err) {
                setPlanError('No se pudo actualizar el plan. Revisa los valores y vuelve a intentar.');
              } finally {
                setPlanLoading(false);
              }
            }}
            loading={planLoading}
            error={planError}
          />
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
          {(detalle.estado === 'Aprobado' || detalle.estado === 'EnCurso') && (
            <div className="page-actions" style={{ marginBottom: '18px' }}>
              <button className="btn-primary" type="button" onClick={openAgregarCuota}>
                Agregar cuota
              </button>
            </div>
          )}
          <CuotasComercialesTable cuotas={detalle.planPago.cuotas} onAdjustCuota={openAjustarCuota} />
        </SectionCard>
      )}

      <AjusteCuotaModal
        open={ajustarModalOpen}
        cuota={selectedCuota}
        onClose={closeAjustarCuota}
        onSave={handleAjustarCuota}
        loading={modalLoading}
        error={modalError}
      />
      <AgregarCuotaModal
        open={agregarModalOpen}
        planPago={detalle.planPago}
        onClose={closeAgregarCuota}
        onSave={handleAgregarCuota}
        loading={modalLoading}
        error={modalError}
      />
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
