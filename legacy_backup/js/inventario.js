// inventario.js
if(!localStorage.getItem('inventario')) localStorage.setItem('inventario', JSON.stringify([]));

function agregarInventario(nombre, cantidad){
  const inv = JSON.parse(localStorage.getItem('inventario')) || [];
  const fecha = new Date().toLocaleString();
  inv.push({ nombre, cantidad, fecha });
  localStorage.setItem('inventario', JSON.stringify(inv));
  if(typeof obtenerInventario === 'function') obtenerInventario();
}

function obtenerInventario(){
  return JSON.parse(localStorage.getItem('inventario')) || [];
}
