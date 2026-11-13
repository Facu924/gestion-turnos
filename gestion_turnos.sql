-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 13-11-2026 a las 16:27:54
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `gestion_turnos`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `disponibilidad`
--

CREATE TABLE `disponibilidad` (
  `id_disponibilidad` int(11) NOT NULL,
  `dia` varchar(15) NOT NULL,
  `hora_desde` time NOT NULL,
  `hora_hasta` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `equipo`
--

CREATE TABLE `equipo` (
  `id_equipo` int(11) NOT NULL,
  `nombre_equipo` varchar(100) NOT NULL,
  `id_servicio` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medico`
--

CREATE TABLE `medico` (
  `matricula_medico` int(11) NOT NULL,
  `apellido_medico` varchar(50) NOT NULL,
  `nombre_medico` varchar(50) NOT NULL,
  `tel_medico` varchar(30) DEFAULT NULL,
  `matricula_supervisor` int(11) DEFAULT NULL,
  `id_servicio` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medico_disponibilidad`
--

CREATE TABLE `medico_disponibilidad` (
  `matricula_medico` int(11) NOT NULL,
  `id_disponibilidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `obra_social`
--

CREATE TABLE `obra_social` (
  `id_os` int(11) NOT NULL,
  `nombre_os` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `os_practica`
--

CREATE TABLE `os_practica` (
  `id_os` int(11) NOT NULL,
  `id_practica` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `paciente`
--

CREATE TABLE `paciente` (
  `dni_paciente` int(11) NOT NULL,
  `nombre_paciente` varchar(50) NOT NULL,
  `apellido_paciente` varchar(50) NOT NULL,
  `fec_nac_paciente` date NOT NULL,
  `email_paciente` varchar(50) DEFAULT NULL,
  `nro_afiliado_paciente` int(11) DEFAULT NULL,
  `id_os` int(11) DEFAULT NULL,
  `tel_paciente` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `practica`
--

CREATE TABLE `practica` (
  `id_practica` int(11) NOT NULL,
  `nombre_practica` varchar(100) NOT NULL,
  `id_servicio` int(11) NOT NULL,
  `duracion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `practica_equipo`
--

CREATE TABLE `practica_equipo` (
  `id_practica` int(11) NOT NULL,
  `id_equipo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `practica_medico`
--

CREATE TABLE `practica_medico` (
  `matricula_medico` int(11) NOT NULL,
  `id_practica` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registra`
--

CREATE TABLE `registra` (
  `matricula_medico` int(11) NOT NULL,
  `id_turno` int(11) NOT NULL,
  `id_disponibilidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `id_rol` int(11) NOT NULL,
  `nombre_rol` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicio`
--

CREATE TABLE `servicio` (
  `id_servicio` int(11) NOT NULL,
  `nombre_servicio` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `token_cuenta`
--

CREATE TABLE `token_cuenta` (
  `id_token` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `token_hash` char(64) NOT NULL,
  `tipo` enum('VERIFICACION_EMAIL','RECUPERACION_PASSWORD') NOT NULL,
  `fecha_expiracion` datetime NOT NULL,
  `usado` tinyint(1) NOT NULL DEFAULT 0,
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `turno`
--

CREATE TABLE `turno` (
  `id_turno` int(11) NOT NULL,
  `fecha_turno` date NOT NULL,
  `hora_turno` time NOT NULL,
  `medio_solicitado` varchar(50) DEFAULT NULL,
  `estado_turno` varchar(30) DEFAULT NULL,
  `fecha_confirmacion` datetime DEFAULT NULL,
  `medico_confirmacion` int(11) DEFAULT NULL,
  `dni_paciente` int(11) NOT NULL,
  `id_practica` int(11) NOT NULL,
  `id_equipo` int(11) DEFAULT NULL,
  `id_disponibilidad` int(11) DEFAULT NULL,
  `matricula_medico` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `id_rol` int(11) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `dni_paciente` int(11) DEFAULT NULL,
  `matricula_medico` int(11) DEFAULT NULL,
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp(),
  `email_verificado` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `disponibilidad`
--
ALTER TABLE `disponibilidad`
  ADD PRIMARY KEY (`id_disponibilidad`);

--
-- Indices de la tabla `equipo`
--
ALTER TABLE `equipo`
  ADD PRIMARY KEY (`id_equipo`),
  ADD KEY `fk_equipo_servicio` (`id_servicio`);

--
-- Indices de la tabla `medico`
--
ALTER TABLE `medico`
  ADD PRIMARY KEY (`matricula_medico`),
  ADD KEY `fk_medico_supervisor` (`matricula_supervisor`),
  ADD KEY `fk_medico_servicio` (`id_servicio`);

--
-- Indices de la tabla `medico_disponibilidad`
--
ALTER TABLE `medico_disponibilidad`
  ADD PRIMARY KEY (`matricula_medico`,`id_disponibilidad`),
  ADD KEY `fk_md_disponibilidad` (`id_disponibilidad`);

--
-- Indices de la tabla `obra_social`
--
ALTER TABLE `obra_social`
  ADD PRIMARY KEY (`id_os`);

--
-- Indices de la tabla `os_practica`
--
ALTER TABLE `os_practica`
  ADD PRIMARY KEY (`id_os`,`id_practica`),
  ADD KEY `fk_op_practica` (`id_practica`);

--
-- Indices de la tabla `paciente`
--
ALTER TABLE `paciente`
  ADD PRIMARY KEY (`dni_paciente`),
  ADD UNIQUE KEY `email_paciente` (`email_paciente`),
  ADD UNIQUE KEY `nro_afiliado_paciente` (`nro_afiliado_paciente`),
  ADD KEY `fk_paciente_obra_social` (`id_os`);

--
-- Indices de la tabla `practica`
--
ALTER TABLE `practica`
  ADD PRIMARY KEY (`id_practica`),
  ADD KEY `fk_practica_servicio` (`id_servicio`);

--
-- Indices de la tabla `practica_equipo`
--
ALTER TABLE `practica_equipo`
  ADD PRIMARY KEY (`id_practica`,`id_equipo`),
  ADD KEY `fk_pe_equipo` (`id_equipo`);

--
-- Indices de la tabla `practica_medico`
--
ALTER TABLE `practica_medico`
  ADD PRIMARY KEY (`matricula_medico`,`id_practica`),
  ADD KEY `fk_pm_practica` (`id_practica`);

--
-- Indices de la tabla `registra`
--
ALTER TABLE `registra`
  ADD PRIMARY KEY (`matricula_medico`,`id_turno`,`id_disponibilidad`),
  ADD KEY `id_turno` (`id_turno`),
  ADD KEY `id_disponibilidad` (`id_disponibilidad`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`id_rol`),
  ADD UNIQUE KEY `uk_rol_nombre` (`nombre_rol`);

--
-- Indices de la tabla `servicio`
--
ALTER TABLE `servicio`
  ADD PRIMARY KEY (`id_servicio`);

--
-- Indices de la tabla `token_cuenta`
--
ALTER TABLE `token_cuenta`
  ADD PRIMARY KEY (`id_token`),
  ADD UNIQUE KEY `token_hash` (`token_hash`),
  ADD KEY `fk_token_usuario` (`id_usuario`);

--
-- Indices de la tabla `turno`
--
ALTER TABLE `turno`
  ADD PRIMARY KEY (`id_turno`),
  ADD KEY `fk_turno_paciente` (`dni_paciente`),
  ADD KEY `fk_turno_practica` (`id_practica`),
  ADD KEY `fk_turno_equipo` (`id_equipo`),
  ADD KEY `fk_turno_disponibilidad` (`id_disponibilidad`),
  ADD KEY `fk_turno_medico_confirmacion` (`medico_confirmacion`),
  ADD KEY `fk_turno_medico` (`matricula_medico`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `uk_usuario_email` (`email`),
  ADD UNIQUE KEY `uk_usuario_paciente` (`dni_paciente`),
  ADD UNIQUE KEY `uk_usuario_medico` (`matricula_medico`),
  ADD KEY `fk_usuario_rol` (`id_rol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `disponibilidad`
--
ALTER TABLE `disponibilidad`
  MODIFY `id_disponibilidad` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `equipo`
--
ALTER TABLE `equipo`
  MODIFY `id_equipo` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `obra_social`
--
ALTER TABLE `obra_social`
  MODIFY `id_os` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `practica`
--
ALTER TABLE `practica`
  MODIFY `id_practica` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `servicio`
--
ALTER TABLE `servicio`
  MODIFY `id_servicio` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `token_cuenta`
--
ALTER TABLE `token_cuenta`
  MODIFY `id_token` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `turno`
--
ALTER TABLE `turno`
  MODIFY `id_turno` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `equipo`
--
ALTER TABLE `equipo`
  ADD CONSTRAINT `fk_equipo_servicio` FOREIGN KEY (`id_servicio`) REFERENCES `servicio` (`id_servicio`);

--
-- Filtros para la tabla `medico`
--
ALTER TABLE `medico`
  ADD CONSTRAINT `fk_medico_servicio` FOREIGN KEY (`id_servicio`) REFERENCES `servicio` (`id_servicio`),
  ADD CONSTRAINT `fk_medico_supervisor` FOREIGN KEY (`matricula_supervisor`) REFERENCES `medico` (`matricula_medico`);

--
-- Filtros para la tabla `medico_disponibilidad`
--
ALTER TABLE `medico_disponibilidad`
  ADD CONSTRAINT `fk_md_disponibilidad` FOREIGN KEY (`id_disponibilidad`) REFERENCES `disponibilidad` (`id_disponibilidad`),
  ADD CONSTRAINT `fk_md_medico` FOREIGN KEY (`matricula_medico`) REFERENCES `medico` (`matricula_medico`);

--
-- Filtros para la tabla `os_practica`
--
ALTER TABLE `os_practica`
  ADD CONSTRAINT `fk_op_obra_social` FOREIGN KEY (`id_os`) REFERENCES `obra_social` (`id_os`),
  ADD CONSTRAINT `fk_op_practica` FOREIGN KEY (`id_practica`) REFERENCES `practica` (`id_practica`);

--
-- Filtros para la tabla `paciente`
--
ALTER TABLE `paciente`
  ADD CONSTRAINT `fk_paciente_obra_social` FOREIGN KEY (`id_os`) REFERENCES `obra_social` (`id_os`);

--
-- Filtros para la tabla `practica`
--
ALTER TABLE `practica`
  ADD CONSTRAINT `fk_practica_servicio` FOREIGN KEY (`id_servicio`) REFERENCES `servicio` (`id_servicio`);

--
-- Filtros para la tabla `practica_equipo`
--
ALTER TABLE `practica_equipo`
  ADD CONSTRAINT `fk_pe_equipo` FOREIGN KEY (`id_equipo`) REFERENCES `equipo` (`id_equipo`),
  ADD CONSTRAINT `fk_pe_practica` FOREIGN KEY (`id_practica`) REFERENCES `practica` (`id_practica`);

--
-- Filtros para la tabla `practica_medico`
--
ALTER TABLE `practica_medico`
  ADD CONSTRAINT `fk_pm_medico` FOREIGN KEY (`matricula_medico`) REFERENCES `medico` (`matricula_medico`),
  ADD CONSTRAINT `fk_pm_practica` FOREIGN KEY (`id_practica`) REFERENCES `practica` (`id_practica`);

--
-- Filtros para la tabla `registra`
--
ALTER TABLE `registra`
  ADD CONSTRAINT `registra_ibfk_1` FOREIGN KEY (`matricula_medico`) REFERENCES `medico` (`matricula_medico`),
  ADD CONSTRAINT `registra_ibfk_2` FOREIGN KEY (`id_turno`) REFERENCES `turno` (`id_turno`),
  ADD CONSTRAINT `registra_ibfk_3` FOREIGN KEY (`id_disponibilidad`) REFERENCES `disponibilidad` (`id_disponibilidad`);

--
-- Filtros para la tabla `token_cuenta`
--
ALTER TABLE `token_cuenta`
  ADD CONSTRAINT `fk_token_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `turno`
--
ALTER TABLE `turno`
  ADD CONSTRAINT `fk_turno_disponibilidad` FOREIGN KEY (`id_disponibilidad`) REFERENCES `disponibilidad` (`id_disponibilidad`),
  ADD CONSTRAINT `fk_turno_equipo` FOREIGN KEY (`id_equipo`) REFERENCES `equipo` (`id_equipo`),
  ADD CONSTRAINT `fk_turno_medico` FOREIGN KEY (`matricula_medico`) REFERENCES `medico` (`matricula_medico`),
  ADD CONSTRAINT `fk_turno_medico_confirmacion` FOREIGN KEY (`medico_confirmacion`) REFERENCES `medico` (`matricula_medico`),
  ADD CONSTRAINT `fk_turno_paciente` FOREIGN KEY (`dni_paciente`) REFERENCES `paciente` (`dni_paciente`),
  ADD CONSTRAINT `fk_turno_practica` FOREIGN KEY (`id_practica`) REFERENCES `practica` (`id_practica`);

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `fk_usuario_medico` FOREIGN KEY (`matricula_medico`) REFERENCES `medico` (`matricula_medico`),
  ADD CONSTRAINT `fk_usuario_paciente` FOREIGN KEY (`dni_paciente`) REFERENCES `paciente` (`dni_paciente`),
  ADD CONSTRAINT `fk_usuario_rol` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
