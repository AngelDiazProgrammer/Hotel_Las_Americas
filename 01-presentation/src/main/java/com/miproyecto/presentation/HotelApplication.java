package com.miproyecto.presentation;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {
        "com.miproyecto.presentation",
        "com.miproyecto.application",
        "com.miproyecto.domain",
        "com.miproyecto.infrastructure",
        "com.miproyecto.shared"
})
// Agrega BOTH paquetes de repositorios
@EnableJpaRepositories(basePackages = {
        "com.miproyecto.infrastructure.repositories.habitacion",
        "com.miproyecto.infrastructure.repositories.usuario",
        "com.miproyecto.infrastructure.repositories.huesped"
})
// Agrega BOTH paquetes de entidades
@EntityScan(basePackages = {
        "com.miproyecto.domain.entities.habitacion",
        "com.miproyecto.domain.entities.usuario",
        "com.miproyecto.domain.entities.huesped"
})
public class HotelApplication {
    public static void main(String[] args) {
        SpringApplication.run(HotelApplication.class, args);
        System.out.println("🚀 Hotel Las Americas API iniciada correctamente!");
    }
}