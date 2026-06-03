import { useNavigate } from 'react-router-dom';
import logoAlbace from '../assets/logo_albace_completo.png';

const modules = [
  {
    title: 'Comercial',
    description: 'Acuerdos, planes de pago, cuotas y pagos comerciales.',
    status: 'Disponible',
    route: '/comercial',
    metric: '',
  },
  {
    title: 'Compras',
    description: 'Gestión de insumos, proveedores y comprobantes.',
    status: 'Próximo',
    route: null,
    metric: 'Pendiente de definición',
  },
  {
    title: 'Ventas',
    description: 'Facturación, cobranzas y cuentas corrientes.',
    status: 'Próximo',
    route: null,
    metric: 'Pendiente de definición',
  },
  {
    title: 'Contabilidad',
    description: 'Asientos, libro diario y reportes contables.',
    status: 'Próximo',
    route: null,
    metric: 'Pendiente de definición',
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page">
      <header className="dashboard-topbar">
        <img src={logoAlbace} alt="Metalúrgica Albace" className="dashboard-logo" />
        <div className="dashboard-actions">
          <button onClick={() => window.location.reload()} className="dashboard-button-secondary">Cerrar sesión</button>
        </div>
      </header>

      <section className="dashboard-hero">
        <div className="dashboard-hero-copy">
          <span className="eyebrow">Sistema administrativo</span>
          <h1>Panel de control operativo</h1>
        </div>
      </section>

      <section className="dashboard-section-heading">
        <div>
          <span className="eyebrow">Módulos</span>
          <h2>Accesos principales</h2>
        </div>
      </section>

      <div className="dashboard-cards">
        {modules.map((module) => (
          <button
            key={module.title}
            className={`dashboard-card ${module.route ? 'is-active' : 'is-disabled'}`}
            onClick={() => module.route && navigate(module.route)}
            type="button"
            disabled={!module.route}
          >
            <div className="dashboard-card-header">
              <span className="module-mark">{module.title.slice(0, 2).toUpperCase()}</span>
              <span className="module-status">{module.status}</span>
            </div>
            <h3>{module.title}</h3>
            <p>{module.description}</p>
            <small>{module.metric}</small>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
