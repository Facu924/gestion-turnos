const db = require('../config/database');


async function obtenerTodos() {
    const [turnos] = await db.query(`
        SELECT *
        FROM turno
        ORDER BY fecha_turno, hora_turno
    `);


    return turnos;
}

async function cancelarTurno(id_turno) {
    const [resultado] = await db.execute(
        `UPDATE turno 
         SET estado_turno = 'Cancelado' 
         WHERE id_turno = ? AND estado_turno != 'Cancelado'`,
        [id_turno]
    );
    return resultado.affectedRows > 0;
}


async function obtenerTurnosPaciente(id_usuario) {
    const [turnos] = await db.execute(
        `SELECT t.*
         FROM turno t
         INNER JOIN usuario u
             ON t.dni_paciente = u.dni_paciente
         WHERE u.id_usuario = ?
         AND u.id_rol = 3
         ORDER BY t.fecha_turno, t.hora_turno`,
        [id_usuario]
    );

    return turnos;
}


async function obtenerTurnosMedico(id_usuario) {
    const [turnos] = await db.execute(
        `SELECT t.*
         FROM turno t
         INNER JOIN usuario u
             ON t.matricula_medico = u.matricula_medico
         WHERE u.id_usuario = ?
         AND u.id_rol = 2
         ORDER BY t.fecha_turno, t.hora_turno`,
        [id_usuario]
    );

    return turnos;
}



async function obtenerMedicosPorPractica(id_practica) {
    const [medicos] = await db.execute(
        `SELECT
            m.matricula_medico,
            m.nombre_medico,
            m.apellido_medico
         FROM medico m
         INNER JOIN practica_medico pm
            ON m.matricula_medico = pm.matricula_medico
         WHERE pm.id_practica = ?
         ORDER BY m.apellido_medico, m.nombre_medico`,
        [id_practica]
    );

    return medicos;
}


async function obtenerDisponibilidadesMedico(matricula_medico) {
    const [disponibilidades] = await db.execute(
        `SELECT
            d.id_disponibilidad,
            d.dia,
            d.hora_desde,
            d.hora_hasta
         FROM disponibilidad d
         INNER JOIN medico_disponibilidad md
            ON d.id_disponibilidad = md.id_disponibilidad
         WHERE md.matricula_medico = ?
         ORDER BY d.id_disponibilidad`,
        [matricula_medico]
    );

    return disponibilidades;
}


async function obtenerPracticas() {
    const [practicas] = await db.execute(
        `SELECT id_practica, nombre_practica
         FROM practica
         ORDER BY nombre_practica`
    );

    return practicas;
}

async function obtenerEquiposPorPractica(id_practica) {
    const [equipos] = await db.execute(
        `SELECT e.id_equipo
         FROM equipo e
         INNER JOIN practica_equipo pe
             ON e.id_equipo = pe.id_equipo
         WHERE pe.id_practica = ?
         ORDER BY e.id_equipo`,
        [id_practica]
    );

    return equipos;
}



module.exports = {
    obtenerTodos,
    cancelarTurno,
    obtenerTurnosPaciente,
    obtenerTurnosMedico,
    obtenerMedicosPorPractica,
    obtenerDisponibilidadesMedico,
    obtenerPracticas,
    obtenerEquiposPorPractica
};

