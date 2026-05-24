import React from 'react';

const Dashboard = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ borderBottom: '2px solid #EC6624', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ color: '#4B4C4E' }}>METALÚRGICA ALBACE - Panel de Control</h1>
        <button onClick={() => window.location.reload()}>Cerrar Sesión</button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <div style={cardStyle}>
          <h3>🧾 Presupuestos</h3>
          <p>Administración de presupuestos y planes de pago.</p>
        </div>
        <div style={cardStyle}>
          <h3>📦 Compras</h3>
          <p>Gestión de insumos y proveedores.</p>
        </div>
        <div style={cardStyle}>
          <h3>💰 Ventas</h3>
          <p>Facturación y cuentas corrientes.</p>
        </div>
        <div style={cardStyle}>
          <h3>📊 Contabilidad</h3>
          <p>Asientos y Libro Diario.</p>
        </div>
      </div>
    </div>
  );
};

const cardStyle = {
  border: '1px solid #ddd',
  padding: '15px',
  borderRadius: '8px',
  textAlign: 'center',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

export default Dashboard;