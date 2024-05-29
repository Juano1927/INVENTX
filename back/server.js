const express = require('express');
const mysql = require("mysql");
const bodyParser = require('body-parser');
const cors = require('cors');
const ExcelJS = require('exceljs');
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
    let consultar = 'SELECT cedula, nombre, nombre_usuario, contrasena, telefono_movil FROM usuarios';
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

// Ruta para actualizar usuarios
app.put('/usuarios/:cedula', function (req, res) {
    let cedula = req.params.cedula;
    let { nombre, nombre_usuario, telefono_movil, contrasena } = req.body;
    let actualizar = 'UPDATE usuarios SET nombre = ?, nombre_usuario = ?, telefono_movil = ?, contrasena = ? WHERE cedula = ?';
    conexion.query(actualizar, [nombre, nombre_usuario, telefono_movil, contrasena, cedula], function (error, results) {
        if (error) {
            return res.status(500).send(error.message);
        }
        res.sendStatus(200);
    });
});


//Ruta para obtener productos (/productos):

app.get('/productos', function (req, res) {
    let consultar = 'SELECT id, nombre FROM productos';
    conexion.query(consultar, function (error, results) {
        if (error) {
            return res.status(500).send(error.message);
        }
        res.json(results);
    });
});

//Ruta para exportar a excel:

app.get('/exportar-excel', async function (req, res) {
    const { fechaInicio, fechaFin, productoId } = req.query;
    let consultar = `
        SELECT id_producto, cedula_usuario, tipo_movimiento, cantidad, fecha 
        FROM movimientos 
        WHERE fecha BETWEEN ? AND ? AND id_producto = ?
    `;
    conexion.query(consultar, [fechaInicio, fechaFin, productoId], async function (error, results) {
        if (error) {
            return res.status(500).send(error.message);
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Movimientos');

        worksheet.columns = [
            { header: 'ID Producto', key: 'id_producto', width: 15 },
            { header: 'Cédula Usuario', key: 'cedula_usuario', width: 15 },
            { header: 'Tipo Movimiento', key: 'tipo_movimiento', width: 20 },
            { header: 'Cantidad', key: 'cantidad', width: 10 },
            { header: 'Fecha', key: 'fecha', width: 25 }
        ];

        results.forEach(result => {
            worksheet.addRow(result);
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=reporte_movimientos.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    });
});

// Ruta para obtener los movimientos de salida con un rango de fechas
app.get('/query-salida', function (req, res) {
    const { fechaInicio, fechaFin } = req.query;
    if (!fechaInicio || !fechaFin) {
        return res.status(400).send('Debe proporcionar un rango de fechas.');
    }

    let consultar = `
        SELECT m.id_producto, p.nombre_producto, m.cedula_usuario, u.nombre AS nombre_usuario, m.tipo_movimiento, m.cantidad, m.fecha
        FROM movimientos1 m
        INNER JOIN productos p ON m.id_producto = p.id_producto
        INNER JOIN usuarios u ON m.cedula_usuario = u.cedula
        WHERE m.tipo_movimiento = 'salida' AND m.fecha BETWEEN ? AND ?;
    `;

    conexion.query(consultar, [fechaInicio, fechaFin], function (error, results) {
        if (error) {
            console.error('Error obteniendo movimientos de salida:', error);
            return res.status(500).send('Error obteniendo movimientos de salida');
        }
        res.json(results);
    });
});

// Ruta para exportar los movimientos de salida a Excel con un rango de fechas
app.get('/exportar-salida', async function (req, res) {
    const { fechaInicio, fechaFin } = req.query;
    if (!fechaInicio || !fechaFin) {
        return res.status(400).send('Debe proporcionar un rango de fechas.');
    }

    let consultar = `
        SELECT m.id_producto, p.nombre_producto, m.cedula_usuario, u.nombre AS nombre_usuario, m.tipo_movimiento, m.cantidad, m.fecha
        FROM movimientos1 m
        INNER JOIN productos p ON m.id_producto = p.id_producto
        INNER JOIN usuarios u ON m.cedula_usuario = u.cedula
        WHERE m.tipo_movimiento = 'salida' AND m.fecha BETWEEN ? AND ?;
    `;

    conexion.query(consultar, [fechaInicio, fechaFin], async function (error, results) {
        if (error) {
            return res.status(500).send(error.message);
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Movimientos de Salida');

        worksheet.columns = [
            { header: 'ID Producto', key: 'id_producto', width: 15 },
            { header: 'Nombre Producto', key: 'nombre_producto', width: 25 },
            { header: 'Cédula Usuario', key: 'cedula_usuario', width: 15 },
            { header: 'Nombre Usuario', key: 'nombre_usuario', width: 25 },
            { header: 'Tipo Movimiento', key: 'tipo_movimiento', width: 20 },
            { header: 'Cantidad', key: 'cantidad', width: 10 },
            { header: 'Fecha', key: 'fecha', width: 25 }
        ];

        results.forEach(result => {
            worksheet.addRow(result);
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=movimientos_salida.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    });
});

// Ruta para obtener los movimientos de entrada con un rango de fechas
app.get('/query-entrada', function (req, res) {
    const { fechaInicio, fechaFin } = req.query;
    if (!fechaInicio || !fechaFin) {
        return res.status(400).send('Debe proporcionar un rango de fechas.');
    }

    let consultar = `
        SELECT m.id_producto, p.nombre_producto, m.cedula_usuario, u.nombre AS nombre_usuario, m.tipo_movimiento, m.cantidad, m.fecha
        FROM movimientos1 m
        INNER JOIN productos p ON m.id_producto = p.id_producto
        INNER JOIN usuarios u ON m.cedula_usuario = u.cedula
        WHERE m.tipo_movimiento = 'entrada' AND m.fecha BETWEEN ? AND ?;
    `;

    conexion.query(consultar, [fechaInicio, fechaFin], function (error, results) {
        if (error) {
            console.error('Error obteniendo movimientos de entrada:', error);
            return res.status(500).send('Error obteniendo movimientos de entrada');
        }
        res.json(results);
    });
});

// Ruta para exportar los movimientos de entrada a Excel con un rango de fechas
app.get('/exportar-entrada', async function (req, res) {
    const { fechaInicio, fechaFin } = req.query;
    if (!fechaInicio || !fechaFin) {
        return res.status(400).send('Debe proporcionar un rango de fechas.');
    }

    let consultar = `
        SELECT m.id_producto, p.nombre_producto, m.cedula_usuario, u.nombre AS nombre_usuario, m.tipo_movimiento, m.cantidad, m.fecha
        FROM movimientos1 m
        INNER JOIN productos p ON m.id_producto = p.id_producto
        INNER JOIN usuarios u ON m.cedula_usuario = u.cedula
        WHERE m.tipo_movimiento = 'entrada' AND m.fecha BETWEEN ? AND ?;
    `;

    conexion.query(consultar, [fechaInicio, fechaFin], async function (error, results) {
        if (error) {
            return res.status(500).send(error.message);
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Movimientos de Entrada');

        worksheet.columns = [
            { header: 'ID Producto', key: 'id_producto', width: 15 },
            { header: 'Nombre Producto', key: 'nombre_producto', width: 25 },
            { header: 'Cédula Usuario', key: 'cedula_usuario', width: 15 },
            { header: 'Nombre Usuario', key: 'nombre_usuario', width: 25 },
            { header: 'Tipo Movimiento', key: 'tipo_movimiento', width: 20 },
            { header: 'Cantidad', key: 'cantidad', width: 10 },
            { header: 'Fecha', key: 'fecha', width: 25 }
        ];

        results.forEach(result => {
            worksheet.addRow(result);
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=movimientos_entrada.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    });
});


// Ruta para obtener el reporte de cantidad total por producto
app.get('/reporte-total-producto', function (req, res) {
    const { fechaInicio, fechaFin } = req.query;
    if (!fechaInicio || !fechaFin) {
        return res.status(400).send('Debe proporcionar un rango de fechas.');
    }

    let consultar = `
        SELECT 
            p.id_producto, 
            p.nombre_producto, 
            SUM(CASE WHEN m.tipo_movimiento = 'entrada' THEN m.cantidad ELSE 0 END) AS total_entradas, 
            SUM(CASE WHEN m.tipo_movimiento = 'salida' THEN m.cantidad ELSE 0 END) AS total_salidas,
            (SUM(CASE WHEN m.tipo_movimiento = 'entrada' THEN m.cantidad ELSE 0 END) - 
            SUM(CASE WHEN m.tipo_movimiento = 'salida' THEN m.cantidad ELSE 0 END)) AS total_final
        FROM movimientos1 m
        INNER JOIN productos p ON m.id_producto = p.id_producto
        WHERE m.fecha BETWEEN ? AND ?
        GROUP BY p.id_producto, p.nombre_producto;
    `;

    conexion.query(consultar, [fechaInicio, fechaFin], function (error, results) {
        if (error) {
            console.error('Error obteniendo el reporte total por producto:', error);
            return res.status(500).send('Error obteniendo el reporte total por producto');
        }
        res.json(results);
    });
});

// Ruta para exportar el reporte total por producto a Excel
app.get('/exportar-total-producto', async function (req, res) {
    const { fechaInicio, fechaFin } = req.query;
    if (!fechaInicio || !fechaFin) {
        return res.status(400).send('Debe proporcionar un rango de fechas.');
    }

    let consultar = `
        SELECT 
            p.id_producto, 
            p.nombre_producto, 
            SUM(CASE WHEN m.tipo_movimiento = 'entrada' THEN m.cantidad ELSE 0 END) AS total_entradas, 
            SUM(CASE WHEN m.tipo_movimiento = 'salida' THEN m.cantidad ELSE 0 END) AS total_salidas,
            (SUM(CASE WHEN m.tipo_movimiento = 'entrada' THEN m.cantidad ELSE 0 END) - 
            SUM(CASE WHEN m.tipo_movimiento = 'salida' THEN m.cantidad ELSE 0 END)) AS total_final
        FROM movimientos1 m
        INNER JOIN productos p ON m.id_producto = p.id_producto
        WHERE m.fecha BETWEEN ? AND ?
        GROUP BY p.id_producto, p.nombre_producto;
    `;

    conexion.query(consultar, [fechaInicio, fechaFin], async function (error, results) {
        if (error) {
            return res.status(500).send(error.message);
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Reporte Total por Producto');

        worksheet.columns = [
            { header: 'ID Producto', key: 'id_producto', width: 15 },
            { header: 'Nombre Producto', key: 'nombre_producto', width: 25 },
            { header: 'Total Entradas', key: 'total_entradas', width: 15 },
            { header: 'Total Salidas', key: 'total_salidas', width: 15 },
            { header: 'Total Final', key: 'total_final', width: 15 }
        ];

        results.forEach(result => {
            worksheet.addRow(result);
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=reporte_total_producto.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    });
});
/*

// Ruta para obtener los productos cuya existencia total esté entre 0 y 5
app.get('/productos-existencia', function (req, res) {
    let consultar = `
        SELECT p.id_producto, p.nombre_producto, SUM(m.cantidad) AS existencia_total
        FROM productos p
        LEFT JOIN movimientos1 m ON p.id_producto = m.id_producto
        GROUP BY p.id_producto, p.nombre_producto
        HAVING existencia_total BETWEEN 0 AND 5;
    `;

    conexion.query(consultar, function (error, results) {
        if (error) {
            console.error('Error obteniendo productos con existencia entre 0 y 5:', error);
            return res.status(500).send('Error obteniendo productos con existencia entre 0 y 5');
        }
        res.json(results);
    });
});

*/
// Ruta para obtener los productos cuya cantidad total esté entre 0 y 5
app.get('/productos-existencia', function (req, res) {
    let consultar = `
        SELECT p.id_producto, p.nombre_producto, IFNULL(SUM(m.cantidad), 0) AS existencia_total
        FROM productos p
        LEFT JOIN movimientos1 m ON p.id_producto = m.id_producto
        GROUP BY p.id_producto, p.nombre_producto
        HAVING existencia_total >= 0 AND existencia_total <= 5;
    `;

    conexion.query(consultar, function (error, results) {
        if (error) {
            console.error('Error obteniendo productos con existencia entre 0 y 5:', error);
            return res.status(500).send('Error obteniendo productos con existencia entre 0 y 5');
        }
        res.json(results);
    });
});


app.listen(3000, function() {
    console.log('se ha conectado a la base de datos de INVENTX ,Servidor escuchando en el puerto 3000');
});

