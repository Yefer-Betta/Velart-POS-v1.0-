// ===============================
//   GUARDAR GASTO EN LOCALSTORAGE
// ===============================
function guardarGasto(descripcion, monto, metodo) {

    const gastos = obtenerGastos();

    gastos.push({
        descripcion: descripcion,
        monto: Number(monto),  // <-- aseguro que sea número
        metodo: metodo,
        fecha: new Date().toISOString()
    });

    localStorage.setItem("gastos", JSON.stringify(gastos));
}

// ===============================
//   OBTENER GASTOS
// ===============================
function obtenerGastos() {
    return JSON.parse(localStorage.getItem("gastos") || "[]");
}
