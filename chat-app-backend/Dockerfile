# Stage 1: Build the application using Maven
# Based on your working reference, using Java 21 LTS for a stable build.
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

# First, copy only the pom.xml to leverage Docker layer caching
COPY pom.xml .

# Download all dependencies. This step is cached if pom.xml doesn't change,
# which makes subsequent builds much faster.
RUN mvn dependency:go-offline

# Copy the rest of your application's source code
COPY src ./src

# Package the application into an executable JAR file, skipping tests
RUN mvn package -DskipTests


# Stage 2: Create the final, lightweight runtime image
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Copy the executable JAR from the 'build' stage.
# Using a wildcard (*) is a robust way to copy the JAR regardless of its version number.
COPY --from=build /app/target/*.jar app.jar

# Expose the port that the application runs on
EXPOSE 8080

# The command to run your application when the container starts
ENTRYPOINT ["java", "-jar", "app.jar"]