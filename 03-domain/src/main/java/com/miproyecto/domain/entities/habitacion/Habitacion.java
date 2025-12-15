package com.miproyecto.domain.entities.habitacion;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "habitaciones")
@Getter
@Setter
@RequiredArgsConstructor
@AllArgsConstructor
@Builder
public class Habitacion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_habitacion")
    private Integer id;
    
    @Column(name = "numero_habitacion", unique = true, nullable = false)
    private String numeroHabitacion;
    
    @Column(name = "id_tipo_habitacion", nullable = false)
    private Integer tipoHabitacionId;  // ← Cambiado a Integer
    
    private Integer piso;
    
    @Column(nullable = false)
    private Integer capacidad;
    
    private String caracteristicas;
    
    @Column(name = "id_estado_habitacion")
    private Integer estadoHabitacionId;  // ← Cambiado a Integer
    
    @Column(name = "precio_noche", nullable = false)
    private BigDecimal precioNoche;

//    // Método helper para mostrar info
//    public String getInfoCompleta() {
//        return String.format("Habitación %s - Piso %d - $%,.0f/noche",
//            numeroHabitacion, piso != null ? piso : 0, precioNoche);
//    }
}