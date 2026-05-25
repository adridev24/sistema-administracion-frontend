import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>METALÚRGICA ALBACE</h1>
          <p>Panel administrativo con acceso a los módulos comerciales, contables y de gestión.</p>
        </div>
        <div className="dashboard-actions">
          <Link to="/comercial" className="dashboard-button">Gestión Comercial</Link>
          <button onClick={() => window.location.reload()} className="dashboard-button-secondary">Cerrar sesión</button>
        </div>
      </header>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>🧾 Comercial</h3>
          <p>Acuerdos comerciales, planes de pago, cuotas y pagos.</p>
        </div>
        <div className="dashboard-card">
          <h3>📦 Compras</h3>
          <p>Gestión de insumos y proveedores.</p>
        </div>
        <div className="dashboard-card">
          <h3>💰 Ventas</h3>
          <p>Facturación y cuentas corrientes.</p>
        </div>
        <div className="dashboard-card">
          <h3>📊 Contabilidad</h3>
          <p>Asientos y Libro Diario.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
