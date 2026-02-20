// productos.js - manejo de productos
if(!localStorage.getItem('productos')){
  localStorage.setItem('productos', JSON.stringify([
    { nombre:'Vela Pequeña', precio:5000 },
    { nombre:'Vela Mediana', precio:8000 },
    { nombre:'Vela Grande', precio:12000 }
  ]));
}

function obtenerProductos(){
  return JSON.parse(localStorage.getItem('productos')) || [];
}

function agregarProducto(nombre, precio){
  const list = obtenerProductos();
  list.push({ nombre, precio });
  localStorage.setItem('productos', JSON.stringify(list));
}

function editarProducto(index, nombre, precio){
  const list = obtenerProductos();
  list[index] = { nombre, precio };
  localStorage.setItem('productos', JSON.stringify(list));
  if(typeof renderProductos === 'function') renderProductos();
}

function eliminarProducto(index){
  const list = obtenerProductos();
  list.splice(index,1);
  localStorage.setItem('productos', JSON.stringify(list));
  if(typeof renderProductos === 'function') renderProductos();
}
