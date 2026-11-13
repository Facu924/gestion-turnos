const express = require('express');
const cors = require('cors');
const turnoroutes = require('./routes/turnoRoutes');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();
const app = express();

app.use(cors()); // 2. Habilitar CORS para todas las solicitudes
app.use(express.json());

app.use(express.json());
app.use('/api/turnos', turnoroutes);
console.log('Rutas de turnos cargadas correctamente');


app.use('/api/auth', authRoutes);
console.log('Rutas de autenticación cargadas correctamente');
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
