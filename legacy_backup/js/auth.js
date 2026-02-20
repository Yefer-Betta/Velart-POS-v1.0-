// auth.js
// Gestión de usuarios, sesiones y protección de páginas.
// =========================
// NOTAS:
// - Mantiene usuarios en localStorage bajo la clave "usuarios".
// - Guarda la sesión actual en localStorage bajo la clave "sesion".
// - ProtegerPagina() redirige a login si no hay sesión.
// - Todas las funciones están comentadas para que las entiendas.

if (!localStorage.getItem('usuarios')) {
  // Usuarios por defecto: admin y empleado
  const defaultUsers = [
    { id: generateId('usr'), nombre: 'Administrador', usuario: 'admin', pass: '1234', rol: 'admin', activo: true },
    { id: generateId('usr'), nombre: 'Empleado', usuario: 'empleado', pass: '0000', rol: 'empleado', activo: true }
  ];
  localStorage.setItem('usuarios', JSON.stringify(defaultUsers));
}

/* ---------- UTIL ---------- */
// Generador simple de ids únicas
function generateId(prefix = '') {
  return prefix + Date.now().toString(36) + Math.random().toString(36).substring(2,8);
}

/* ---------- AUTENTICACIÓN ---------- */
// Intenta loguear; si ok guarda sesión y devuelve true
function login(usuario, pass) {
  const users = JSON.parse(localStorage.getItem('usuarios') || '[]');
  const found = users.find(u => u.usuario === usuario && u.pass === pass && u.activo !== false);
  if (found) {
    // Guardamos solo los datos necesarios en sesión (sin pass)
    const { id, nombre, usuario: uName, rol } = found;
    localStorage.setItem('sesion', JSON.stringify({ id, nombre, usuario: uName, rol }));
    return true;
  }
  return false;
}

// Cerrar sesión y volver al inicio
function cerrarSesion() {
  localStorage.removeItem('sesion');
  window.location.href = 'login.html';
}

// Devuelve usuario actual (obj) o null
function usuarioActual() {
  return JSON.parse(localStorage.getItem('sesion') || 'null');
}

// Protección básica para páginas internas
function protegerPagina() {
  if (!localStorage.getItem('sesion')) {
    // si no hay sesión, redirigir a login
    window.location.href = 'login.html';
  }
}

/* ---------- ADMIN USUARIOS ---------- */
// Crea un nuevo usuario y guarda en localStorage
function crearUsuario(nombre, usuario, pass, rol = 'empleado') {
  const list = JSON.parse(localStorage.getItem('usuarios') || '[]');
  const newUser = { id: generateId('usr'), nombre, usuario, pass, rol, activo: true };
  list.push(newUser);
  localStorage.setItem('usuarios', JSON.stringify(list));
  if (typeof renderUsuarios === 'function') renderUsuarios();
  return newUser;
}

// Elimina usuario por id
function eliminarUsuario(id) {
  let list = JSON.parse(localStorage.getItem('usuarios') || '[]');
  list = list.filter(u => u.id !== id);
  localStorage.setItem('usuarios', JSON.stringify(list));
  if (typeof renderUsuarios === 'function') renderUsuarios();
}

// Edita usuario (sin cambiar contraseña a menos que pases pass)
function editarUsuario(id, campos) {
  const list = JSON.parse(localStorage.getItem('usuarios') || '[]');
  const idx = list.findIndex(u => u.id === id);
  if (idx === -1) return false;
  list[idx] = { ...list[idx], ...campos };
  localStorage.setItem('usuarios', JSON.stringify(list));
  if (typeof renderUsuarios === 'function') renderUsuarios();
  return true;
}
