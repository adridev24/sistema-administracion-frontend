import React from 'react';

const EstadoComercialResumen = ({ estado }) => {
  if (!estado) {
    return null;
  }

  const cards = [
    { label: 'Total comprometido', value: estado.totalPrometido, tone: 'primary' },
    { label: 'Total pagado', value: estado.totalPagado, tone: 'success' },
    { label: 'Saldo pendiente', value: estado.saldoRestante, tone: 'warning' }
  ];

  return (
    <div className="summary-grid">
      {cards.map((card) => (
        <div key={card.label} className={`summary-card ${card.tone}`}>
          <span>{card.label}</span>
          <strong>${card.value.toLocaleString()}</strong>
        </div>
      ))}
    </div>
  );
};

export default EstadoComercialResumen;
