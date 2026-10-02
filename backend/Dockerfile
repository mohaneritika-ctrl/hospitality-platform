# ===================================================================
# Stage 1: Build the Spring Boot application using Maven
# ===================================================================
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder

WORKDIR /app

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build production jar
COPY src ./src
RUN mvn clean package -DskipTests

# ===================================================================
# Stage 2: Minimal Java 21 runtime container
# ===================================================================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy the built jar from the builder stage
COPY --from=builder /app/target/hospitality-platform-*.jar app.jar

# Expose default HTTP port
EXPOSE 8080

# Environment defaults
ENV PORT=8080

# Run Spring Boot app binding to $PORT dynamically
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT} -jar app.jar"]
