const express = require('express');
const mysql = require("mysql");
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

let conexion = mysql.createConnection({
    host: "localhost",
    database: "modelo",
    user: "root",
    password: ""
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Obtener lista de productos

app.get('/productos', function (req, res) {
    let consultar = 'SELECT id_producto, nombre_producto FROM productos';
    conexion.query(consultar, function (error, results) {
        if (error) {
            throw error;
        }
        res.json(results);
    });
});

// Obtener lista de usuarios
app.get('/usuarios', function (req, res) {
    let consultar = 'SELECT cedula, nombre FROM usuarios';
    conexion.query(consultar, function (error, results) {
        if (error) {
            throw error;
        }
        res.json(results);
    });
});

// ruta para guardar datos de usuario
app.post('/guardar-datos-usuario', function (req, res) {
    const datos = req.body;
    const cedula = datos.cedula;
    const nombre = datos.nombre;
    const nombre_usuario = datos.nombre_usuario;
    const contrasena = datos.contrasena;
    const telefono_movil = datos.telefono_movil;

    console.log(datos);
    let insertar = `INSERT INTO usuarios (cedula, nombre, nombre_usuario, contrasena, telefono_movil) VALUES ('${cedula}', '${nombre}', '${nombre_usuario}', '${contrasena}', '${telefono_movil}');`;

    conexion.query(insertar, function (error) {
        if (error) {
            throw error;
        } else {
            console.log("Datos de usuario almacenados correctamente");
        }
    });
    res.json({ mensaje: 'Datos de usuario recibidos correctamente' });
});

// ruta para guardar datos de producto
app.post('/guardar-datos-producto', function (req, res) {
    const { id_producto, nombre_producto, cantidad, precio } = req.body;

    console.log(req.body);
    let insertar = `INSERT INTO productos (id_producto, nombre_producto, cantidad, precio) VALUES ('${id_producto}', '${nombre_producto}', '${cantidad}', '${precio}');`;

    conexion.query(insertar, function (error) {
        if (error) {
            throw error;
        } else {
            console.log("Datos de producto almacenados correctamente");
            res.json({ mensaje: 'Datos de producto recibidos correctamente' });
        }
    });
});
// validacion del usuario nombre de usuario vs base de datos
app.post('/login', function (req, res) {
    const datos = req.body;
    const nombre_usuario = datos.nombre_usuario;
    const contrasena = datos.contrasena;

    let consultar = `SELECT * FROM usuarios WHERE nombre_usuario = '${nombre_usuario}' AND contrasena = '${contrasena}';`;

    conexion.query(consultar, function (error, results) {
        if (error) {
            throw error;
        }

        if (results.length > 0) {
            res.json({ valido: true });
        } else {
            res.json({ valido: false });
        }
    });
});
// ruta para guardar datos movimiento
app.post('/guardar-datos-movimiento', function (req, res) {
    const datos = req.body;
    const id_producto = datos.id_producto;
    const usuario = datos.cedula_usuario;
    const tipo_movimiento = datos.tipo; 
    const cantidad = datos.cantidad;
    const fecha = datos.fecha;

    console.log(datos);
    let insertar = `INSERT INTO movimientos1 (id_producto, cedula_usuario, tipo_movimiento, cantidad, fecha) VALUES ('${id_producto}', '${usuario}', '${tipo_movimiento}', '${cantidad}', '${fecha}');`;

    conexion.query(insertar, function (error) {
        if (error) {
            throw error;
        } else {
            console.log("Datos de movimiento almacenados correctamente");
            res.json({ mensaje: 'Datos de movimiento almacenados correctamente' });
        }
    });
});

//ruta para query de movimientos 

// Nueva ruta para obtener movimientos por rango de fechas
app.get('/reportes', function (req, res) {
    const { fechaInicio, fechaFin } = req.query;
    if (!fechaInicio || !fechaFin) {
        return res.status(400).send('Debe proporcionar un rango de fechas.');
    }

    let consultar = `
        SELECT id_producto, cedula_usuario, tipo_movimiento, cantidad, fecha 
        FROM movimientos1 
        WHERE fecha BETWEEN ? AND ?;
    `;

    conexion.query(consultar, [fechaInicio, fechaFin], function (error, results) {
        if (error) {
            return res.status(500).send(error.message);
        }
        res.json(results);
    });
});

// Ruta para obtener todos los usuarios
app.get('/reporte-usuarios', function (req, res) {
    let consultar = 'SELECT cedula, nombre, nombre_usuario, telefono_movil FROM usuarios';
    conexion.query(consultar, function (error, results) {
        if (error) {
            return res.status(500).send(error.message);
        }
        res.json(results);
    });
});


// Ruta para obtener todos los productos
app.get('/todos-productos', function (req, res) {
    let consultar = 'SELECT id_producto, nombre_producto, cantidad, precio FROM productos';
    conexion.query(consultar, function (error, results) {
        if (error) {
            console.error('Error obteniendo productos:', error);
            return res.status(500).send('Error obteniendo productos');
        }
        res.json(results);
    });
});

// Ruta para obtener los movimientos de salida
app.get('/query-salida', function (req, res) {
    let consultar = `
        SELECT m.id_producto, p.nombre_producto, m.cedula_usuario, u.nombre AS nombre_usuario, m.tipo_movimiento, m.cantidad, m.fecha
        FROM movimientos1 m
        INNER JOIN productos p ON m.id_producto = p.id_producto
        INNER JOIN usuarios u ON m.cedula_usuario = u.cedula
        WHERE m.tipo_movimiento = 'salida';
    `;

    conexion.query(consultar, function (error, results) {
        if (error) {
            console.error('Error obteniendo movimientos de salida:', error);
            return res.status(500).send('Error obteniendo movimientos de salida');
        }
        res.json(results);
    });
});

// Ruta para obtener los movimientos de entrada
app.get('/query-entrada', function (req, res) {
    let consultar = `
        SELECT m.id_producto, p.nombre_producto, m.cedula_usuario, u.nombre AS nombre_usuario, m.tipo_movimiento, m.cantidad, m.fecha
        FROM movimientos1 m
        INNER JOIN productos p ON m.id_producto = p.id_producto
        INNER JOIN usuarios u ON m.cedula_usuario = u.cedula
        WHERE m.tipo_movimiento = 'entrada';
    `;

    conexion.query(consultar, function (error, results) {
        if (error) {
            console.error('Error obteniendo movimientos de entrada:', error);
            return res.status(500).send('Error obteniendo movimientos de entrada');
        }
        res.json(results);
    });
});

//Ruta para eliminar usuarios
app.delete('/usuarios/:cedula', function (req, res) {
    let cedula = req.params.cedula;
    let eliminar = 'DELETE FROM usuarios WHERE cedula = ?';
    conexion.query(eliminar, [cedula], function (error, results) {
        if (error) {
            return res.status(500).send(error.message);
        }
        res.sendStatus(204);
    });
});

//Ruta para actualizar usuarios
app.put('/usuarios/:cedula', function (req, res) {
    let cedula = req.params.cedula;
    let { nombre, nombre_usuario, telefono_movil } = req.body;
    let actualizar = 'UPDATE usuarios SET nombre = ?, nombre_usuario = ?, telefono_movil = ? WHERE cedula = ?';
    conexion.query(actualizar, [nombre, nombre_usuario, telefono_movil, cedula], function (error, results) {
        if (error) {
            return res.status(500).send(error.message);
        }
        res.sendStatus(200);
    });
});







app.listen(3000, function() {
    console.log('se ha conectado a la base de datos de INVENTX ,Servidor escuchando en el puerto 3000');
});

