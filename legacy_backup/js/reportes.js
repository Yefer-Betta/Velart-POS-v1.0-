// reportes.js
function ventasPorProducto(){
  const ventas = JSON.parse(localStorage.getItem('ventas')) || [];
  const resumen = {};
  ventas.forEach(v => { resumen[v.producto] = (resumen[v.producto]||0) + v.total; });
  return resumen;
}

function metodosPagoResumen(){
  const ventas = JSON.parse(localStorage.getItem('ventas')) || [];
  const res = {};
  ventas.forEach(v => res[v.pago] = (res[v.pago]||0) + v.total);
  return res;
}
