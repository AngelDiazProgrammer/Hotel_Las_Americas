package com.miproyecto.application.services.reserva;

import com.miproyecto.domain.entities.habitacion.Habitacion;
import com.miproyecto.domain.entities.huesped.Huesped;
import com.miproyecto.domain.entities.reserva.EstadoReserva;
import com.miproyecto.domain.entities.reserva.Reserva;
import com.miproyecto.infrastructure.repositories.habitacion.IHabitacionRepository;
import com.miproyecto.infrastructure.repositories.huesped.IHuespedRepository;
import com.miproyecto.infrastructure.repositories.reserva.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
// El resto de tus imports

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReservaService {

    // Se asume que el nombre del repositorio es ReservaRepository (como en tu
    // ejemplo)
    private final ReservaRepository reservaRepository;
    private final IHuespedRepository huespedRepository;
    private final IHabitacionRepository habitacionRepository;
    private final EstadoReservaRepository estadoReservaRepository;

    // Constantes de estado (ID_ESTADO_RESERVA)
    private static final int ESTADO_PENDIENTE = 1;
    private static final int ESTADO_CONFIRMADO = 2;
    private static final int ESTADO_EN_CURSO = 3;
    private static final int ESTADO_COMPLETADO = 4;
    private static final int ESTADO_CANCELADA = 5;
    // Si tu sistema usa más estados (ej. 3 para Pendiente), ajusta aquí.

    // ====================== C R U D ======================

    @Transactional
    public Reserva guardarReserva(Reserva reserva) {

        // 1. Establecer fecha de reserva
        if (reserva.getFechaReserva() == null) {
            reserva.setFechaReserva(LocalDateTime.now());
        }

        // 2. Establecer estado por defecto (PENDIENTE)
        if (reserva.getEstadoReserva() == null) {

            EstadoReserva estadoPendiente = estadoReservaRepository.findById(ESTADO_PENDIENTE)
                    .orElseThrow(() -> new RuntimeException("Estado de reserva PENDIENTE no encontrado en la BD."));

            reserva.setEstadoReserva(estadoPendiente);
        }

        return reservaRepository.save(reserva);
    }

    @Transactional(readOnly = true)
    public Page<Reserva> listarReservas(Pageable pageable) {
        // ⬇️ Cambiamos la llamada al nuevo método optimizado ⬇️
        return reservaRepository.findAllWithDetails(pageable);
    }

    @Transactional(readOnly = true)
    public Reserva obtenerReserva(Integer id) {
        return reservaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Reserva no encontrada por el ID: " + id));
    }

    @Transactional
    public Reserva editarReserva(Integer id, Reserva reservaActualizada) {
        // ...
        return reservaRepository.findById(id)
                .map(reservaExistente -> {

                    if (reservaActualizada.getHuesped() != null && reservaActualizada.getHuesped().getId() != null) {
                        Huesped nuevoHuesped = huespedRepository.findById(reservaActualizada.getHuesped().getId())
                                .orElseThrow(() -> new EntityNotFoundException(
                                        "Huésped no encontrado con ID: " + reservaActualizada.getHuesped().getId()));
                        reservaExistente.setHuesped(nuevoHuesped);
                    }

                    if (reservaActualizada.getHabitacion() != null
                            && reservaActualizada.getHabitacion().getId() != null) {
                        Habitacion nuevaHabitacion = habitacionRepository
                                .findById(reservaActualizada.getHabitacion().getId())
                                .orElseThrow(() -> new EntityNotFoundException("Habitación no encontrada con ID: "
                                        + reservaActualizada.getHabitacion().getId()));
                        reservaExistente.setHabitacion(nuevaHabitacion);
                    }

                    // ... el resto de la lógica de edición

                    return reservaRepository.save(reservaExistente);
                })
                .orElseThrow(() -> new EntityNotFoundException("Reserva no encontrada con ID: " + id));
    }

    // ====================== GESTIÓN DE ESTADO ======================

    @Transactional
    public Reserva cancelarReserva(int id) {
        Reserva reserva = obtenerReserva(id); // Usa el método seguro que lanza excepción

        if (reserva.getEstadoReserva().getIdEstadoReserva() == ESTADO_CANCELADA) {
            throw new RuntimeException("La reserva ya está cancelada.");
        }
        EstadoReserva estadoCancelada = estadoReservaRepository.findById(ESTADO_CANCELADA)
                .orElseThrow(() -> new RuntimeException("Estado de reserva CANCELADA (ID: 5) no encontrado en la BD."));

        reserva.setEstadoReserva(estadoCancelada); // Asigna el objeto, no el entero

        return reservaRepository.save(reserva);
    }

    @Transactional
    public Reserva confirmarReserva(int id) {
        Reserva reserva = obtenerReserva(id);
        if (reserva.getEstadoReserva().getIdEstadoReserva() == ESTADO_CONFIRMADO) {
            throw new RuntimeException("La reserva ya está confirmada.");
        }

        EstadoReserva estadoConfirmado = estadoReservaRepository.findById(ESTADO_CONFIRMADO)
                .orElseThrow(() -> new RuntimeException(
                        "Estado de reserva CONFIRMADO (ID: " + ESTADO_CONFIRMADO + ") no encontrado en la BD."));

        reserva.setEstadoReserva(estadoConfirmado);

        return reservaRepository.save(reserva);
    }

    @Transactional
    public void eliminarReserva(Integer id) {
        System.out.println("🗑️ Service: Eliminando reserva ID: " + id);

        // Verifica si la reserva existe antes de eliminar
        if (!reservaRepository.existsById(id)) {
            // Lanza la excepción que será capturada por el controlador (RuntimeException en
            // este caso)
            throw new EntityNotFoundException("Reserva no encontrada con ID: " + id);
        }

        reservaRepository.deleteById(id);
        System.out.println("✅ Service: Eliminación exitosa de la reserva ID: " + id);
    }

    // ====================== ESTADÍSTICAS ======================

    @Transactional(readOnly = true)
    public long contarReservas() {
        return reservaRepository.count();
    }

    @Transactional(readOnly = true)
    public long contarReservasConfirmadas() {

        return reservaRepository.countByEstadoReserva_IdEstadoReserva(ESTADO_CONFIRMADO);
    }

}