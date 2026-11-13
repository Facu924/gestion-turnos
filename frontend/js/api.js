const API_URL = 'http://localhost:3000/api';

async function iniciarSesion(email, password) {
    const respuesta = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const datos = await respuesta.json();
    if (!respuesta.ok) throw new Error(datos.error || 'No se pudo iniciar sesión');
    return datos;
}

async function obtenerTurnosAPI() {
    const token = sessionStorage.getItem('token');
    const respuesta = await fetch(`${API_URL}/turnos`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    const datos = await respuesta.json();
    if (!respuesta.ok) throw new Error(datos.error || 'Error al obtener turnos');
    return datos;
}

async function crearTurnoAPI(turnoData) {
    const token = sessionStorage.getItem('token');
    const respuesta = await fetch(`${API_URL}/turnos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(turnoData)
    });
    const datos = await respuesta.json();
    if (!respuesta.ok) throw new Error(datos.error || 'Error al registrar el turno');
    return datos;
}

async function cancelarTurnoAPI(id_turno) {
    const token = sessionStorage.getItem('token');
    const respuesta = await fetch(`${API_URL}/turnos/${id_turno}/cancelar`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    const datos = await respuesta.json();
    if (!respuesta.ok) throw new Error(datos.error || 'No se pudo cancelar el turno');
    return datos;
}


async function obtenerMedicosPorPracticaAPI(idPractica) {
    const token = sessionStorage.getItem('token');

    const respuesta = await fetch(
        `${API_URL}/turnos/medicos/practica/${idPractica}`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(
            datos.error || 'Error al cargar los médicos'
        );
    }

    return datos;
}


async function obtenerDisponibilidadesMedicoAPI(matricula) {
    const token = sessionStorage.getItem('token');

    const respuesta = await fetch(
        `${API_URL}/turnos/medicos/${matricula}/disponibilidades`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(
            datos.error || 'Error al obtener disponibilidades'
        );
    }

    return datos;
}


async function obtenerMisTurnosAPI() {
    const token = sessionStorage.getItem('token');

    const respuesta = await fetch(
        `${API_URL}/turnos/mis-turnos`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(
            datos.error || 'Error al obtener mis turnos'
        );
    }

    return datos;
}


 // ==============================
 // OBTENER TODAS LAS PRÁCTICAS
 // ==============================
async function obtenerPracticasAPI() {
    const token = sessionStorage.getItem('token');

    const respuesta = await fetch(
        `${API_URL}/turnos/practicas`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(
            datos.error || 'Error al obtener las prácticas'
        );
    }

    return datos;
}

// ==============================
// OBTENER EQUIPOS POR PRÁCTICA
// ==============================
async function obtenerEquiposPorPracticaAPI(idPractica) {
    const token = sessionStorage.getItem('token');

    const respuesta = await fetch(
        `${API_URL}/turnos/practicas/${idPractica}/equipos`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(
            datos.error || 'Error al obtener los equipos'
        );
    }

    return datos;
}
