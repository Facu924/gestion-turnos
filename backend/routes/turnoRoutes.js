const express = require('express');
const router = express.Router();
const turnocontroller = require('../controllers/turnoController');
const {validarPacienteYCampos,
    validarFechaNoPasada,
    validarDisponibilidadEquipo,
    validarHorarioMedico,
    validarSuperposicionPaciente,
    validarTurnoNoCancelado,
    validarMedicoAsignado,
    validarSuperposicionMedico
    } = require('../middlewares/turnoValidator');

const verificarToken = require('../middlewares/authMiddleware');
const autorizarRol = require('../middlewares/autorizarRol');

// 1. Verificar que el usuario tenga un token válido
router.use(verificarToken);

// Médico y paciente: consultar sus propios turnos
router.get(
    '/mis-turnos',
    autorizarRol(2, 3),
    turnocontroller.obtenerMisTurnos
);

// 2. Permitir solamente al ADMIN (Rol ID = 1)
router.use(autorizarRol(1));

router.get(
    '/practicas',
    turnocontroller.obtenerPracticas
);

router.get(
    '/practicas/:id_practica/equipos',
    turnocontroller.obtenerEquiposPorPractica
);

// 3. Rutas CRUD de turnos
router.get('/', turnocontroller.obtenerTurnos);

router.get(
    '/medicos/practica/:id_practica',
    turnocontroller.obtenerMedicosPorPractica
);

router.get(
    '/medicos/:matricula_medico/disponibilidades',
    turnocontroller.obtenerDisponibilidadesMedico
);

router.get(
    '/:id',
    turnocontroller.obtenerTurnoPorId
);

router.post(
    '/',
    [
        validarPacienteYCampos,
        validarFechaNoPasada,
        validarMedicoAsignado,
        validarHorarioMedico,
        validarDisponibilidadEquipo,
        validarSuperposicionPaciente,
        validarSuperposicionMedico
    ],
    turnocontroller.crearTurno
);


router.put(
    '/:id',
    [
        validarTurnoNoCancelado,
        validarPacienteYCampos,
        validarFechaNoPasada,
        validarMedicoAsignado,
        validarHorarioMedico,
        validarDisponibilidadEquipo,
        validarSuperposicionPaciente,
        validarSuperposicionMedico
    ],
    turnocontroller.actualizarTurno
);


// Ruta para cancelar un turno 
router.put('/:id/cancelar', validarTurnoNoCancelado, turnocontroller.cambiarEstadoCancelado);

module.exports = router;
