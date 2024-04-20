const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/agregar', (req, res) => { // ruta para AGREGAR deporte y su precio > http://localhost:3000/agregar?nombre=Futbol&precio=30000
    const { nombre, precio } = req.body;

    if (!nombre || !precio) {
        return res.status(400).send('El nombre y el precio son requeridos.');
    }

    let deportes = [];
    try {
        const data = fs.readFileSync('deportes.json', 'utf8');
        deportes = JSON.parse(data);
    } catch (err) {
        console.error('Error al cargar el archivo JSON:', err);
    }

    const nuevoDeporte = { nombre, precio };
    deportes.push(nuevoDeporte);

    fs.writeFile('deportes.json', JSON.stringify(deportes), (err) => {
        if (err) {
            console.error('Error al guardar el archivo JSON:', err);
            return res.status(500).send('Error interno al guardar el deporte.');
        }
        res.status(200).send('Deporte agregado correctamente.');
    });
});

// 
app.get('/deportes', (req, res) => { // ruta para obtener todos los deportes registrados en el JSON > http://localhost:3000/deportes <
    try {
        const data = fs.readFileSync('deportes.json', 'utf8');
        const deportes = JSON.parse(data);
        res.status(200).json({ deportes });
    } catch (err) {
        console.error('Error al cargar el archivo JSON:', err);
        res.status(500).send('Error interno al obtener los deportes.');
    }
});

//
app.post('/editar', (req, res) => { // ruta para editar precio del deporte en el JSON > http://localhost:3000/editar?nombre=NombreDeporte&precio=NuevoPrecio <
    const { nombre, precio } = req.body;

    if (!nombre || !precio) {
        return res.status(400).send('El nombre y el precio son requeridos.');
    }

    try {
        let deportes = [];
        const data = fs.readFileSync('deportes.json', 'utf8');
        deportes = JSON.parse(data);

        const deporteIndex = deportes.findIndex((d) => d.nombre === nombre);
        if (deporteIndex !== -1) {
            deportes[deporteIndex].precio = precio;

            fs.writeFile('deportes.json', JSON.stringify(deportes), (err) => {
                if (err) {
                    console.error('Error al guardar el archivo JSON:', err);
                    return res.status(500).send('Error interno al editar el precio del deporte.');
                }
                res.status(200).send('Precio del deporte editado correctamente.');
            });
        } else {
            res.status(404).send('Deporte no encontrado.');
        }
    } catch (err) {
        console.error('Error al cargar el archivo JSON:', err);
        res.status(500).send('Error interno al editar el precio del deporte.');
    }
});

//
app.get('/eliminar', (req, res) => { // ruta para eliminar deporte desde el NOMBRE > http://localhost:3000/eliminar?nombre=NombreDeporte <
    const { nombre } = req.query;

    if (!nombre) {
        return res.status(400).send('El nombre del deporte es requerido.');
    }

    try {
        let deportes = [];
        const data = fs.readFileSync('deportes.json', 'utf8');
        deportes = JSON.parse(data);

        deportes = deportes.filter((d) => d.nombre !== nombre);

        fs.writeFile('deportes.json', JSON.stringify(deportes), (err) => {
            if (err) {
                console.error('Error al guardar el archivo JSON:', err);
                return res.status(500).send('Error interno al eliminar el deporte.');
            }
            res.status(200).send('Deporte eliminado correctamente.');
        });
    } catch (err) {
        console.error('Error al cargar el archivo JSON:', err);
        res.status(500).send('Error interno al eliminar el deporte.');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});


