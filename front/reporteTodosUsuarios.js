// Función para generar el reporte de todos los usuarios
function generarReporteTodosUsuarios() {
    return fetch('http://localhost:3000/reportes/todos-usuarios')
        .then(response => response.json());
}
