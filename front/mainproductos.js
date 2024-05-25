document.getElementById('productos').addEventListener('submit', function(event) {
    event.preventDefault()
    var id_producto = document.getElementById('id_producto').value;
    var nombre_producto = document.getElementById('nombre_p').value;
    var cantidad = document.getElementById('cantidad').value;
    var precio = document.getElementById('precio').value;
    
    var datos_producto= {
        id_producto:id_producto,
        nombre_producto:nombre_producto,
        cantidad:cantidad,
        precio:precio,
       }

    fetch('http://localhost:3000/guardar-datos-producto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos_producto)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        return response.json();
    })
    .then(data => {
        console.log('Respuesta del servidor:', data);
    })
    .catch(error => {
        console.error('Error:', error)
    });
});
