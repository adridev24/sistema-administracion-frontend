import React, { useState } from 'react';
import ClienteObraSelector from './ClienteObraSelector';

const initialForm = {
  clienteExternoId: '',
  obraExternaId: '',
  numeroAcuerdo: '',
  fechaAcuerdo: '',
  descripcion: '',
  montoTotal: '',
  estado: 'Borrador',
  viaOperacion: 'Via1',
  observaciones: '',
  usuarioAlta: ''
};

const AcuerdoForm = ({ onSubmit, loading }) => {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const montoTotal = Number(form.montoTotal);
    if (!form.clienteExternoId || !form.obraExternaId || !form.numeroAcuerdo || !form.fechaAcuerdo || montoTotal <= 0 || !form.usuarioAlta) {
      setError('Completa todos los campos obligatorios y utiliza un monto mayor a cero.');
      return;
    }
    setError('');
    onSubmit({
      ...form,
      montoTotal,
      fechaAcuerdo: new Date(form.fechaAcuerdo).toISOString()
    });
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <div className="form-field full-width">
        <label></label>
        <ClienteObraSelector
          clienteExternoId={form.clienteExternoId}
          obraExternoId={form.obraExternaId}
          onChange={(update) => setForm({ ...form, ...update })}
        />
      </div>
      <div className="form-field">
        <label>Número de Acuerdo</label>
        <input name="numeroAcuerdo" value={form.numeroAcuerdo} onChange={handleChange} placeholder="AC-2026-001" required />
      </div>
      <div className="form-field">
        <label>Fecha de Acuerdo</label>
        <input type="date" name="fechaAcuerdo" value={form.fechaAcuerdo} onChange={handleChange} required />
      </div>
      <div className="form-field">
        <label>Monto Total</label>
        <input type="number" min="0" step="0.01" name="montoTotal" value={form.montoTotal} onChange={handleChange} required />
      </div>
      <div className="form-field">
        <label>Vía</label>
        <select name="viaOperacion" value={form.viaOperacion} onChange={handleChange}>
          <option value="Via1">Via1</option>
          <option value="Via2">Via2</option>
        </select>
      </div>
      <div className="form-field full-width">
        <label>Descripción</label>
        <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows="3" />
      </div>
      <div className="form-field full-width">
        <label>Observaciones</label>
        <textarea name="observaciones" value={form.observaciones} onChange={handleChange} rows="3" />
      </div>
      <div className="form-field">
        <label>Usuario Alta</label>
        <input name="usuarioAlta" value={form.usuarioAlta} onChange={handleChange} placeholder="admin" required />
      </div>
      <div className="form-footer full-width">
        {error && <p className="form-error">{error}</p>}
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar acuerdo'}
        </button>
      </div>
    </form>
  );
};

export default AcuerdoForm;
