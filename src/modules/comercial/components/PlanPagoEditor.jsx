import React, { useEffect, useMemo, useState } from 'react';
import '../comercial.css';

const parseDateValue = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().slice(0, 10);
};

const PlanPagoEditor = ({ planPago, onSave, loading, error }) => {
  const [plan, setPlan] = useState({ ...planPago });

  useEffect(() => {
    setPlan({
      ...planPago,
      fechaPrimerVencimiento: parseDateValue(planPago.fechaPrimerVencimiento),
      cuotas: planPago.cuotas.map((cuota) => ({
        ...cuota,
        fechaVencimiento: parseDateValue(cuota.fechaVencimiento),
      })),
    });
  }, [planPago]);

  const totalPlan = useMemo(() => {
    const cuotasTotal = plan.cuotas.reduce((sum, cuota) => sum + Number(cuota.importeOriginal || 0), 0);
    return Number(plan.montoAnticipo || 0) + cuotasTotal;
  }, [plan]);

  const handlePlanField = (field, value) => {
    setPlan((prev) => ({ ...prev, [field]: value }));
  };

  const handleCuotaField = (id, field, value) => {
    setPlan((prev) => ({
      ...prev,
      cuotas: prev.cuotas.map((cuota) => (
        cuota.id === id ? { ...cuota, [field]: value } : cuota
      )),
    }));
  };

  const handleSave = () => {
    const payload = {
      tieneAnticipo: Boolean(plan.tieneAnticipo),
      montoAnticipo: Number(plan.montoAnticipo || 0),
      cantidadCuotas: Number(plan.cantidadCuotas || 0),
      fechaPrimerVencimiento: new Date(plan.fechaPrimerVencimiento).toISOString(),
      periodicidad: plan.periodicidad,
      observaciones: plan.observaciones,
      cuotas: plan.cuotas.map((cuota) => ({
        id: cuota.id,
        fechaVencimiento: new Date(cuota.fechaVencimiento).toISOString(),
        importeOriginal: Number(cuota.importeOriginal || 0)
      }))
    };

    onSave(payload);
  };

  if (!plan) {
    return <p className="empty-state">No hay plan de pago para editar.</p>;
  }

  return (
    <div>
      <div className="info-grid">
        <div>
          <strong>Periodicidad</strong>
          <p>{plan.periodicidad}</p>
        </div>
        <div>
          <strong>Cantidad de cuotas</strong>
          <p>{plan.cantidadCuotas}</p>
        </div>
        <div>
          <strong>Primer vencimiento</strong>
          <input
            type="date"
            value={plan.fechaPrimerVencimiento}
            onChange={(e) => handlePlanField('fechaPrimerVencimiento', e.target.value)}
          />
        </div>
        <div>
          <strong>Anticipo</strong>
          <p>{plan.tieneAnticipo ? 'Sí' : 'No'}</p>
        </div>
        <div>
          <strong>Monto anticipo</strong>
          <input
            type="number"
            min="0"
            step="0.01"
            value={plan.montoAnticipo}
            onChange={(e) => handlePlanField('montoAnticipo', e.target.value)}
          />
        </div>
        <div>
          <strong>Total del acuerdo</strong>
          <p>${totalPlan.toLocaleString()}</p>
        </div>
      </div>

      <div className="table-wrapper editable-plan-table">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Tipo</th>
              <th>Vencimiento</th>
              <th>Importe original</th>
              <th>Pagado</th>
              <th>Saldo</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {plan.cuotas.map((cuota) => (
              <tr key={cuota.id}>
                <td>{cuota.numeroCuota}</td>
                <td>{cuota.tipoCuota}</td>
                <td>
                  <input
                    type="date"
                    className="table-input"
                    value={cuota.fechaVencimiento}
                    onChange={(e) => handleCuotaField(cuota.id, 'fechaVencimiento', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="table-input"
                    min="0.01"
                    step="0.01"
                    value={cuota.importeOriginal}
                    onChange={(e) => handleCuotaField(cuota.id, 'importeOriginal', e.target.value)}
                  />
                </td>
                <td>${Number(cuota.importePagado || 0).toLocaleString()}</td>
                <td>${Number(cuota.saldoPendiente || 0).toLocaleString()}</td>
                <td>{cuota.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="form-footer">
        <button className="btn-primary" type="button" onClick={handleSave} disabled={loading}>
          {loading ? 'Guardando cambios...' : 'Guardar personalización'}
        </button>
      </div>
    </div>
  );
};

export default PlanPagoEditor;
