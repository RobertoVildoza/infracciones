-- Marcas
INSERT INTO marca (nombre) SELECT 'Toyota' WHERE NOT EXISTS (SELECT 1 FROM marca WHERE nombre = 'Toyota');
INSERT INTO marca (nombre) SELECT 'Ford' WHERE NOT EXISTS (SELECT 1 FROM marca WHERE nombre = 'Ford');
INSERT INTO marca (nombre) SELECT 'Chevrolet' WHERE NOT EXISTS (SELECT 1 FROM marca WHERE nombre = 'Chevrolet');
INSERT INTO marca (nombre) SELECT 'Renault' WHERE NOT EXISTS (SELECT 1 FROM marca WHERE nombre = 'Renault');

-- Modelos
INSERT INTO modelo (nombre) SELECT 'Corolla' WHERE NOT EXISTS (SELECT 1 FROM modelo WHERE nombre = 'Corolla');
INSERT INTO modelo (nombre) SELECT 'Focus' WHERE NOT EXISTS (SELECT 1 FROM modelo WHERE nombre = 'Focus');
INSERT INTO modelo (nombre) SELECT 'Cruze' WHERE NOT EXISTS (SELECT 1 FROM modelo WHERE nombre = 'Cruze');
INSERT INTO modelo (nombre) SELECT 'Sandero' WHERE NOT EXISTS (SELECT 1 FROM modelo WHERE nombre = 'Sandero');
INSERT INTO modelo (nombre) SELECT 'Hilux' WHERE NOT EXISTS (SELECT 1 FROM modelo WHERE nombre = 'Hilux');

-- Tipos de Ruta
INSERT INTO tipo_ruta (nombre) SELECT 'Nacional' WHERE NOT EXISTS (SELECT 1 FROM tipo_ruta WHERE nombre = 'Nacional');
INSERT INTO tipo_ruta (nombre) SELECT 'Provincial' WHERE NOT EXISTS (SELECT 1 FROM tipo_ruta WHERE nombre = 'Provincial');
INSERT INTO tipo_ruta (nombre) SELECT 'Municipal' WHERE NOT EXISTS (SELECT 1 FROM tipo_ruta WHERE nombre = 'Municipal');

-- Rutas
INSERT INTO ruta (nombre, kilometro, tipo_ruta_id) SELECT 'Ruta 7', 'Km 1050', 1 WHERE NOT EXISTS (SELECT 1 FROM ruta WHERE nombre = 'Ruta 7');
INSERT INTO ruta (nombre, kilometro, tipo_ruta_id) SELECT 'Ruta 40', 'Km 500', 1 WHERE NOT EXISTS (SELECT 1 FROM ruta WHERE nombre = 'Ruta 40');
INSERT INTO ruta (nombre, kilometro, tipo_ruta_id) SELECT 'Ruta Provincial 82', 'Km 30', 2 WHERE NOT EXISTS (SELECT 1 FROM ruta WHERE nombre = 'Ruta Provincial 82');

-- Organizaciones Estatales
INSERT INTO organizacion_estatal (nombre) SELECT 'Policía Vial' WHERE NOT EXISTS (SELECT 1 FROM organizacion_estatal WHERE nombre = 'Policía Vial');
INSERT INTO organizacion_estatal (nombre) SELECT 'Gendarmería Nacional' WHERE NOT EXISTS (SELECT 1 FROM organizacion_estatal WHERE nombre = 'Gendarmería Nacional');
INSERT INTO organizacion_estatal (nombre) SELECT 'Prefectura Naval' WHERE NOT EXISTS (SELECT 1 FROM organizacion_estatal WHERE nombre = 'Prefectura Naval');

-- Estados del Acta
INSERT INTO estado_del_acta (nombre_estado_acta) SELECT 'Pendiente' WHERE NOT EXISTS (SELECT 1 FROM estado_del_acta WHERE nombre_estado_acta = 'Pendiente');
INSERT INTO estado_del_acta (nombre_estado_acta) SELECT 'Pagada' WHERE NOT EXISTS (SELECT 1 FROM estado_del_acta WHERE nombre_estado_acta = 'Pagada');
INSERT INTO estado_del_acta (nombre_estado_acta) SELECT 'Vencida' WHERE NOT EXISTS (SELECT 1 FROM estado_del_acta WHERE nombre_estado_acta = 'Vencida');

-- Tipos de Infraccion
INSERT INTO tipo_de_infraccion (codigo, descripcion) SELECT 'VEL001', 'Exceso de velocidad' WHERE NOT EXISTS (SELECT 1 FROM tipo_de_infraccion WHERE codigo = 'VEL001');
INSERT INTO tipo_de_infraccion (codigo, descripcion) SELECT 'SEM001', 'Semáforo en rojo' WHERE NOT EXISTS (SELECT 1 FROM tipo_de_infraccion WHERE codigo = 'SEM001');
INSERT INTO tipo_de_infraccion (codigo, descripcion) SELECT 'CIN001', 'Falta de cinturón de seguridad' WHERE NOT EXISTS (SELECT 1 FROM tipo_de_infraccion WHERE codigo = 'CIN001');
INSERT INTO tipo_de_infraccion (codigo, descripcion) SELECT 'CEL001', 'Uso de celular al conducir' WHERE NOT EXISTS (SELECT 1 FROM tipo_de_infraccion WHERE codigo = 'CEL001');
INSERT INTO tipo_de_infraccion (codigo, descripcion) SELECT 'ALC001', 'Conducción bajo efectos del alcohol' WHERE NOT EXISTS (SELECT 1 FROM tipo_de_infraccion WHERE codigo = 'ALC001');

-- Autoridades de Constatación
INSERT INTO autoridad_de_constatacion (dni, nombre, apellido, genero, id_legajo, id_placa, organizacion_id)
SELECT 28456123, 'Carlos', 'Rodríguez', 'Masculino', 1001, 5001, 1
WHERE NOT EXISTS (SELECT 1 FROM autoridad_de_constatacion WHERE id_legajo = 1001);

INSERT INTO autoridad_de_constatacion (dni, nombre, apellido, genero, id_legajo, id_placa, organizacion_id)
SELECT 31789456, 'María', 'González', 'Femenino', 1002, 5002, 1
WHERE NOT EXISTS (SELECT 1 FROM autoridad_de_constatacion WHERE id_legajo = 1002);

INSERT INTO autoridad_de_constatacion (dni, nombre, apellido, genero, id_legajo, id_placa, organizacion_id)
SELECT 25123789, 'Roberto', 'Fernández', 'Masculino', 1003, 5003, 2
WHERE NOT EXISTS (SELECT 1 FROM autoridad_de_constatacion WHERE id_legajo = 1003);

-- Roles
INSERT INTO rol_usuario (nombre) SELECT 'ADMIN' WHERE NOT EXISTS (SELECT 1 FROM rol_usuario WHERE nombre = 'ADMIN');
INSERT INTO rol_usuario (nombre) SELECT 'AUTORIDAD' WHERE NOT EXISTS (SELECT 1 FROM rol_usuario WHERE nombre = 'AUTORIDAD');

-- Roles
INSERT INTO rol_usuario (nombre) SELECT 'ADMIN' WHERE NOT EXISTS (SELECT 1 FROM rol_usuario WHERE nombre = 'ADMIN');
INSERT INTO rol_usuario (nombre) SELECT 'AUTORIDAD' WHERE NOT EXISTS (SELECT 1 FROM rol_usuario WHERE nombre = 'AUTORIDAD');

-- Usuarios
INSERT INTO usuario (username, password, nombre, apellido, activo, rol_id)
SELECT 'admin', '$2a$10$8DLqnchJCoT1G7DRePhR8.r3MILhS2RBdfjmQYp49plibF8e0qoTq', 'Administrador', 'Sistema', true, 1
    WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE username = 'admin');

INSERT INTO usuario (username, password, nombre, apellido, activo, rol_id)
SELECT 'autoridad1', '$2a$10$8DLqnchJCoT1G7DRePhR8.r3MILhS2RBdfjmQYp49plibF8e0qoTq', 'Carlos', 'Rodríguez', true, 2
    WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE username = 'autoridad1');

-- Ligar usuario autoridad1 a la autoridad Carlos Rodríguez
UPDATE usuario SET autoridad_id = (
    SELECT id FROM autoridad_de_constatacion WHERE id_legajo = 1003
) WHERE username = 'autoridad1';