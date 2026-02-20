// app.js
// Archivo unificado para: ventas, gastos, productos, inventario, cierres, reportes, utilidades.
// Contiene: modelos finales, funciones CRUD, filtros por fecha, exportar Excel, helpers para dashboard y reportes.
// =========================
// MODELOS (ejemplos / campos):
// Venta:
// {
//   id: 'v_..', producto, cantidad, precio, pago, total, fecha(ISO), usuario, cliente, observaciones, impuesto, descuento, costoProducto, utilidadFinal, categoria, ubicacion
// }
// Gasto:
// { id:'g_..', descripcion, monto, metodo, fecha, categoria, proveedor, usuario, comprobante, observaciones }
// Inventario:
// { id:'i_..', nombre, categoria, cantidad, precioCompra, precioVenta, proveedor, unidadMedida, alertaStock, fechaIngreso, notas }
// Producto:
// { id:'p_..', nombre, precioVenta, precioCompra, categoria, sku, unidad }

// Nota: todas las fechas se guardan con formato ISO (new Date().toISOString())
// Esto facilita filtros por fecha.

/* ---------- HELPERS ---------- */
function genId(prefix='') {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2,8);
}

// Leer/Escribir genérico en localStorage
function readStore(key) {
  return JSON.parse(localStorage.getItem(key) || '[]');
}
function writeStore(key, arr) {
  localStorage.setItem(key, JSON.stringify(arr));
}

/* =========================
   VENTAS
   ========================= */

// Inicializa array de ventas si no existe
if (!localStorage.getItem('ventas')) writeStore('ventas', []);

// Crear/guardar venta con todos los campos
function crearVenta({
  producto,
  cantidad,
  precio,
  pago = 'Efectivo',
  usuario = (usuarioActual() && usuarioActual().usuario) || 'anonimo',
  cliente = '',
  observaciones = '',
  impuesto = 0,
  descuento = 0,
  costoProducto = 0,
  categoria = '',
  ubicacion = ''
}) {
  const ventas = readStore('ventas');
  const totalBruto = Number(cantidad) * Number(precio);
  // aplicar descuento e impuesto
  const totalAfterDiscount = totalBruto - Number(descuento || 0);
  const impuestoValue = (Number(impuesto || 0) / 100) * totalAfterDiscount;
  const total = Math.round((totalAfterDiscount + impuestoValue) * 100) / 100;
  const utilidadFinal = Math.round((total - Number(costoProducto || 0)) * 100) / 100;

  const venta = {
    id: genId('v_'),
    producto,
    cantidad: Number(cantidad),
    precio: Number(precio),
    pago,
    total,
    fecha: new Date().toISOString(),
    usuario,
    cliente,
    observaciones,
    impuesto: Number(impuesto || 0),
    descuento: Number(descuento || 0),
    costoProducto: Number(costoProducto || 0),
    utilidadFinal,
    categoria,
    ubicacion
  };

  ventas.push(venta);
  writeStore('ventas', ventas);

  // Si existe función para recargar UI, la llamamos
  if (typeof cargarVentas === 'function') cargarVentas();
  if (typeof actualizarDashboard === 'function') actualizarDashboard();
  return venta;
}

// Obtener ventas (posible paginación futura)
function obtenerVentas() {
  return readStore('ventas');
}

// Obtener venta por id
function obtenerVentaPorId(id) {
  return obtenerVentas().find(v => v.id === id);
}

// Eliminar venta por id
function eliminarVenta(id) {
  const ventas = obtenerVentas().filter(v => v.id !== id);
  writeStore('ventas', ventas);
  if (typeof cargarVentas === 'function') cargarVentas();
  if (typeof actualizarDashboard === 'function') actualizarDashboard();
}

/* =========================
   GASTOS
   ========================= */

if (!localStorage.getItem('gastos')) writeStore('gastos', []);

function crearGasto({
  descripcion,
  monto,
  metodo = 'Efectivo',
  categoria = '',
  proveedor = '',
  usuario = (usuarioActual() && usuarioActual().usuario) || 'anonimo',
  comprobante = '',
  observaciones = ''
}) {
  const gastos = readStore('gastos');
  const gasto = {
    id: genId('g_'),
    descripcion,
    monto: Number(monto),
    metodo,
    fecha: new Date().toISOString(),
    categoria,
    proveedor,
    usuario,
    comprobante,
    observaciones
  };
  gastos.push(gasto);
  writeStore('gastos', gastos);
  if (typeof cargarGastos === 'function') cargarGastos();
  if (typeof actualizarDashboard === 'function') actualizarDashboard();
  return gasto;
}

function obtenerGastos() {
  return readStore('gastos');
}

function eliminarGasto(id) {
  const nuevos = obtenerGastos().filter(g => g.id !== id);
  writeStore('gastos', nuevos);
  if (typeof cargarGastos === 'function') cargarGastos();
  if (typeof actualizarDashboard === 'function') actualizarDashboard();
}

/* =========================
   PRODUCTOS
   ========================= */
if (!localStorage.getItem('productos')) {
  // valores de ejemplo
  const sample = [
    { id: genId('p_'), nombre: 'Vela Pequeña', precioVenta: 5000, precioCompra: 2500, categoria: 'Velas', sku: 'VEL-P', unidad: 'unidad' },
    { id: genId('p_'), nombre: 'Vela Mediana', precioVenta: 8000, precioCompra: 4000, categoria: 'Velas', sku: 'VEL-M', unidad: 'unidad' },
    { id: genId('p_'), nombre: 'Vela Grande', precioVenta: 12000, precioCompra: 7000, categoria: 'Velas', sku: 'VEL-G', unidad: 'unidad' }
  ];
  writeStore('productos', sample);
}

function obtenerProductos() {
  return readStore('productos');
}

function crearProducto({ nombre, precioVenta, precioCompra = 0, categoria = '', sku = '', unidad = 'unidad' }) {
  const list = obtenerProductos();
  const p = { id: genId('p_'), nombre, precioVenta: Number(precioVenta), precioCompra: Number(precioCompra), categoria, sku, unidad };
  list.push(p);
  writeStore('productos', list);
  if (typeof renderProductos === 'function') renderProductos();
  return p;
}

function editarProducto(id, campos) {
  const list = obtenerProductos();
  const idx = list.findIndex(x => x.id === id);
  if (idx === -1) return false;
  list[idx] = { ...list[idx], ...campos };
  writeStore('productos', list);
  if (typeof renderProductos === 'function') renderProductos();
  return true;
}

function eliminarProductoPorId(id) {
  const list = obtenerProductos().filter(p => p.id !== id);
  writeStore('productos', list);
  if (typeof renderProductos === 'function') renderProductos();
}

/* =========================
   INVENTARIO
   ========================= */
if (!localStorage.getItem('inventario')) writeStore('inventario', []);

function agregarInventario({ nombre, cantidad, precioCompra = 0, proveedor = '', unidadMedida = 'unidad', notas = '', categoria = '' }) {
  const inv = readStore('inventario');
  const item = {
    id: genId('i_'),
    nombre,
    categoria,
    cantidad: Number(cantidad),
    precioCompra: Number(precioCompra),
    precioVenta: obtenerProductos().find(p => p.nombre === nombre)?.precioVenta || 0,
    proveedor,
    unidadMedida,
    alertaStock: false,
    fechaIngreso: new Date().toISOString(),
    notas
  };
  inv.push(item);
  writeStore('inventario', inv);
  if (typeof obtenerInventario === 'function') obtenerInventario();
  return item;
}

function obtenerInventario() {
  return readStore('inventario');
}

/* =========================
   CIERRE DE CAJA
   ========================= */
if (!localStorage.getItem('cierres')) writeStore('cierres', []);

function generarCierre() {
  const ventas = obtenerVentas();
  const gastos = obtenerGastos();
  const totalV = ventas.reduce((acc, v) => acc + (v.total || 0), 0);
  const totalG = gastos.reduce((acc, g) => acc + (g.monto || 0), 0);
  const balance = totalV - totalG;
  const fecha = new Date().toISOString();
  const hist = readStore('cierres');
  const obj = { id: genId('c_'), fecha, ventas: totalV, gastos: totalG, balance, quien: usuarioActual()?.usuario || 'anonimo' };
  hist.push(obj);
  writeStore('cierres', hist);
  return obj;
}

function obtenerCierres() {
  return readStore('cierres');
}

/* =========================
   REPORTES Y UTILS (filtro por fecha)
   ========================= */

// Filtro por rango: 'hoy' | 'semana' | 'mes' | 'todo'
function filtrarPorFecha(lista, rango = 'todo') {
  const hoy = new Date();
  if (!Array.isArray(lista)) return [];

  return lista.filter(item => {
    if (!item.fecha) return false;
    const fecha = new Date(item.fecha);
    if (rango === 'todo') return true;
    if (rango === 'hoy') return fecha.toDateString() === hoy.toDateString();
    if (rango === 'semana') {
      const inicio = new Date(hoy);
      inicio.setDate(hoy.getDate() - hoy.getDay());
      return fecha >= inicio && fecha <= hoy;
    }
    if (rango === 'mes') {
      return fecha.getMonth() === hoy.getMonth() && fecha.getFullYear() === hoy.getFullYear();
    }
    return true;
  });
}

// Ventas por producto (agrupar)
function ventasPorProducto(rango = 'todo') {
  const ventas = filtrarPorFecha(obtenerVentas(), rango);
  const resumen = {};
  ventas.forEach(v => {
    const key = v.producto || 'Sin nombre';
    resumen[key] = (resumen[key] || 0) + (v.total || 0);
  });
  return resumen;
}

// Métodos de pago resumen
function metodosPagoResumen(rango = 'todo') {
  const ventas = filtrarPorFecha(obtenerVentas(), rango);
  const resumen = {};
  ventas.forEach(v => {
    const key = v.pago || 'Otro';
    resumen[key] = (resumen[key] || 0) + (v.total || 0);
  });
  return resumen;
}

// Ventas por fecha (día) -> devuelve objeto { '2025-01-01': total, ... }
function ventasPorFecha(rango = 'todo') {
  const ventas = filtrarPorFecha(obtenerVentas(), rango);
  const res = {};
  ventas.forEach(v => {
    const fechaKey = (v.fecha || '').substring(0,10); // yyyy-mm-dd
    res[fechaKey] = (res[fechaKey] || 0) + (v.total || 0);
  });
  return res;
}

// Ganancias por fecha (ventas - gastos)
function gananciasPorFecha(rango = 'todo') {
  const ventas = ventasPorFecha(rango);
  const gastos = (function() {
    const g = filtrarPorFecha(obtenerGastos(), rango);
    const out = {};
    g.forEach(x => {
      const k = (x.fecha || '').substring(0,10);
      out[k] = (out[k] || 0) + (x.monto || 0);
    });
    return out;
  })();

  const keys = Array.from(new Set([...Object.keys(ventas), ...Object.keys(gastos)])).sort();
  const res = {};
  keys.forEach(k => res[k] = (ventas[k] || 0) - (gastos[k] || 0));
  return res;
}

/* =========================
   EXPORTAR A EXCEL (SheetJS)
   ========================= */
function exportarExcel(ventas = [], gastos = []) {
  // Este código asume que ya cargaste xlsx.full.min.js en el HTML
  const wb = XLSX.utils.book_new();
  const ws1 = XLSX.utils.json_to_sheet(ventas);
  const ws2 = XLSX.utils.json_to_sheet(gastos);
  XLSX.utils.book_append_sheet(wb, ws1, 'Ventas');
  XLSX.utils.book_append_sheet(wb, ws2, 'Gastos');
  XLSX.writeFile(wb, 'Reporte_Velart.xlsx');
}

/* =========================
   FUNCIONES DE RESUMEN UTIL PARA DASHBOARD
   ========================= */
function totalVentas(rango = 'todo') {
  return filtrarPorFecha(obtenerVentas(), rango).reduce((acc, v) => acc + (v.total || 0), 0);
}
function totalGastos(rango = 'todo') {
  return filtrarPorFecha(obtenerGastos(), rango).reduce((acc, g) => acc + (g.monto || 0), 0);
}

/* =========================
   INICIALIZADOR (opcional) para llamar cuando la página cargue
   - Las páginas deben llamar a las funciones UI correspondientes:
     cargarVentas(), cargarGastos(), actualizarDashboard(), cargarReportes()...
   ========================= */

