// Función para generar el reporte de productos con poco stock
function generarReporteProductosPocoStock() {
    return fetch('http://localhost:3000/reportes/poco-stock')
        .then(response => response.json());
}
