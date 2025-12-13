package com.miproyecto.application.services.habitacion;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.miproyecto.domain.entities.habitacion.Habitacion;
import com.miproyecto.infrastructure.repositories.habitacion.IHabitacionRepository;
import java.util.List;
import java.util.Optional;

@Service
public class HabitacionService {
    
    @Autowired
    private IHabitacionRepository habitacionRepository;
    
    public List<Habitacion> obtenerTodasLasHabitaciones() {
        return habitacionRepository.findAll();
    }

public Page<Habitacion> obtenerHabitacionesPaginadas(Pageable pageable) {
    return habitacionRepository.findAll(pageable);
}

    
    public Optional<Habitacion> obtenerHabitacionPorId(Integer id) {
        return habitacionRepository.findById(id);
    }
    
    public List<Habitacion> obtenerHabitacionesPorPiso(Integer piso) {
        return habitacionRepository.findByPiso(piso);
    }
    
    public List<Habitacion> obtenerHabitacionesDisponibles() {
        return habitacionRepository.findHabitacionesDisponibles();
    }
    
    public List<Habitacion> obtenerHabitacionesPorTipo(Integer tipoId) {
        return habitacionRepository.findByTipoHabitacionId(tipoId);
    }
    
    public List<Habitacion> obtenerHabitacionesPorEstado(Integer estadoId) {
        return habitacionRepository.findByEstadoHabitacionId(estadoId);
    }
    
    public Optional<Habitacion> obtenerHabitacionPorNumero(String numeroHabitacion) {
        List<Habitacion> habitaciones = habitacionRepository.findByNumeroHabitacion(numeroHabitacion);
        return habitaciones.isEmpty() ? Optional.empty() : Optional.of(habitaciones.get(0));
    }
    
    public Habitacion guardarHabitacion(Habitacion habitacion) {
    System.out.println("💾 Guardando habitación: " + habitacion.getNumeroHabitacion());
    Habitacion guardada = habitacionRepository.save(habitacion);
    System.out.println("✅ Habitación guardada - ID: " + guardada.getId());
    return guardada;
}

public Habitacion actualizarHabitacion(Integer id, Habitacion habitacionActualizada) {
    System.out.println("🔄 Actualizando habitación ID: " + id);
    return habitacionRepository.findById(id)
            .map(habitacionExistente -> {
                System.out.println("📝 Antes: " + habitacionExistente.getNumeroHabitacion());
                System.out.println("📝 Después: " + habitacionActualizada.getNumeroHabitacion());
                return habitacionRepository.save(habitacionExistente);
            })
            .orElseThrow(() -> {
                System.out.println("❌ Habitación no encontrada: " + id);
                return new RuntimeException("Habitación no encontrada con ID: " + id);
            });
}
    
    public void eliminarHabitacion(Integer id) {
        habitacionRepository.deleteById(id);
    }
    
    public boolean existeHabitacion(Integer id) {
        return habitacionRepository.existsById(id);
    }
    
    public boolean existeHabitacionPorNumero(String numeroHabitacion) {
        return !habitacionRepository.findByNumeroHabitacion(numeroHabitacion).isEmpty();
    }
    
    public long contarHabitaciones() {
        return habitacionRepository.count();
    }
    
    public long contarHabitacionesDisponibles() {
        return habitacionRepository.findHabitacionesDisponibles().size();
    }
    
    public long contarHabitacionesPorEstado(Integer estadoId) {
        return habitacionRepository.findByEstadoHabitacionId(estadoId).size();
    }
    
    public long contarHabitacionesPorTipo(Integer tipoId) {
        return habitacionRepository.findByTipoHabitacionId(tipoId).size();
    }
    
    // Método para obtener estadísticas rápidas
    public String obtenerEstadisticas() {
        long total = contarHabitaciones();
        long disponibles = contarHabitacionesDisponibles();
        double porcentajeDisponibles = total > 0 ? (disponibles * 100.0) / total : 0;
        
        return String.format(
            "Total: %d | Disponibles: %d (%.1f%%) | Ocupadas: %d",
            total, disponibles, porcentajeDisponibles, total - disponibles
        );
    }

    public Habitacion inhabilitarHabitacion(Integer id) {
    return habitacionRepository.findById(id)
            .map(habitacion -> {
                // Suponiendo que estado 2 = Inhabilitado, 1 = Habilitado
                habitacion.setEstadoHabitacionId(2);
                return habitacionRepository.save(habitacion);
            })
            .orElseThrow(() -> new RuntimeException("Habitación no encontrada con ID: " + id));
}

public Habitacion habilitarHabitacion(Integer id) {
    return habitacionRepository.findById(id)
            .map(habitacion -> {
                habitacion.setEstadoHabitacionId(1); // Habilitado
                return habitacionRepository.save(habitacion);
            })
            .orElseThrow(() -> new RuntimeException("Habitación no encontrada con ID: " + id));
}
}