document.getElementById('usuarios').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que el formulario se envíe de forma tradicional
  
    const formData = new FormData(this);
  
    fetch(this.action, {
      method: this.method,
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      // Aquí puedes realizar cualquier otra acción después de enviar los datos
    })
    .catch(error => {
      console.error('Error:', error);
    });
  });
  