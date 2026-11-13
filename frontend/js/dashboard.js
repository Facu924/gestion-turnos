
const token = sessionStorage.getItem('token');
const usuarioGuardado = sessionStorage.getItem('usuario');

// Verificar la sesión al volver al dashboard
window.addEventListener('pageshow', function () {
    const tokenActual = sessionStorage.getItem('token');
    const usuarioActual = sessionStorage.getItem('usuario');

    if (!tokenActual || !usuarioActual) {
        window.location.replace('../index.html');
    }
});

// ==============================
// VERIFICAR SESIÓN
// ==============================

if (!token || !usuarioGuardado) {
    sessionStorage.clear();
    window.location.replace('../index.html');

} else {
    iniciarDashboard();
}

function iniciarDashboard() {

    let usuarioActual;

    try {
        usuarioActual = JSON.parse(usuarioGuardado);
    } catch (error) {
        sessionStorage.clear();
        window.location.replace('../index.html');
        return;
    }

    const rolActual = Number(usuarioActual.id_rol);

    const roles = {
        1: 'Administrador',
        2: 'Médico',
        3: 'Paciente'
    };

    if (!roles[rolActual]) {
        sessionStorage.clear();
        window.location.replace('../index.html');
        return;
    }

    // ==============================
    // MOSTRAR USUARIO Y PERFIL
    // ==============================

    const datosUsuario = document.getElementById('datosUsuario');

    datosUsuario.textContent =
        `Usuario: ${usuarioActual.email} | Perfil: ${roles[rolActual]}`;

    // ==============================
    // ELEMENTOS DEL DASHBOARD
    // ==============================

    const linkInicio = document.getElementById('linkInicio');
    const linkNuevoTurno = document.getElementById('linkNuevoTurno');

    const seccionInicio = document.getElementById('seccionInicio');
    const seccionNuevoTurno = document.getElementById('seccionNuevoTurno');

    const tituloTurnos = document.getElementById('tituloTurnos');

    const formTurno = document.getElementById('formTurno');
    const mensajeTurno = document.getElementById('mensajeTurno');

    const selectPractica = document.getElementById('id_practica');
    const selectMedico = document.getElementById('matricula_medico');
    const selectDisponibilidad = document.getElementById('id_disponibilidad');
    const selectEquipo = document.getElementById('id_equipo');

    const tbody = document.getElementById('tablaTurnosBody');

    // ==============================
    // ADAPTAR PANEL SEGÚN PERFIL
    // ==============================

    if (rolActual === 1) {
        linkNuevoTurno.style.display = 'block';

        if (tituloTurnos) {
            tituloTurnos.textContent = 'Todos los Turnos';
        }

    } else if (rolActual === 2) {
        linkNuevoTurno.style.display = 'none';
        linkInicio.textContent = 'Mis Turnos';

        if (tituloTurnos) {
            tituloTurnos.textContent = 'Mis Turnos Asignados';
        }

    } else if (rolActual === 3) {
        linkNuevoTurno.style.display = 'none';
        linkInicio.textContent = 'Mis Turnos';

        if (tituloTurnos) {
            tituloTurnos.textContent = 'Mis Turnos';
        }
    }

    // ==============================
    // CERRAR SESIÓN
    // ==============================

    document.getElementById('cerrarSesion')
    .addEventListener('click', function (e) {

        e.preventDefault();

        sessionStorage.removeItem('token');
        sessionStorage.removeItem('usuario');

        window.location.replace('../index.html');
    });

    // ==============================
    // NAVEGACIÓN ENTRE SECCIONES
    // ==============================

    linkInicio.addEventListener('click', async function (e) {
        e.preventDefault();

        linkInicio.classList.add('activo');
        linkNuevoTurno.classList.remove('activo');

        seccionInicio.style.display = 'block';
        seccionNuevoTurno.style.display = 'none';

        await cargarTablaTurnos();
    });

    linkNuevoTurno.addEventListener('click', function (e) {
        e.preventDefault();

        // Solamente el administrador puede crear turnos
        if (rolActual !== 1) {
            return;
        }

        linkNuevoTurno.classList.add('activo');
        linkInicio.classList.remove('activo');

        seccionNuevoTurno.style.display = 'block';
        seccionInicio.style.display = 'none';
    });


    // ==============================
    // CARGAR PRÁCTICAS DESDE MYSQL
    // ==============================

    async function cargarPracticas() {
        selectPractica.disabled = true;
        selectPractica.innerHTML =
            '<option value="">Cargando prácticas...</option>';

        try {
            const practicas = await obtenerPracticasAPI();

            selectPractica.innerHTML =
                '<option value="">Seleccione práctica...</option>';

            practicas.forEach(function (practica) {
                const opcion = document.createElement('option');

                opcion.value = practica.id_practica;
                opcion.textContent = practica.nombre_practica;

                selectPractica.appendChild(opcion);
            });

            selectPractica.disabled = false;

        } catch (error) {
            console.error('Error al cargar prácticas:', error);

            selectPractica.innerHTML =
                '<option value="">Error al cargar prácticas</option>';

            mensajeTurno.textContent = error.message;
            mensajeTurno.style.color = 'red';
        }
    }


    // ==============================
    // CARGAR MÉDICOS POR PRÁCTICA
    // ==============================

    selectPractica.addEventListener('change', async function () {

        const idPractica = selectPractica.value;


        // Reiniciar los equipos
        selectEquipo.innerHTML =
            '<option value="">Seleccione equipo...</option>';

        selectEquipo.disabled = true;

        // Cargar equipos compatibles
        if (idPractica) {
            try {
                const equipos =
                    await obtenerEquiposPorPracticaAPI(idPractica);

                if (selectPractica.value !== idPractica) {
                    return;
                }

                equipos.forEach(function (equipo) {
                    const opcion = document.createElement('option');

                    opcion.value = equipo.id_equipo;
                    opcion.textContent =
                        `Equipo #${equipo.id_equipo}`;

                    selectEquipo.appendChild(opcion);
                });

                if (equipos.length === 0) {
                    selectEquipo.innerHTML =
                        '<option value="">No hay equipos compatibles</option>';
                } else {
                    selectEquipo.disabled = false;
                }

            } catch (error) {
                console.error('Error al cargar equipos:', error);

                selectEquipo.innerHTML =
                    '<option value="">Error al cargar equipos</option>';
            }
        }


        selectMedico.innerHTML =
            '<option value="">Seleccione médico...</option>';

        selectMedico.disabled = true;

        selectDisponibilidad.innerHTML =
            '<option value="">Seleccione un médico primero...</option>';

        selectDisponibilidad.disabled = true;

        if (!idPractica) {
            return;
        }

        try {
            const medicos =
                await obtenerMedicosPorPracticaAPI(idPractica);

            // Evitar mostrar resultados de una selección anterior
            if (selectPractica.value !== idPractica) {
                return;
            }

            medicos.forEach(function (medico) {

                const opcion = document.createElement('option');

                opcion.value = medico.matricula_medico;

                opcion.textContent =
                    `${medico.nombre_medico} ${medico.apellido_medico}`;

                selectMedico.appendChild(opcion);
            });

            if (medicos.length === 0) {
                selectMedico.innerHTML =
                    '<option value="">No hay médicos disponibles</option>';
            } else {
                selectMedico.disabled = false;
            }

        } catch (error) {
            console.error('Error al cargar médicos:', error);

            selectMedico.innerHTML =
                '<option value="">Error al cargar médicos</option>';

            mensajeTurno.textContent = error.message;
            mensajeTurno.style.color = 'red';
        }
    });

    // ==============================
    // CARGAR DISPONIBILIDADES
    // ==============================

    selectMedico.addEventListener('change', async function () {

        const matricula = selectMedico.value;

        selectDisponibilidad.innerHTML =
            '<option value="">Seleccione disponibilidad...</option>';

        selectDisponibilidad.disabled = true;

        if (!matricula) {
            return;
        }

        try {
            const disponibilidades =
                await obtenerDisponibilidadesMedicoAPI(matricula);

            if (selectMedico.value !== matricula) {
                return;
            }

            disponibilidades.forEach(function (disponibilidad) {

                const opcion = document.createElement('option');

                opcion.value = disponibilidad.id_disponibilidad;

                opcion.textContent =
                    `${disponibilidad.dia} - ` +
                    `${disponibilidad.hora_desde} a ` +
                    `${disponibilidad.hora_hasta}`;

                selectDisponibilidad.appendChild(opcion);
            });

            if (disponibilidades.length === 0) {
                selectDisponibilidad.innerHTML =
                    '<option value="">Sin disponibilidades registradas</option>';
            } else {
                selectDisponibilidad.disabled = false;
            }

        } catch (error) {
            console.error('Error al cargar disponibilidades:', error);

            selectDisponibilidad.innerHTML =
                '<option value="">Error al cargar disponibilidades</option>';

            mensajeTurno.textContent = error.message;
            mensajeTurno.style.color = 'red';
        }
    });

    // ==============================
    // CREAR NUEVO TURNO
    // ==============================

    formTurno.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (rolActual !== 1) {
            mensajeTurno.textContent =
                'No tenés permisos para crear turnos.';
            mensajeTurno.style.color = 'red';
            return;
        }

        mensajeTurno.textContent = '';

        const nuevoTurno = {
            dni_paciente:
                document.getElementById('dni_paciente').value,

            id_practica:
                document.getElementById('id_practica').value,

            matricula_medico:
                document.getElementById('matricula_medico').value,

            id_equipo:
                document.getElementById('id_equipo').value,

            fecha_turno:
                document.getElementById('fecha_turno').value,

            hora_turno:
                document.getElementById('hora_turno').value + ':00',

            medio_solicitado:
                document.getElementById('medio_solicitado').value,

            estado_turno: 'Reservado',

            id_disponibilidad:
                document.getElementById('id_disponibilidad').value
        };

        try {
            const resultado = await crearTurnoAPI(nuevoTurno);

            mensajeTurno.textContent =
                resultado.mensaje || '¡Turno registrado correctamente!';

            mensajeTurno.style.color = 'green';

            formTurno.reset();

            selectMedico.innerHTML =
                '<option value="">Seleccione médico...</option>';
            selectMedico.disabled = true;

            selectDisponibilidad.innerHTML =
                '<option value="">Seleccione un médico primero...</option>';
            selectDisponibilidad.disabled = true;

            setTimeout(function () {
                linkInicio.click();
            }, 1500);

        } catch (error) {
            mensajeTurno.textContent = error.message;
            mensajeTurno.style.color = 'red';
        }
    });

    // ==============================
    // CARGAR TABLA DE TURNOS
    // ==============================

    async function cargarTablaTurnos() {

        tbody.innerHTML =
            '<tr><td colspan="7" style="text-align:center;">Cargando turnos...</td></tr>';

        try {
            let turnos;

            if (rolActual === 1) {
                // Administrador: todos los turnos
                turnos = await obtenerTurnosAPI();

            } else if (rolActual === 2 || rolActual === 3) {
                // Médico y paciente: sus propios turnos
                turnos = await obtenerMisTurnosAPI();

            } else {
                throw new Error('Perfil de usuario no autorizado');
            }

            if (!Array.isArray(turnos)) {
                throw new Error('La API no devolvió una lista de turnos.');
            }

            if (turnos.length === 0) {
                tbody.innerHTML =
                    '<tr><td colspan="7" style="text-align:center;">No hay turnos registrados.</td></tr>';
                return;
            }

            tbody.innerHTML = '';

            turnos.forEach(function (t) {

                const fila = document.createElement('tr');

                // Formatear fecha sin desplazarla por zona horaria
                let fechaFormateada = '-';

                if (t.fecha_turno) {
                    const fechaTexto = String(t.fecha_turno);
                    const partes = fechaTexto.substring(0, 10).split('-');

                    if (partes.length === 3) {
                        fechaFormateada =
                            `${partes[2]}/${partes[1]}/${partes[0]}`;
                    } else {
                        fechaFormateada = fechaTexto;
                    }
                }

                const esCancelado = t.estado_turno === 'Cancelado';

                // Crear columnas de manera segura
                function agregarCelda(texto) {
                    const td = document.createElement('td');
                    td.textContent = texto ?? '-';
                    fila.appendChild(td);
                    return td;
                }

                agregarCelda(
                    `${fechaFormateada} ${t.hora_turno || ''}`
                );

                agregarCelda(t.dni_paciente);
                agregarCelda('-');
                agregarCelda(`Práctica #${t.id_practica}`);
                agregarCelda(`Equipo #${t.id_equipo}`);

                const celdaEstado = agregarCelda('');

                const estado = document.createElement('span');
                estado.className = `badge ${t.estado_turno}`;
                estado.textContent = t.estado_turno || '-';
                celdaEstado.appendChild(estado);

                const celdaAcciones = agregarCelda('');

                if (rolActual === 1) {

                    const botonCancelar = document.createElement('button');

                    botonCancelar.className = 'btn-cancelar';
                    botonCancelar.type = 'button';
                    botonCancelar.disabled = esCancelado;

                    botonCancelar.textContent =
                        esCancelado ? 'Cancelado' : 'Cancelar';

                    botonCancelar.addEventListener('click', function () {
                        cancelarTurnoFrontend(t.id_turno);
                    });

                    celdaAcciones.appendChild(botonCancelar);

                } else {
                    celdaAcciones.textContent = 'Solo consulta';
                }

                tbody.appendChild(fila);
            });

        } catch (error) {
            console.error('Error al cargar turnos:', error);

            tbody.innerHTML = '';

            const fila = document.createElement('tr');
            const celda = document.createElement('td');

            celda.colSpan = 7;
            celda.style.textAlign = 'center';
            celda.style.color = 'red';

            celda.textContent =
                `Error al cargar datos: ${error.message}`;

            fila.appendChild(celda);
            tbody.appendChild(fila);
        }
    }

    // ==============================
    // CANCELAR TURNO DESDE FRONTEND
    // ==============================

    async function cancelarTurnoFrontend(idTurno) {

        if (rolActual !== 1) {
            alert('No tenés permisos para cancelar turnos.');
            return;
        }

        const confirmar = confirm(
            `¿Estás seguro de que deseas cancelar el turno ID #${idTurno}?`
        );

        if (!confirmar) {
            return;
        }

        try {
            const respuesta = await fetch(
                `http://localhost:3000/api/turnos/${idTurno}/cancelar`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    datos.error || 'No se pudo cancelar el turno'
                );
            }

            alert(datos.mensaje || 'Turno cancelado exitosamente');

            await cargarTablaTurnos();

        } catch (error) {
            console.error('Error al cancelar turno:', error);
            alert(`Error: ${error.message}`);
        }
    }

    // ==============================
    // CARGA INICIAL
    // ==============================

    cargarTablaTurnos();

    if (rolActual === 1) {
        cargarPracticas();
    }
}
