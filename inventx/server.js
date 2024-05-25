const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Configura la conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'test'
});

// Conéctate a la base de datos
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Conectado a la base de datos inventx MySQL');
});

// Middleware para parsear el cuerpo de la solicitud como JSON
app.use(bodyParser.json());

// Ruta para manejar el envío de datos del formulario
app.post('/enviar-datos', (req, res) => {
  const { nombre, email } = req.body;

  // Inserta los datos en la tabla usuarios
  const sql = 'INSERT INTO `test`.`usuarios` (`nombre`, `email`) VALUES (?, ?)';
  db.query(sql, [nombre, email], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error al insertar los datos en la base de datos' });
      throw err;
    }
    res.status(200).json({ message: 'Datos insertados correctamente' });
  });
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
