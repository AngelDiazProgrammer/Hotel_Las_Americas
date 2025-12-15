package com.miproyecto.infrastructure.repositories.reserva;

import com.miproyecto.domain.entities.reserva.EstadoReserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EstadoReservaRepository extends JpaRepository<EstadoReserva, Integer> {
    
    // Spring Data JPA automáticamente implementa métodos CRUD básicos y paginación.
    // Puedes añadir métodos de consulta específicos aquí si los necesitas.
}