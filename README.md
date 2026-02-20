# 🕯️ Velart POS — Sistema de Punto de Venta

> **Sistema de gestión comercial en la nube para negocios de velas artesanales y retail.**  
> Desarrollado con React + Firebase · Modo oscuro · Responsive (móvil/PC)

---

## ¿Qué es Velart POS?

**Velart POS** es un sistema de Punto de Venta (POS) web diseñado para pequeños y medianos negocios que necesitan controlar sus ventas, inventario, gastos y reportes desde **cualquier dispositivo con un navegador**, sin instalar software adicional.

Está optimizado para **negocios de velas artesanales**, pero puede adaptarse a cualquier negocio de retail o servicios que venda productos físicos.

---

## 🧩 Módulos del Sistema

| Módulo | Descripción |
|---|---|
| 📊 **Dashboard** | Resumen en tiempo real: ventas del día, gastos, balance, producto estrella |
| 🛒 **Ventas (POS)** | Punto de venta con carrito, búsqueda rápida, atajos de teclado |
| 📦 **Productos** | Catálogo con precios, categorías y control de stock |
| 🗃️ **Inventario** | Vista de stock con alertas de bajo inventario y edición rápida |
| 💸 **Gastos** | Registro de gastos operativos con categorías |
| 🔒 **Cierres** | Cierre de caja diario con resumen de ventas y efectivo esperado |
| 📋 **Reportes** | Historial de transacciones y estadísticas |
| 👥 **Usuarios** | Gestión de empleados con roles (Admin, Vendedor, Bodeguero) |
| ⚙️ **Configuración** | Datos de empresa, NIT, moneda, preferencias |

---

## ✅ Problemas que resuelve

- ❌ **Sin sistema = desorden** → Llevar ventas en papel o Excel es lento, impreciso y difícil de analizar.
- ❌ **Sin control de inventario** → El dueño no sabe cuántas unidades quedan hasta que se agotan.
- ❌ **Sin control de gastos** → Imposible saber si el negocio es rentable sin ver gastos vs. ingresos juntos.
- ❌ **Sin cierre de caja** → El cajero no puede cuadrar el dinero al final del día fácilmente.
- ❌ **Sin acceso desde el celular** → Los sistemas de escritorio no funcionan en el mostrador.

**Velart POS resuelve todo esto en una sola aplicación web, accesible desde PC, tablet o celular.**

---

## 🛠️ Tecnologías usadas

| Tecnología | Rol |
|---|---|
| **React 18** + Vite | Frontend SPA de alta velocidad |
| **Firebase Auth** | Autenticación segura de usuarios |
| **Firestore** | Base de datos en tiempo real en la nube |
| **Tailwind CSS v4** | Diseño responsive con modo oscuro |
| **Framer Motion** | Animaciones de UI |
| **React Router v6** | Navegación client-side |

---

## 🚀 Instalación

### Requisitos
- [Node.js](https://nodejs.org) v18 o superior

### Primera vez
```bash
git clone https://github.com/TU_USUARIO/velart-pos.git
cd velart-pos
npm install
npm run dev
```

**O en Windows:** doble clic en `INSTALAR.bat`

### Credenciales por defecto
```
Usuario:    admin
Contraseña: 1234
```

---

## 🔐 Seguridad (Firebase)

1. Activa **Email/Password** en Firebase Console → Authentication → Sign-in methods
2. Publica las reglas desde `firestore.rules` en Firestore → Reglas

---

## 🗺️ Roadmap — Funciones Futuras

### v1.1 — Corto plazo
- [ ] Exportar reportes a Excel (`.xlsx`)
- [ ] Filtros por fecha en ventas y gastos
- [ ] Recibo/ticket imprimible por venta
- [ ] Búsqueda de ventas por producto o cajero

### v1.2 — Mediano plazo
- [ ] **Múltiples sucursales** — mismo sistema para varias tiendas
- [ ] **Descuentos y cupones** — porcentaje o monto fijo
- [ ] **Notificaciones de stock bajo** — alerta por correo
- [ ] **Gráficas de ventas** por semana/mes en el Dashboard

### v2.0 — Largo plazo
- [ ] **App móvil nativa** (PWA o React Native)
- [ ] **Facturación electrónica** (DIAN para Colombia)
- [ ] **Integración con Nequi/Bancolombia**
- [ ] **Fidelización de clientes** — historial por cliente
- [ ] **IA de predicción de ventas**

---

## 👤 Autor

**Velart** — Negocio de velas artesanales  
Sistema desarrollado con ❤️ para digitalizar el negocio.

---

## 📄 Licencia

Privado — Todos los derechos reservados © 2025 Velart
