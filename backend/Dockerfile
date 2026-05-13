# ── Stage 1: Build ──────────────────────────────────────────────────────
FROM maven:3.9.6-eclipse-temurin-21 AS builder
WORKDIR /app
COPY pom.xml .
# Download dependencies first (layer caching)
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests -B

# ── Stage 2: Run ────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN addgroup -S devguard && adduser -S devguard -G devguard
COPY --from=builder /app/target/*.jar app.jar
USER devguard
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
