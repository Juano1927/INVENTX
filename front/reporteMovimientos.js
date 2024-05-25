// Función para generar el reporte de movimientos
function generarReporteMovimientos(fecha_inicio, fecha_fin, tipo_movimiento) {
    return fetch(`http://localhost:3000/reportes?fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}&tipo_movimiento=${tipo_movimiento}`)
        .then(response => response.json());
}
