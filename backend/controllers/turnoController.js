const db = require('../config/database');
const turnoService = require('../services/turnoService');

// ==============================
// OBTENER TODOS LOS TURNOS
// ==============================
async function obtenerTurnos(req, res) {
    try {
        const turnos = await turnoService.obtenerTodos();
        res.json(turnos);
    } catch (error) {
        console.error('Error al obtener turnos:', error);
        res.status(500).json({
            error: 'Error al obtener los turnos'
        });
    }
}

// ==============================
// OBTENER UN TURNO POR ID
// ==============================
async function obtenerTurnoPorId(req, res) {
    try {
        const id = req.params.id;
        const [turnos] = await db.execute(
            'SELECT * FROM turno WHERE id_turno = ?',
            [id]
        );
        if (turnos.length === 0) {
            return res.status(404).json({
                error: 'Turno no encontrado'
            });
        }
        res.json(turnos[0]);
    } catch (error) {
        console.error('Error al obtener el turno:', error);
        res.status(500).json({
            error: 'Error al obtener el turno'
        });
    }
}

// ==============================
// CREAR TURNO
// ==============================
async function crearTurno(req, res) {
    try {
        const {
            fecha_turno,
            hora_turno,
            medio_solicitado,
            estado_turno,
            fecha_confirmacion,
            medico_confirmacion,
            dni_paciente,
            id_practica,
            id_equipo,
            id_disponibilidad,
            matricula_medico
        } = req.body;

        const [resultado] = await db.execute(
            `INSERT INTO turno
            (
                fecha_turno,
                hora_turno,
                medio_solicitado,
                estado_turno,
                fecha_confirmacion,
                medico_confirmacion,
                dni_paciente,
                id_practica,
                id_equipo,
                id_disponibilidad,
                matricula_medico
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                fecha_turno,
                hora_turno,
                medio_solicitado || 'Web',
                estado_turno || 'Reservado',
                fecha_confirmacion || null,
                medico_confirmacion || null,
                dni_paciente,
                id_practica,
                id_equipo,
                id_disponibilidad,
                matricula_medico
            ]
        );

        res.status(201).json({
            mensaje: 'Turno creado correctamente',
            id_turno: resultado.insertId
        });
    } catch (error) {
        console.error('Detalle del error al crear turno:', error);
        res.status(500).json({ mensaje: 'Error al crear el turno' });
    }
}


 // ==============================
 // ACTUALIZAR TURNO
 // ==============================
async function actualizarTurno(req, res) {
    try {
        const { id } = req.params;

        const {
            fecha_turno,
            hora_turno,
            medio_solicitado,
            dni_paciente,
            id_practica,
            id_equipo,
            id_disponibilidad,
            matricula_medico
        } = req.body;

        const [resultado] = await db.execute(
            `UPDATE turno
             SET fecha_turno = ?,
                 hora_turno = ?,
                 medio_solicitado = ?,
                 estado_turno = 'Reservado',
                 fecha_confirmacion = NULL,
                 medico_confirmacion = NULL,
                 dni_paciente = ?,
                 id_practica = ?,
                 id_equipo = ?,
                 id_disponibilidad = ?,
                 matricula_medico = ?
             WHERE id_turno = ?
             AND estado_turno IN ('Reservado', 'Confirmado')`,
            [
                fecha_turno,
                hora_turno,
                medio_solicitado,
                dni_paciente,
                id_practica,
                id_equipo,
                id_disponibilidad,
                matricula_medico,
                id
            ]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                error: 'Turno no encontrado o no se puede modificar.'
            });
        }

        res.json({
            mensaje: `Turno ${id} actualizado correctamente`
        });

    } catch (error) {
        console.error('Error al actualizar turno:', error);

        res.status(500).json({
            error: 'Error al actualizar el turno'
        });
    }
}



// ==============================
// CANCELAR TURNO (CAMBIAR ESTADO A "CANCELADO")
// ==============================
async function cambiarEstadoCancelado(req, res) {
    try {
        const { id } = req.params;
        const actualizado = await turnoService.cancelarTurno(id);

        if (!actualizado) {
            return res.status(400).json({ error: 'No se pudo cancelar el turno o ya se encuentra cancelado' });
        }

        res.json({ mensaje: 'Turno cancelado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno al cancelar el turno' });
    }
}

// ==============================
// CONFIRMAR TURNO
// ==============================
async function confirmarTurno(req, res) {
    try {
        const { id } = req.params;
        const { medico_confirmacion } = req.body;

        const [resultado] = await db.execute(
            `UPDATE turno 
             SET estado_turno = 'Confirmado', fecha_confirmacion = NOW(), medico_confirmacion = ? 
             WHERE id_turno = ?`,
            [medico_confirmacion || null, id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Turno no encontrado' });
        }

        res.json({ mensaje: `Turno ${id} confirmado correctamente` });
    } catch (error) {
        console.error('Error al confirmar turno:', error);
        res.status(500).json({ error: 'Error al confirmar el turno' });
    }
}

// ==============================
// OPTENER MEDICOS POR PRÁCTICA
// ==============================

async function obtenerMedicosPorPractica(req, res) {
    try {
        const { id_practica } = req.params;

        if (!/^\d+$/.test(id_practica) || Number(id_practica) <= 0) {
            return res.status(400).json({
                error: 'La práctica seleccionada no es válida.'
            });
        }

        const medicos =
            await turnoService.obtenerMedicosPorPractica(id_practica);

        res.json(medicos);

    } catch (error) {
        console.error('Error al obtener médicos:', error);

        res.status(500).json({
            error: 'Error al obtener los médicos de la práctica.'
        });
    }
}

// ==============================
// optener disponibilidades de un médico
// ==============================

async function obtenerDisponibilidadesMedico(req, res) {
    try {
        const { matricula_medico } = req.params;

        if (!/^\d+$/.test(matricula_medico)) {
            return res.status(400).json({
                error: 'La matrícula del médico no es válida.'
            });
        }

        const disponibilidades =
            await turnoService.obtenerDisponibilidadesMedico(
                matricula_medico
            );

        res.json(disponibilidades);

    } catch (error) {
        console.error('Error al consultar disponibilidades:', error);

        res.status(500).json({
            error: 'Error al obtener las disponibilidades del médico.'
        });
    }
}


 // ==============================
 // OBTENER MIS TURNOS SEGÚN EL PERFIL
 // ==============================
async function obtenerMisTurnos(req, res) {
    try {
        const id_usuario = req.usuario.id_usuario;
        const id_rol = Number(req.usuario.id_rol);

        let turnos;

        if (id_rol === 2) {
            // Médico: obtener sus turnos asignados
            turnos = await turnoService.obtenerTurnosMedico(id_usuario);

        } else if (id_rol === 3) {
            // Paciente: obtener sus propios turnos
            turnos = await turnoService.obtenerTurnosPaciente(id_usuario);

        } else {
            return res.status(403).json({
                error: 'Este perfil no tiene acceso a esta consulta.'
            });
        }

        return res.json(turnos);

    } catch (error) {
        console.error('Error al obtener mis turnos:', error);

        return res.status(500).json({
            error: 'Error al obtener los turnos del usuario.'
        });
    }
}

// ==============================
// OPTENER PRÁCTICAS MÉDICAS
// ==============================
async function obtenerPracticas(req, res) {
    try {
        const practicas = await turnoService.obtenerPracticas();
        return res.json(practicas);

    } catch (error) {
        console.error('Error al obtener prácticas:', error);

        return res.status(500).json({
            error: 'Error al obtener las prácticas.'
        });
    }
}

// ==============================
// OPTENER EQUIPOS POR PRÁCTICA
// ==============================
async function obtenerEquiposPorPractica(req, res) {
    try {
        const { id_practica } = req.params;

        if (!/^\d+$/.test(id_practica) ||
            Number(id_practica) <= 0) {
            return res.status(400).json({
                error: 'La práctica seleccionada no es válida.'
            });
        }

        const equipos =
            await turnoService.obtenerEquiposPorPractica(id_practica);

        return res.json(equipos);

    } catch (error) {
        console.error('Error al obtener equipos:', error);

        return res.status(500).json({
            error: 'Error al obtener los equipos de la práctica.'
        });
    }
}




// ==============================
// EXPORTAR CONTROLADORES
// ==============================
module.exports = {
    obtenerTurnos,
    obtenerTurnoPorId,
    crearTurno,
    actualizarTurno,
    confirmarTurno,
    cambiarEstadoCancelado,
    obtenerMedicosPorPractica,
    obtenerDisponibilidadesMedico,
    obtenerMisTurnos,
    obtenerPracticas,
    obtenerEquiposPorPractica
};