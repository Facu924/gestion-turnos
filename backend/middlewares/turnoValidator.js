const db = require('../config/database');


function convertirAMinutos(hora) {
    const partes = hora.split(':').map(Number);
    return partes[0] * 60 + partes[1];
}

async function obtenerDuracionPractica(id_practica) {
    const [practicas] = await db.execute(
        `SELECT duracion
         FROM practica
         WHERE id_practica = ?`,
        [id_practica]
    );

    if (practicas.length === 0) {
        throw new Error('La práctica no existe');
    }

    return Number(practicas[0].duracion);
}


async function verificarSuperposicion(req, res, next, campo, mensaje) {
    try {
        const {
            fecha_turno,
            hora_turno,
            id_practica
        } = req.body;

        const identificador = req.body[campo];

        if (!identificador || !fecha_turno ||
            !hora_turno || !id_practica) {
            return res.status(400).json({
                error: 'Faltan datos para verificar los turnos.'
            });
        }

        const duracion = await obtenerDuracionPractica(id_practica);

        if (!Number.isFinite(duracion) || duracion <= 0) {
            return res.status(400).json({
                error: 'La duración de la práctica no es válida.'
            });
        }

        const inicioNuevo = convertirAMinutos(hora_turno);
        const finNuevo = inicioNuevo + duracion;

        if (!Number.isFinite(inicioNuevo) ||
            inicioNuevo < 0 || inicioNuevo >= 1440 ||
            finNuevo > 1440) {
            return res.status(400).json({
                error: 'El horario del turno no es válido.'
            });
        }

        // Solamente se admiten estos campos
        const camposPermitidos = [
            'matricula_medico',
            'id_equipo',
            'dni_paciente'
        ];

        if (!camposPermitidos.includes(campo)) {
            throw new Error('Campo de validación no permitido');
        }

        const idTurnoActual = req.params.id || 0;

const [turnos] = await db.execute(
    `SELECT t.id_turno, t.hora_turno, p.duracion
     FROM turno t
     INNER JOIN practica p
        ON t.id_practica = p.id_practica
     WHERE t.${campo} = ?
       AND t.fecha_turno = ?
       AND t.estado_turno IN ('Reservado', 'Confirmado')
       AND t.id_turno != ?`,
    [identificador, fecha_turno, idTurnoActual]
);

        for (const turno of turnos) {
            const inicioExistente =
                convertirAMinutos(turno.hora_turno);

            const finExistente =
                inicioExistente + Number(turno.duracion);

            if (inicioNuevo < finExistente &&
                finNuevo > inicioExistente) {
                return res.status(400).json({
                    error: mensaje
                });
            }
        }

        next();

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: 'Error al verificar la superposición de turnos.'
        });
    }
}



// 1. Validar que los campos obligatorios y el paciente existan
async function validarPacienteYCampos(req, res, next) {
    try {
        const { dni_paciente, fecha_turno, hora_turno, id_equipo } = req.body;

        if (!dni_paciente || !fecha_turno || !hora_turno || !id_equipo) {
            return res.status(400).json({ error: 'Todos los campos obligatorios deben estar completos.' });
        }

        const [pacientes] = await db.execute(
            'SELECT dni_paciente FROM paciente WHERE dni_paciente = ?',
            [dni_paciente]
        );
        if (pacientes.length === 0) {
            return res.status(404).json({ error: 'El paciente no existe.' });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al validar el paciente.' });
    }
}

// 2. Validación: Evitar que se asignen turnos en fechas anteriores a la actual
async function validarFechaNoPasada(req, res, next) {
    try {
        const { fecha_turno } = req.body;
        const fechaActual = new Date().toISOString().split('T')[0];

        if (fecha_turno < fechaActual) {
            return res.status(400).json({ error: 'No se pueden asignar turnos en fechas anteriores a la actual.' });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al validar la fecha del turno.' });
    }
}

// 3. Validación: Evitar que un médico/equipo tenga dos turnos en el mismo horario
async function validarDisponibilidadEquipo(req, res, next) {
    return verificarSuperposicion(
        req, res, next,
        'id_equipo',
        'El equipo ya tiene un turno asignado durante ese horario.'
    );
}

// 4. Validación: Evitar que un paciente tenga dos turnos superpuestos
async function validarSuperposicionPaciente(req, res, next) {
    return verificarSuperposicion(
        req, res, next,
        'dni_paciente',
        'El paciente ya tiene un turno superpuesto.'
    );
}

// 5. Validación: Impedir que se modifique o cancele un turno que ya fue cancelado
async function validarTurnoNoCancelado(req, res, next) {
    try {
        const { id } = req.params;
        const [turnos] = await db.execute(
            'SELECT estado_turno FROM turno WHERE id_turno = ?',
            [id]
        );

        if (turnos.length === 0) {
            return res.status(404).json({ error: 'Turno no encontrado.' });
        }

        if (turnos[0].estado_turno === 'Cancelado') {
            return res.status(400).json({ error: 'No se puede modificar un turno que ya se encuentra cancelado.' });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al validar el estado del turno.' });
    }
}


async function validarMedicoAsignado(req, res, next) {
    try {
        const {
            matricula_medico,
            id_practica,
            id_disponibilidad
        } = req.body;

        if (!matricula_medico || !id_practica || !id_disponibilidad) {
            return res.status(400).json({
                error: 'Debe seleccionar un médico, una práctica y una disponibilidad.'
            });
        }

        const [medicos] = await db.execute(
            `SELECT matricula_medico
             FROM medico
             WHERE matricula_medico = ?`,
            [matricula_medico]
        );

        if (medicos.length === 0) {
            return res.status(404).json({
                error: 'El médico seleccionado no existe.'
            });
        }

        const [practicas] = await db.execute(
            `SELECT matricula_medico
             FROM practica_medico
             WHERE matricula_medico = ?
             AND id_practica = ?`,
            [matricula_medico, id_practica]
        );

        if (practicas.length === 0) {
            return res.status(400).json({
                error: 'El médico no puede realizar la práctica seleccionada.'
            });
        }

        const [disponibilidades] = await db.execute(
            `SELECT matricula_medico
             FROM medico_disponibilidad
             WHERE matricula_medico = ?
             AND id_disponibilidad = ?`,
            [matricula_medico, id_disponibilidad]
        );

        if (disponibilidades.length === 0) {
            return res.status(400).json({
                error: 'El médico no tiene asignada esa disponibilidad.'
            });
        }

        next();

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Error al validar el médico asignado.'
        });
    }
}


async function validarHorarioMedico(req, res, next) {
    try {
        const {
            matricula_medico,
            id_disponibilidad,
            fecha_turno,
            hora_turno
        } = req.body;

        if (!matricula_medico || !id_disponibilidad ||
            !fecha_turno || !hora_turno) {
            return res.status(400).json({
                error: 'Faltan datos para validar el horario del médico.'
            });
        }

        // Obtener la disponibilidad registrada en MySQL
        const [horarios] = await db.execute(
            `SELECT d.dia, d.hora_desde, d.hora_hasta
             FROM disponibilidad d
             INNER JOIN medico_disponibilidad md
                ON d.id_disponibilidad = md.id_disponibilidad
             WHERE md.matricula_medico = ?
               AND d.id_disponibilidad = ?`,
            [matricula_medico, id_disponibilidad]
        );

        if (horarios.length === 0) {
            return res.status(400).json({
                error: 'El médico no tiene asignada esa disponibilidad.'
            });
        }

        const horario = horarios[0];

        // Obtener el día de la semana de la fecha solicitada
        const fecha = new Date(`${fecha_turno}T12:00:00`);

        if (Number.isNaN(fecha.getTime())) {
            return res.status(400).json({
                error: 'La fecha ingresada no es válida.'
            });
        }

        const dias = [
            'Domingo', 'Lunes', 'Martes', 'Miércoles',
            'Jueves', 'Viernes', 'Sábado'
        ];

        const diaSolicitado = dias[fecha.getDay()];

        // Comparar el día
        if (diaSolicitado.toLowerCase() !==
            horario.dia.toLowerCase()) {
            return res.status(400).json({
                error: 'La fecha no coincide con el día de disponibilidad del médico.'
            });
        }

        
 // Comprobar que la práctica termine dentro
 // de la disponibilidad del médico

const duracion = await obtenerDuracionPractica(req.body.id_practica);

if (!Number.isFinite(duracion) || duracion <= 0) {
    return res.status(400).json({
        error: 'La duración de la práctica no es válida.'
    });
}

const inicioTurno = convertirAMinutos(hora_turno);
const finTurno = inicioTurno + duracion;

const inicioDisponibilidad =
    convertirAMinutos(horario.hora_desde);

const finDisponibilidad =
    convertirAMinutos(horario.hora_hasta);

if (!Number.isFinite(inicioTurno) ||
    inicioTurno < inicioDisponibilidad ||
    finTurno > finDisponibilidad) {

    return res.status(400).json({
        error: 'La práctica no puede realizarse completamente dentro del horario disponible del médico.'
    });
}


        next();

    } catch (error) {
        console.error('Error al validar horario:', error);

        return res.status(500).json({
            error: 'Error al comprobar el horario del médico.'
        });
    }
}


 // 8. Validar que el médico no tenga otro turno
 // con la misma fecha y hora de inicio
async function validarSuperposicionMedico(req, res, next) {
    return verificarSuperposicion(
        req, res, next,
        'matricula_medico',
        'El médico ya tiene un turno asignado durante ese horario.'
    );
}

    


module.exports = {
    validarPacienteYCampos,
    validarFechaNoPasada,
    validarDisponibilidadEquipo,
    validarSuperposicionPaciente,
    validarTurnoNoCancelado,
    validarMedicoAsignado,
    validarHorarioMedico,
    validarSuperposicionMedico
};