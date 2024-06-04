document.getElementById('Registro_Usuario').addEventListener('submit', function(event) {
    event.preventDefault()
    
    var cedula = document.getElementById('cedula').value;
    var nombre = document.getElementById('nombre').value;
    var nombre_usuario = document.getElementById('nombre_usuario').value;
    var contrasena = document.getElementById('contrasena').value;
    var telefono_movil = document.getElementById('telefono_movil').value;
    var rol = document.getElementById('rol').value;
    var datos = {
        cedula:cedula,
        nombre: nombre,
        nombre_usuario: nombre_usuario,
        contrasena: contrasena,
        telefono_movil: telefono_movil,
        rol:rol,
       }

    fetch('http://localhost:3000/guardar-datos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
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
