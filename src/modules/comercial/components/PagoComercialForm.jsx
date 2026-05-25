import React, { useState, useEffect } from 'react';
import AplicacionPagoForm from './AplicacionPagoForm';

const PagoComercialForm = ({ acuerdo, cuotas, onSubmit, loading, error }) => {
  const [form, setForm] = useState({
    clienteExternoId: acuerdo?.clienteExternoId || '',
    obraExternaId: acuerdo?.obraExternaId || '',
    acuerdoComercialId: acuerdo?.id || '',
    fechaPago: '',
    importeTotal: '',
    medioPago: '',
    observaciones: '',
    aplicaciones: []
  });

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      clienteExternoId: acuerdo?.clienteExternoId || '',
      obraExternaId: acuerdo?.obraExternaId || '',
      acuerdoComercialId: acuerdo?.id || ''
    }));
  }, [acuerdo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAplicacionesChange = (aplicaciones) => {
    setForm({ ...form, aplicaciones });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const importeTotal = Number(form.importeTotal);
    if (importeTotal <= 0) {
      return;
    }

    onSubmit({
      ...form,
      importeTotal,
      fechaPago: new Date(form.fechaPago).toISOString(),
      aplicaciones: form.aplicaciones.filter((item) => item.importeAplicado > 0)
    });
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <div className="form-field">
        <label>Acuerdo</label>
        <input value={acuerdo?.numeroAcuerdo || ''} disabled />
      </div>
      <div className="form-field">
        <label>Fecha de pago</label>
        <input type="date" name="fechaPago" value={form.fechaPago} onChange={handleChange} required />
      </div>
      <div className="form-field">
        <label>Importe total</label>
        <input type="number" min="0.01" step="0.01" name="importeTotal" value={form.importeTotal} onChange={handleChange} required />
      </div>
      <div className="form-field">
        <label>Medio de pago</label>
        <input name="medioPago" value={form.medioPago} onChange={handleChange} required />
      </div>
      <div className="form-field full-width">
        <label>Observaciones</label>
        <textarea name="observaciones" value={form.observaciones} onChange={handleChange} rows="3" />
      </div>

      <div className="full-width payment-applications">
        <h3>Aplicación a cuotas</h3>
        <AplicacionPagoForm cuotas={cuotas} onChange={handleAplicacionesChange} pagoTotal={Number(form.importeTotal)} />
      </div>

      {error && <p className="form-error">{error}</p>}
      <div className="form-footer full-width">
        <button className="btn-primary" type="submit" disabled={loading || !acuerdo}>
          {loading ? 'Guardando pago...' : 'Registrar pago comercial'}
        </button>
      </div>
    </form>
  );
};

export default PagoComercialForm;
