
// Importa Express
const express = require('express');

// Crea una instancia de Express
const app = express();
const port = 3000; // Puerto en el que escuchará el servidor

// Define una ruta básica
app.get('file//C:/Users/DAVID/Documents/test/inventx', (req, res) => {
  res.send('¡Hola, mundo!');
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});


















/*const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'test'
});

// Conexión a la base de datos
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Conectado a la base de datos MySQL');
});

// Middleware para procesar los datos del formulario
app.use(express.urlencoded({ extended: true }));

// Ruta para manejar el envío de datos del formulario
app.post('/enviar-datos', (req, res) => {
  const { cedula, nombre } = req.body;

  // Insertar los datos en la tabla usuarios
  const sql = 'INSERT INTO usuarios (cedula, nombre) VALUES (?, ?)';
  db.query(sql, [ceula, nombre], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error al insertar los datos en la base de datos' });
      throw err;
    }
    res.status(200).json({ message: 'Datos insertados correctamente' });
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
*/