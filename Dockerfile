# Dockerfile
# Etapa 1: Construcción
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copia el pom.xml principal y de los módulos
COPY pom.xml .
COPY 01-presentation/pom.xml 01-presentation/
COPY 02-application/pom.xml 02-application/
COPY 03-domain/pom.xml 03-domain/
COPY 04-infrastructure/pom.xml 04-infrastructure/
COPY 05-shared/pom.xml 05-shared/

# Descarga dependencias
RUN mvn dependency:go-offline -B

# Copia el código fuente
COPY . .

# Construye el proyecto
RUN mvn clean package -DskipTests

# Etapa 2: Ejecución
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copia el JAR desde la etapa de construcción
COPY --from=build /app/01-presentation/target/*.jar app.jar

# Puerto expuesto
EXPOSE 8080

# Comando de ejecución
ENTRYPOINT ["java", "-jar", "app.jar"]