#!/bin/bash
# Inicializar SQL Server y ejecutar scripts

# Iniciar SQL Server en segundo plano
/opt/mssql/bin/sqlservr &

# Esperar a que SQL Server est? listo
echo "Waiting for SQL Server to start..."
sleep 30

# Ejecutar el script de inicializaci?n
echo "Running initialization script..."
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -d master -i /docker-entrypoint-initdb.d/init.sql

# Mantener el contenedor corriendo
wait