package com.miproyecto.domain.entities.habitacion;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "habitaciones")
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
    
    // Constructores
    public Habitacion() {}
    
    public Habitacion(String numeroHabitacion, Integer tipoHabitacionId, Integer capacidad, BigDecimal precioNoche) {
        this.numeroHabitacion = numeroHabitacion;
        this.tipoHabitacionId = tipoHabitacionId;
        this.capacidad = capacidad;
        this.precioNoche = precioNoche;
    }
    
    // Getters y Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public String getNumeroHabitacion() { return numeroHabitacion; }
    public void setNumeroHabitacion(String numeroHabitacion) { this.numeroHabitacion = numeroHabitacion; }
    
    public Integer getTipoHabitacionId() { return tipoHabitacionId; }
    public void setTipoHabitacionId(Integer tipoHabitacionId) { this.tipoHabitacionId = tipoHabitacionId; }
    
    public Integer getPiso() { return piso; }
    public void setPiso(Integer piso) { this.piso = piso; }
    
    public Integer getCapacidad() { return capacidad; }
    public void setCapacidad(Integer capacidad) { this.capacidad = capacidad; }
    
    public String getCaracteristicas() { return caracteristicas; }
    public void setCaracteristicas(String caracteristicas) { this.caracteristicas = caracteristicas; }
    
    public Integer getEstadoHabitacionId() { return estadoHabitacionId; }
    public void setEstadoHabitacionId(Integer estadoHabitacionId) { this.estadoHabitacionId = estadoHabitacionId; }
    
    public BigDecimal getPrecioNoche() { return precioNoche; }
    public void setPrecioNoche(BigDecimal precioNoche) { this.precioNoche = precioNoche; }
    
    // Método helper para mostrar info
    public String getInfoCompleta() {
        return String.format("Habitación %s - Piso %d - $%,.0f/noche", 
            numeroHabitacion, piso != null ? piso : 0, precioNoche);
    }
}