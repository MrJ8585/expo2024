require('dotenv').config();
const express = require('express');
const publicRouter = express.Router();
const { client } = require('../db/db');

//? Rutas para establecimiento
//*GET
publicRouter.get('/establecimiento', (req, res) => {
    client.query('SELECT * FROM establecimiento', (error, result) => {
        if (error) {
            res.status(400).send('Error al obtener datos de la base de datos');
        } else {
            res.status(200).json(result.rows);
        }
    });
});

//?Rutas para marca
//*GET
publicRouter.get('/marca', (req, res) => {
    client.query('SELECT * FROM marca', (error, result) => {
        if (error) {
            res.status(400).send('Error al obtener datos de la base de datos');
        } else {
            res.status(200).json(result.rows);
        }
    });
});

//?Rutas para proveedor
//*GET
publicRouter.get('/proveedor', (req, res) => {
    client.query('SELECT * FROM proveedor', (error, result) => {
        if (error) {
            res.status(400).send('Error al obtener datos de la base de datos');
        } else {
            res.status(200).json(result.rows);
        }
    });
});

//?Rutas para tag
//*GET
publicRouter.get('/tag', (req, res) => {
    client.query('SELECT * FROM tag', (error, result) => {
        if (error) {
            res.status(400).send('Error al obtener datos de la base de datos');
        } else {
            res.status(200).json(result.rows);
        }
    });
});

//*POST
publicRouter.post('/tag', (req, res) => {
    const { tag } = req.body;
    client.query('INSERT INTO tag (tag) VALUES ($1)', [tag], (error, result) => {
        if (error) {
            res.status(400).send('Error al insertar datos en la base de datos');
        } else {
            res.status(200).send('Tag insertado correctamente');
        }
    });
});

//*PATCH
publicRouter.patch('/tag/:id', (req, res) => {
    const { id } = req.params;
    const { tag } = req.body;
    client.query('UPDATE tag SET tag = $1 WHERE id = $2', [tag, id], (error, result) => {
        if (error) {
            res.status(400).send('Error al actualizar datos en la base de datos');
        } else {
            res.status(200).send('Tag actualizado correctamente', result);
        }
    });
});

//*DELETE
publicRouter.delete('/tag/:id', (req, res) => {
    const { id } = req.params;
    client.query('DELETE FROM tag WHERE id = $1', [id], (error, result) => {
        if (error || result.rowCount === 0) {
            res.status(400).send('Error al eliminar datos de la base de datos');
        } else {
            res.status(200).send('Tag eliminado correctamente');
        }
    });
});

//?Rutas para usuario
//*GET
publicRouter.get('/usuario', (req, res) => {
    client.query('SELECT * FROM usuario', (error, result) => {
        if (error) {
            res.status(400).send('Error al obtener datos de la base de datos');
        } else {
            res.status(200).json(result.rows);
        }
    });
});

//?Rutas para item
//*GET
publicRouter.get('/item', (req, res) => {
    client.query('SELECT i.*, m.marca, t.tag, p.proveedor FROM item i inner join tag t on i.fk_tag = t.id inner join marca m on i.fk_marca = m.id inner join proveedor p on i.fk_proveedor = p.id', (error, result) => {
        if (error) {
            res.status(400).send('Error al obtener datos de la base de datos');
        } else {
            res.status(200).json(result.rows);
        }
    });
});

//*POST
publicRouter.post('/item', (req, res) => {
    const { item, precio, id_marca, id_proveedor, id_tag } = req.body;
    client.query('INSERT INTO item (item, precio, fk_marca, fk_proveedor, fk_tag) VALUES ($1, $2, $3, $4, $5)', [item, precio, id_marca, id_proveedor, id_tag], (error, result) => {
        if (error) {
            res.status(400).send('Error al insertar datos en la base de datos');
        } else {
            res.status(200).send('Item insertado correctamente');
        }
    });
});

//*PATCH
publicRouter.patch('/item/:id', (req, res) => {
    const { id } = req.params;
    const { item, precio, id_marca, id_proveedor, id_tag } = req.body;
    client.query('UPDATE item SET item = $1, precio = $2, fk_marca = $3, fk_proveedor = $4, fk_tag = $5 WHERE id = $6', [item, precio, id_marca, id_proveedor, id_tag, id], (error, result) => {
        if (error) {
            res.status(400).send('Error al actualizar datos en la base de datos');
        } else {
            res.status(200).send('Item actualizado correctamente');
        }
    });
});

//*DELETE
publicRouter.delete('/item/:id', (req, res) => {
    const { id } = req.params;
    client.query('DELETE FROM item WHERE id = $1', [id], (error, result) => {
        if (error || result.rowCount === 0) {
            res.status(400).send('Error al eliminar datos de la base de datos');
        } else {
            res.status(200).send('Item eliminado correctamente');
        }
    });
});

//?Rutas para ventas por usuario
//*GET
publicRouter.get('/ventas/usuario/:usuario', (req, res) => {
    const { usuario } = req.params;
    client.query('select vi.*, i.item, e.establecimiento, t.tag, m.marca from venta_item vi inner join venta v on vi.fk_venta = v.id inner join item i on vi.fk_item = i.id inner join establecimiento e on v.fk_establecimiento = e.id inner join tag t on i.fk_tag = t.id inner join marca m on i.fk_marca = m.id where v.fk_usuario = $1', [usuario], (error, result) => {
        if (error) {
            res.status(400).send(error);
        } else {
            res.status(200).json(result.rows);
        }
    });
});

//*POST
publicRouter.post('/ventas/usuario', (req, res) => {
    const { usuario, establecimiento, item, cantidad } = req.body;
    if (!usuario || !establecimiento || !item || !cantidad) {
        res.status(400).send('Faltan datos');
    }
    if(cantidad.length !== item.length){
        res.status(400).send('Cantidad de items no coincide con cantidad de productos');
    }

    const itemsArray = `ARRAY[${item.join(', ')}]`;
    const cantidadArray = `ARRAY[${cantidad.join(', ')}]`;
    const query = `CALL insertar_venta(${establecimiento}, ${usuario}, ${itemsArray}, ${cantidadArray});`;

    client.query(query, (error, result) => {
        if (error) {
            res.status(400).send('Error al insertar datos en la base de datos');
        } else {
            res.status(200).send('Venta insertada correctamente');
        }
    });
});

//*DELETE
publicRouter.delete('/ventas/usuario/:id', (req, res) => {
    const { id } = req.params;
    client.query('call eliminar_venta($1);', [id], (error, result) => {
        if (error) {
            res.status(400).send('Error al eliminar datos de la base de datos');
        } else {
            res.status(200).send('Venta eliminada correctamente');
        }
    });
});



module.exports = publicRouter;