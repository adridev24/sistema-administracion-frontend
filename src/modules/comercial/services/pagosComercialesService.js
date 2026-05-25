import apiClient from '../../../shared/api/apiClient';

const pagosComercialesService = {
  registrarPago: (payload) => apiClient.post('/api/pagos-comerciales', payload).then((res) => res.data),
  aplicarPago: (pagoId, payload) => apiClient.post(`/api/pagos-comerciales/${pagoId}/aplicar`, payload).then((res) => res.data),
  getAplicacionesPorCuota: (cuotaId) => apiClient.get(`/api/pagos-comerciales/cuota/${cuotaId}/aplicaciones`).then((res) => res.data)
};

export default pagosComercialesService;
