function ejecutarConsulta() {
    // Enviar la solicitud al servidor
    fetch('http://localhost:3000/guardar-datos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tabla: 'productos', cantidadMaxima: 5 }) // Enviamos el nombre de la tabla y la cantidad máxima como parámetros
    })
    .then(response => response.json())
    .then(data => {
      // Manejar la respuesta del servidor
      mostrarResultado(data);
    })
    .catch(error => console.error('Error:', error));
  }
  
  function mostrarResultado(resultado) {
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = ''; // Limpiar resultados anteriores
  
    if (resultado && resultado.length > 0) {
      // Construir tabla de resultados
      const table = document.createElement('productos');
      const headerRow = table.insertRow(0);
  
      // Definir los nombres de los campos de la tabla de productos
      const campos = ['id_producto', 'nombre_producto', 'cantidad'];
  
      // Crear celdas de encabezado con los nombres de los campos
      campos.forEach(fieldName => {
        const headerCell = document.createElement('th');
        headerCell.textContent = fieldName;
        headerRow.appendChild(headerCell);
      });
  
      // Llenar la tabla con los datos de los productos
      resultado.forEach(rowData => {
        const row = table.insertRow();
        campos.forEach(fieldName => {
          const cell = row.insertCell();
          cell.textContent = rowData[fieldName];
        });
      });
      resultadoDiv.appendChild(table);
    } else {
      resultadoDiv.textContent = 'No se encontraron productos con existencia menor o igual a 5';
    }
  }
  