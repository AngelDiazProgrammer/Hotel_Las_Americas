-- Script de inicializacion para Docker - Hotel Las Americas
PRINT 'Starting database initialization...';

-- Crear base de datos si no existe
IF NOT EXISTS(SELECT name FROM sys.databases WHERE name = 'HotelLasAmericas')
BEGIN
    CREATE DATABASE HotelLasAmericas;
    PRINT 'Database HotelLasAmericas created successfully';
END
ELSE
BEGIN
    PRINT 'Database HotelLasAmericas already exists';
END
GO

USE HotelLasAmericas;
GO

-- Tablas de catalogos
CREATE TABLE dom_tipos_documento (
    id_tipo_documento INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(100)
);

CREATE TABLE dom_estados_huesped (
    id_estado_huesped INT IDENTITY(1,1) PRIMARY KEY,
    estado VARCHAR(50) NOT NULL,
    descripcion VARCHAR(100)
);

CREATE TABLE dom_tipos_habitacion (
    id_tipo_habitacion INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(100),
    precio_base DECIMAL(10,2) NOT NULL
);

CREATE TABLE dom_estados_habitacion (
    id_estado_habitacion INT IDENTITY(1,1) PRIMARY KEY,
    estado VARCHAR(50) NOT NULL,
    descripcion VARCHAR(100)
);

CREATE TABLE dom_estados_reserva (
    id_estado_reserva INT IDENTITY(1,1) PRIMARY KEY,
    estado VARCHAR(50) NOT NULL,
    descripcion VARCHAR(100)
);

CREATE TABLE dom_roles (
    id_rol INT IDENTITY(1,1) PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL,
    descripcion VARCHAR(100)
);

CREATE TABLE dom_servicios (
    id_servicio INT IDENTITY(1,1) PRIMARY KEY,
    nombre_servicio VARCHAR(100) NOT NULL,
    descripcion VARCHAR(200),
    precio DECIMAL(8,2) NOT NULL,
    activo BIT DEFAULT 1
);

-- Tablas principales
CREATE TABLE huespedes (
    id_huesped INT IDENTITY(1,1) PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    id_tipo_documento INT NOT NULL,
    documento VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100),
    telefono VARCHAR(20),
    direccion VARCHAR(200),
    id_estado_huesped INT DEFAULT 1,
    fecha_registro DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (id_tipo_documento) REFERENCES dom_tipos_documento(id_tipo_documento),
    FOREIGN KEY (id_estado_huesped) REFERENCES dom_estados_huesped(id_estado_huesped)
);

CREATE TABLE habitaciones (
    id_habitacion INT IDENTITY(1,1) PRIMARY KEY,
    numero_habitacion VARCHAR(10) NOT NULL UNIQUE,
    id_tipo_habitacion INT NOT NULL,
    piso INT,
    capacidad INT NOT NULL,
    caracteristicas TEXT,
    id_estado_habitacion INT DEFAULT 1,
    precio_noche DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_tipo_habitacion) REFERENCES dom_tipos_habitacion(id_tipo_habitacion),
    FOREIGN KEY (id_estado_habitacion) REFERENCES dom_estados_habitacion(id_estado_habitacion)
);

CREATE TABLE usuarios (
    id_usuario INT IDENTITY(1,1) PRIMARY KEY,
    nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    id_rol INT NOT NULL,
    activo BIT DEFAULT 1,
    fecha_creacion DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (id_rol) REFERENCES dom_roles(id_rol)
);

CREATE TABLE reservas (
    id_reserva INT IDENTITY(1,1) PRIMARY KEY,
    id_huesped INT NOT NULL,
    id_habitacion INT NOT NULL,
    fecha_entrada DATE NOT NULL,
    fecha_salida DATE NOT NULL,
    fecha_reserva DATETIME DEFAULT GETDATE(),
    id_estado_reserva INT NOT NULL,
    id_usuario_crea INT NOT NULL,
    observaciones TEXT,
    total_estimado DECIMAL(10,2),
    FOREIGN KEY (id_huesped) REFERENCES huespedes(id_huesped),
    FOREIGN KEY (id_habitacion) REFERENCES habitaciones(id_habitacion),
    FOREIGN KEY (id_estado_reserva) REFERENCES dom_estados_reserva(id_estado_reserva),
    FOREIGN KEY (id_usuario_crea) REFERENCES usuarios(id_usuario)
);

CREATE TABLE facturas (
    id_factura INT IDENTITY(1,1) PRIMARY KEY,
    id_reserva INT NOT NULL,
    numero_factura VARCHAR(20) NOT NULL UNIQUE,
    fecha_emision DATETIME DEFAULT GETDATE(),
    subtotal DECIMAL(10,2) NOT NULL,
    impuestos DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    id_usuario_emite INT NOT NULL,
    FOREIGN KEY (id_reserva) REFERENCES reservas(id_reserva),
    FOREIGN KEY (id_usuario_emite) REFERENCES usuarios(id_usuario)
);

CREATE TABLE cargos (
    id_cargo INT IDENTITY(1,1) PRIMARY KEY,
    id_reserva INT NOT NULL,
    id_servicio INT,
    descripcion VARCHAR(200) NOT NULL,
    cantidad INT DEFAULT 1,
    precio_unitario DECIMAL(8,2) NOT NULL,
    total DECIMAL(8,2) NOT NULL,
    fecha_cargo DATETIME DEFAULT GETDATE(),
    id_usuario_registra INT NOT NULL,
    FOREIGN KEY (id_reserva) REFERENCES reservas(id_reserva),
    FOREIGN KEY (id_servicio) REFERENCES dom_servicios(id_servicio),
    FOREIGN KEY (id_usuario_registra) REFERENCES usuarios(id_usuario)
);

CREATE TABLE pagos (
    id_pago INT IDENTITY(1,1) PRIMARY KEY,
    id_reserva INT NOT NULL,
    id_factura INT,
    monto DECIMAL(10,2) NOT NULL,
    fecha_pago DATETIME DEFAULT GETDATE(),
    metodo_pago VARCHAR(50),
    referencia VARCHAR(100),
    id_usuario_registra INT NOT NULL,
    FOREIGN KEY (id_reserva) REFERENCES reservas(id_reserva),
    FOREIGN KEY (id_factura) REFERENCES facturas(id_factura),
    FOREIGN KEY (id_usuario_registra) REFERENCES usuarios(id_usuario)
);

CREATE TABLE auditoria (
    id_auditoria INT IDENTITY(1,1) PRIMARY KEY,
    tabla_afectada VARCHAR(50) NOT NULL,
    accion VARCHAR(20) NOT NULL,
    id_registro INT,
    datos_anteriores TEXT,
    datos_nuevos TEXT,
    id_usuario INT NOT NULL,
    fecha_accion DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- Insertar datos de catalogos
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
('Sencilla', 'Habitacion individual con cama sencilla', 80.00),
('Doble', 'Habitacion con cama doble o dos camas', 120.00),
('Suite', 'Suite con area separada y amenities', 200.00),
('Familiar', 'Habitacion para 4 personas', 150.00);

INSERT INTO dom_estados_habitacion (estado, descripcion) VALUES
('Disponible', 'Habitacion disponible para reserva'),
('Ocupada', 'Habitacion actualmente ocupada'),
('Mantenimiento', 'Habitacion en mantenimiento'),
('Limpieza', 'Habitacion en proceso de limpieza');

INSERT INTO dom_estados_reserva (estado, descripcion) VALUES
('Pendiente', 'Reserva pendiente de check-in'),
('Confirmada', 'Reserva confirmada'),
('En curso', 'Huesped en estadia'),
('Completada', 'Estadia finalizada'),
('Cancelada', 'Reserva cancelada');

INSERT INTO dom_roles (nombre_rol, descripcion) VALUES
('Administrador', 'Acceso completo al sistema'),
('Recepcionista', 'Gestion de reservas y check-in/out'),
('Gerente', 'Supervision y reportes');

INSERT INTO dom_servicios (nombre_servicio, descripcion, precio) VALUES
('Lavanderia', 'Servicio de lavanderia por kg', 15.00),
('Room Service', 'Servicio de comida a la habitacion', 25.00),
('Parqueadero', 'Servicio de parqueadero por noche', 10.00),
('Minibar', 'Consumo de minibar', 0.00),
('SPA', 'Servicio de spa y masajes', 50.00);

-- Crear usuarios
INSERT INTO usuarios (nombre_usuario, contrasena, nombres, apellidos, email, id_rol) VALUES 
('admin', '123456', 'Admin', 'Sistema', 'admin@hotelamericas.com', 1),
('sara', '123456', 'Sara', 'Martinez', 'sara@hotelamericas.com', 2),
('ema', '123456', 'Ema', 'Rodriguez', 'ema@hotelamericas.com', 2),
('angel', '123456', 'Angel', 'Lopez', 'angel@hotelamericas.com', 2),
('daniel', '123456', 'Daniel', 'Perez', 'daniel@hotelamericas.com', 3);

-- Crear huespedes de prueba
INSERT INTO huespedes (nombres, apellidos, id_tipo_documento, documento, email, telefono, direccion, id_estado_huesped) VALUES
('Carlos', 'Ramirez', 1, '123456789', 'carlos@email.com', '3001234567', 'Calle 123 #45-67', 1),
('Ana', 'Gomez', 1, '987654321', 'ana@email.com', '3109876543', 'Av. Principal #78-90', 1),
('Roberto', 'Silva', 2, 'AB123456', 'roberto@email.com', '3205558888', 'Carrera 56 #12-34', 1),
('Laura', 'Diaz', 1, '456789123', 'laura@email.com', '3154447777', 'Diagonal 89 #23-45', 1);

-- Crear habitaciones de prueba
INSERT INTO habitaciones (numero_habitacion, id_tipo_habitacion, piso, capacidad, caracteristicas, precio_noche) VALUES
('101', 1, 1, 2, 'Vista al jardin, TV cable, A/C', 85.00),
('102', 1, 1, 2, 'Vista al jardin, TV cable, A/C', 85.00),
('201', 2, 2, 3, 'Vista a la piscina, minibar, A/C', 130.00),
('202', 2, 2, 3, 'Vista a la piscina, minibar, A/C', 130.00),
('301', 3, 3, 2, 'Suite ejecutiva, jacuzzi, balcon', 220.00),
('302', 4, 3, 4, 'Habitacion familiar, 2 camas dobles', 160.00);

PRINT 'Database HotelLasAmericas initialized successfully with test data';
GO
