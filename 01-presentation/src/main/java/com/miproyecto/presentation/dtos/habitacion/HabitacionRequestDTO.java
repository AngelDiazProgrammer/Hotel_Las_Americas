// Crea en: com.miproyecto.presentation.dtos.habitacion
package com.miproyecto.presentation.dtos.habitacion;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class HabitacionRequestDTO {
    private String numeroHabitacion;
    private Integer tipoHabitacionId;
    private Integer piso;
    private Integer capacidad;
    private String caracteristicas;
    private Integer estadoHabitacionId;
    private BigDecimal precioNoche;
}