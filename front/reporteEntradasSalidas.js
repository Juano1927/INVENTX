// Función para generar el reporte de entradas y salidas
function generarReporteEntradasSalidas() {
    return fetch('http://localhost:3000/reportes/entradas-salidas')
        .then(response => response.json());
}
