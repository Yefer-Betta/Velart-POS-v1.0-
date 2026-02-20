// cierre.js
if(!localStorage.getItem('cierres')) localStorage.setItem('cierres', JSON.stringify([]));

function generarCierre(){
  const ventas = JSON.parse(localStorage.getItem('ventas')) || [];
  const gastos = JSON.parse(localStorage.getItem('gastos')) || [];
  const totalV = ventas.reduce((a,v)=>a+v.total,0);
  const totalG = gastos.reduce((a,g)=>a+g.monto,0);
  const balance = totalV - totalG;
  const fecha = new Date().toLocaleString();
  const hist = JSON.parse(localStorage.getItem('cierres')) || [];
  const obj = { fecha, ventas: totalV, gastos: totalG, balance };
  hist.push(obj);
  localStorage.setItem('cierres', JSON.stringify(hist));
  return obj;
}

function obtenerCierres(){
  return JSON.parse(localStorage.getItem('cierres')) || [];
}
