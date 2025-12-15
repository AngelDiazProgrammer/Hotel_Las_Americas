-- =========================================
-- Inicialización PostgreSQL - Hotel Las Americas
-- =========================================

-- Crear tablas de catálogos
CREATE TABLE IF NOT EXISTS dom_tipos_documento (
    id_tipo_documento SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS dom_estados_huesped (
    id_estado_huesped SERIAL PRIMARY KEY,
    estado VARCHAR(50) NOT NULL,
    descripcion VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS dom_tipos_habitacion (
    id_tipo_habitacion SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(100),
    precio_base NUMERIC(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS dom_estados_habitacion (
    id_estado_habitacion SERIAL PRIMARY KEY,
    estado VARCHAR(50) NOT NULL,
    descripcion VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS dom_estados_reserva (
    id_estado_reserva SERIAL PRIMARY KEY,
    estado VARCHAR(50) NOT NULL,
    descripcion VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS dom_roles (
    id_rol SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL,
    descripcion VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS dom_servicios (
    id_servicio SERIAL PRIMARY KEY,
    nombre_servicio VARCHAR(100) NOT NULL,
    descripcion VARCHAR(200),
    precio NUMERIC(8,2) NOT NULL,
    activo BOOLEAN DEFAULT TRUE
);

-- =========================================
-- Tablas principales
-- =========================================

CREATE TABLE IF NOT EXISTS huespedes (
    id_huesped SERIAL PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    id_tipo_documento INT NOT NULL REFERENCES dom_tipos_documento(id_tipo_documento),
    documento VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100),
    telefono VARCHAR(20),
    direccion VARCHAR(200),
    id_estado_huesped INT DEFAULT 1 REFERENCES dom_estados_huesped(id_estado_huesped),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS habitaciones (
    id_habitacion SERIAL PRIMARY KEY,
    numero_habitacion VARCHAR(10) NOT NULL UNIQUE,
    id_tipo_habitacion INT NOT NULL REFERENCES dom_tipos_habitacion(id_tipo_habitacion),
    piso INT,
    capacidad INT NOT NULL,
    caracteristicas TEXT,
    id_estado_habitacion INT DEFAULT 1 REFERENCES dom_estados_habitacion(id_estado_habitacion),
    precio_noche NUMERIC(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    id_rol INT NOT NULL REFERENCES dom_roles(id_rol),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reservas (
    id_reserva SERIAL PRIMARY KEY,
    id_huesped INT NOT NULL REFERENCES huespedes(id_huesped),
    id_habitacion INT NOT NULL REFERENCES habitaciones(id_habitacion),
    fecha_entrada DATE NOT NULL,
    fecha_salida DATE NOT NULL,
    fecha_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_estado_reserva INT NOT NULL REFERENCES dom_estados_reserva(id_estado_reserva),
    id_usuario_crea INT NOT NULL REFERENCES usuarios(id_usuario),
    observaciones TEXT,
    total_estimado NUMERIC(10,2)
);

CREATE TABLE IF NOT EXISTS facturas (
    id_factura SERIAL PRIMARY KEY,
    id_reserva INT NOT NULL REFERENCES reservas(id_reserva),
    numero_factura VARCHAR(20) NOT NULL UNIQUE,
    fecha_emision TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subtotal NUMERIC(10,2) NOT NULL,
    impuestos NUMERIC(10,2) NOT NULL,
    total NUMERIC(10,2) NOT NULL,
    id_usuario_emite INT NOT NULL REFERENCES usuarios(id_usuario)
);

CREATE TABLE IF NOT EXISTS cargos (
    id_cargo SERIAL PRIMARY KEY,
    id_reserva INT NOT NULL REFERENCES reservas(id_reserva),
    id_servicio INT REFERENCES dom_servicios(id_servicio),
    descripcion VARCHAR(200) NOT NULL,
    cantidad INT DEFAULT 1,
    precio_unitario NUMERIC(8,2) NOT NULL,
    total NUMERIC(8,2) NOT NULL,
    fecha_cargo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_usuario_registra INT NOT NULL REFERENCES usuarios(id_usuario)
);

CREATE TABLE IF NOT EXISTS pagos (
    id_pago SERIAL PRIMARY KEY,
    id_reserva INT NOT NULL REFERENCES reservas(id_reserva),
    id_factura INT REFERENCES facturas(id_factura),
    monto NUMERIC(10,2) NOT NULL,
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metodo_pago VARCHAR(50),
    referencia VARCHAR(100),
    id_usuario_registra INT NOT NULL REFERENCES usuarios(id_usuario)
);

CREATE TABLE IF NOT EXISTS auditoria (
    id_auditoria SERIAL PRIMARY KEY,
    tabla_afectada VARCHAR(50) NOT NULL,
    accion VARCHAR(20) NOT NULL,
    id_registro INT,
    datos_anteriores TEXT,
    datos_nuevos TEXT,
    id_usuario INT NOT NULL REFERENCES usuarios(id_usuario),
    fecha_accion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- Datos iniciales
-- =========================================

INSERT INTO dom_tipos_documento (nombre, descripcion) VALUES
('Cedula', 'Documento nacional de identidad'),
('Pasaporte', 'Documento para extranjeros'),
('DNI', 'Documento de identidad extranjero');

INSERT INTO dom_estados_huesped (estado, descripcion) VALUES
('Activo', 'Huesped con reserva activa'),
('En deuda', 'Huesped con pagos pendientes'),
('En estadia', 'Huesped actualmente en el hotel'),
('Salida', 'Huesped que ya realizo check-out');

INSERT INTO dom_tipos_habitacion (nombre, descripcion, precio_base) VALUES
('Sencilla', 'Habitacion individual', 80.00),
('Doble', 'Habitacion doble', 120.00),
('Suite', 'Suite con amenities', 200.00),
('Familiar', 'Habitacion familiar', 150.00);

INSERT INTO dom_estados_habitacion (estado, descripcion) VALUES
('Disponible', 'Disponible'),
('Ocupada', 'Ocupada'),
('Mantenimiento', 'En mantenimiento'),
('Limpieza', 'En limpieza');

INSERT INTO dom_estados_reserva (estado, descripcion) VALUES
('Pendiente', 'Pendiente'),
('Confirmada', 'Confirmada'),
('En curso', 'En estadia'),
('Completada', 'Finalizada'),
('Cancelada', 'Cancelada');

INSERT INTO dom_roles (nombre_rol, descripcion) VALUES
('Administrador', 'Acceso total'),
('Recepcionista', 'Gestion diaria'),
('Gerente', 'Reportes');

INSERT INTO dom_servicios (nombre_servicio, descripcion, precio) VALUES
('Lavanderia', 'Lavado por kg', 15.00),
('Room Service', 'Comida a la habitacion', 25.00),
('Parqueadero', 'Por noche', 10.00),
('Minibar', 'Consumos', 0.00),
('SPA', 'Spa y masajes', 50.00);

INSERT INTO usuarios (nombre_usuario, contrasena, nombres, apellidos, email, id_rol) VALUES
('admin', '123456', 'Admin', 'Sistema', 'admin@hotelamericas.com', 1),
('sara', '12345', 'Sara', 'Martinez', 'sara@hotelamericas.com', 2),
('ema', '12345', 'Ema', 'Rodriguez', 'ema@hotelamericas.com', 2),
('angel', '12345', 'Angel', 'Lopez', 'angel@hotelamericas.com', 2),
('daniel', '$2a$12$VFnHigzjeYomhCrOHjmwxuLT9.RcD5.A4OrZy8mNh0zQcCf5XB1dy', 'Daniel', 'Perez', 'daniel@hotelamericas.com', 3);
('Administrador', 'Admin123', 'Administrador', 'Hotel', 'administrador@hotelamericas.com', 3);
