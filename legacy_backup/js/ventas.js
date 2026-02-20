// ventas.js
if(!localStorage.getItem('ventas')) localStorage.setItem('ventas', JSON.stringify([]));

function guardarVenta(producto, cantidad, precio, pago){
  const list = JSON.parse(localStorage.getItem('ventas')) || [];
  const total = cantidad * precio;
  const fecha = new Date().toLocaleString();
  list.push({ producto, cantidad, precio, pago, total, fecha });
  localStorage.setItem('ventas', JSON.stringify(list));
  if(typeof cargarVentas==='function') cargarVentas();
}

function cargarVentas(){
  const list = JSON.parse(localStorage.getItem('ventas')) || [];
  if(!document.getElementById('tablaVentas')) return;
  const tbody = document.getElementById('tablaVentas');
  tbody.innerHTML = '';
  list.forEach(v=>{
    tbody.innerHTML += `<tr>
      <td>${v.producto}</td><td>${v.cantidad}</td><td>$${v.precio.toLocaleString()}</td><td>$${v.total.toLocaleString()}</td><td>${v.pago}</td><td>${v.fecha}</td>
    </tr>`;
  });
}

function totalVentas(){
  const list = JSON.parse(localStorage.getItem('ventas')) || [];
  return list.reduce((acc,v)=>acc+v.total,0);
}
