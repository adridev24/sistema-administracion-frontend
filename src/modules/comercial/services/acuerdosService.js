import apiClient from '../../../shared/api/apiClient';

const acuerdosService = {
  createAcuerdo: (payload) => apiClient.post('/api/acuerdos', payload).then((res) => res.data),
  getAcuerdoDetalle: (id) => apiClient.get(`/api/acuerdos/${id}`).then((res) => res.data),
  getAcuerdosPorCliente: (clienteExternoId) => apiClient.get(`/api/acuerdos/cliente/${clienteExternoId}`).then((res) => res.data),
  getAcuerdosPorObra: (obraExternaId) => apiClient.get(`/api/acuerdos/obra/${obraExternaId}`).then((res) => res.data),
  crearPlanPago: (acuerdoId, payload) => apiClient.post(`/api/acuerdos/${acuerdoId}/plan-pago`, payload).then((res) => res.data),
  getEstadoComercial: (acuerdoId) => apiClient.get(`/api/acuerdos/${acuerdoId}/estado-comercial`).then((res) => res.data),
  getSaldoComercialCliente: (clienteExternoId) => apiClient.get(`/api/clientes/${clienteExternoId}/saldo-comercial`).then((res) => res.data),
  getSaldoComercialObra: (obraExternoId) => apiClient.get(`/api/obras/${obraExternoId}/saldo-comercial`).then((res) => res.data)
};

export default acuerdosService;
