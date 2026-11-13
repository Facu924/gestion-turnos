 
# Sistema de Gestión de Turnos Médicos

Proyecto desarrollado para la materia Programación III.

## Descripción

Aplicación web para gestionar turnos médicos, desarrollada con Node.js, Express, MySQL, HTML, CSS y JavaScript.

El sistema permite registrar, consultar y cancelar turnos, aplicando validaciones para evitar conflictos de horarios y asignaciones.

## Funcionalidades

- Inicio de sesión mediante JWT.
- Tres perfiles: administrador, médico y paciente.
- Consulta de turnos según el perfil.
- Registro y cancelación de turnos por administradores.
- Selección de prácticas médicas.
- Selección de médicos según la práctica.
- Consulta de disponibilidades médicas.
- Selección de equipos compatibles.
- Validación de superposición de horarios.
- Validación de duración de las prácticas.
- Protección de rutas según el rol del usuario.
- Cierre de sesión.

## Tecnologías utilizadas

- Node.js
- Express
- MySQL
- JavaScript
- HTML5
- CSS3
- JWT
- bcrypt

## Requisitos

- Node.js instalado.
- XAMPP o un servidor MySQL compatible.
- Base de datos `gestion_turnos`.
- Variables de entorno configuradas para conectar el backend.

## Instalación

1. Clonar el repositorio.
2. Instalar las dependencias del backend con `npm install`.
3. Crear e importar la base de datos MySQL.
4. Configurar las variables de entorno necesarias.
5. Iniciar el servidor Node.js.
6. Abrir el frontend en el navegador.

## Perfiles del sistema

**Administrador:** puede consultar, registrar, modificar y cancelar turnos.

**Médico:** puede consultar sus turnos asignados.

**Paciente:** puede consultar sus propios turnos.

## Validaciones

El backend controla que:

- No se registren turnos en fechas pasadas.
- No existan superposiciones de turnos.
- Los equipos estén disponibles.
- Los turnos respeten los horarios de atención del médico.
- La duración de la práctica sea compatible con el horario disponible.
- Los usuarios no accedan a operaciones fuera de sus permisos.

## Trabajo académico

Proyecto correspondiente al segundo parcial de Programación III.
