package com.miproyecto.infrastructure.repositories.reserva;

import com.miproyecto.domain.entities.reserva.Reserva;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Integer> {

@Query("SELECT r FROM Reserva r " +
           "JOIN FETCH r.huesped " + 
           "JOIN FETCH r.habitacion " +
           "JOIN FETCH r.estadoReserva " +
           "ORDER BY r.fechaReserva DESC")
    Page<Reserva> findAllWithDetails(Pageable pageable);

long countByEstadoReserva_IdEstadoReserva(int idEstadoReserva);
}