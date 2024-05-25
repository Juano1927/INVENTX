document.getElementById('reporteForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtener los valores del formulario
    const fecha_inicio = document.getElementById('fecha_inicio').value;
    const fecha_fin = document.getElementById('fecha_fin').value;
    const tipo_movimiento = document.getElementById('tipo_movimiento').value;

    // Llamar a la función para generar el reporte de movimientos
    generarReporteMovimientos(fecha_inicio, fecha_fin, tipo_movimiento)
        .then(data => {
            // Mostrar los resultados en la tabla
            mostrarResultadosMovimientos(data);
        })
        .catch(error => {
            console.error('Error al generar el reporte de movimientos:', error);
        });
});

// Función para mostrar los resultados del reporte de movimientos en la tabla
function mostrarResultadosMovimientos(data) {
    const tbody = document.getElementById('resultados').getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';
    data.forEach(movimiento => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${movimiento.id_movimiento}</td>
            <td>${movimiento.id_producto}</td>
            <td>${movimiento.cedula_usuario}</td>
            <td>${movimiento.tipo_movimiento}</td>
            <td>${movimiento.cantidad}</td>
            <td>${movimiento.fecha}</td>
        `;
        tbody.appendChild(row);
    });
}
