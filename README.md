# Hotel_Las_Americas
Proyecto Spring Boot con arquitectura por capas y SQL Server y patron unitOfWork


## 🐳 Configuración Docker

### Iniciar Base de Datos
```bash
cd docker
- sqlcmd -S localhost -U sa -P "HotelLasAmericas2024!" -i "sql-scripts/init.sql"
docker-compose up -d
