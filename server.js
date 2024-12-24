const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const registros = [];
const MAX_REGISTROS = 10;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname)); // Servir archivos estáticos como el HTML

// Rutas
app.get('/api/registros', (req, res) => {
    res.json(registros);
});

app.post('/api/registros', (req, res) => {
    const { cantidad, precio, descripcion } = req.body;

    if (registros.length >= MAX_REGISTROS) {
        return res.status(400).json({ mensaje: 'No se pueden agregar más de 10 registros.' });
    }

    const subtotal = cantidad * precio;
    const iva = subtotal * 0.12; // IVA del 12%
    const total = subtotal + iva;

    const registro = { cantidad, precio, descripcion, subtotal, iva, total };
    registros.push(registro);

    res.json(registros);
});

// Ruta DELETE para eliminar un registro por su índice
app.delete('/api/registros/:index', (req, res) => {
    const index = parseInt(req.params.index);

    if (index >= 0 && index < registros.length) {
        // Eliminar el registro en el índice especificado
        registros.splice(index, 1);

        // Devolver la lista de registros actualizada
        res.json(registros);
    } else {
        res.status(404).json({ mensaje: 'Registro no encontrado.' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
