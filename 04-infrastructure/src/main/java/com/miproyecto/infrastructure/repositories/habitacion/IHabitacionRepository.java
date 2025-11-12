package com.miproyecto.infrastructure.repositories.habitacion;

import com.miproyecto.domain.entities.habitacion.Habitacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IHabitacionRepository extends JpaRepository<Habitacion, Integer> {  // ← Integer en lugar de Long
    
    List<Habitacion> findByNumeroHabitacion(String numeroHabitacion);
    
    List<Habitacion> findByPiso(Integer piso);
    
    List<Habitacion> findByEstadoHabitacionId(Integer estadoId);  // ← Integer
    
    List<Habitacion> findByTipoHabitacionId(Integer tipoId);  // ← Integer
    
    @Query("SELECT h FROM Habitacion h WHERE h.estadoHabitacionId = 1")
    List<Habitacion> findHabitacionesDisponibles();
    
    @Query("SELECT h FROM Habitacion h WHERE h.precioNoche >= :precioMinimo")
    List<Habitacion> findByPrecioNocheGreaterThanEqual(@Param("precioMinimo") java.math.BigDecimal precioMinimo);
}