package com.miproyecto.domain.entities.habitacion;

import com.miproyecto.domain.entities.reserva.Reserva; // Importación necesaria
import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // Importación necesaria
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList; // Importación necesaria
import java.util.List; // Importación necesaria

@Entity
@Table(name = "habitaciones")
@Getter
@Setter
@RequiredArgsConstructor
@AllArgsConstructor
@Builder
// Excluir la colección de reservas para evitar problemas de rendimiento y recursión en logs
@ToString(exclude = "reservas")
@EqualsAndHashCode(exclude = "reservas")
public class Habitacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_habitacion")
    private Integer idHabitacion; // Renombrado de 'id' a 'idHabitacion'

    @Column(name = "numero_habitacion", unique = true, nullable = false)
    private String numeroHabitacion;

    @Column(name = "id_tipo_habitacion", nullable = false)
    private Integer tipoHabitacionId; // ← Cambiado a Integer

    private Integer piso;

    @Column(nullable = false)
    private Integer capacidad;

    private String caracteristicas;

    @Column(name = "id_estado_habitacion")
    private Integer estadoHabitacionId; // ← Cambiado a Integer

    @Column(name = "precio_noche", nullable = false)
    private BigDecimal precioNoche;

    // ========================================================
    // RELACIÓN ONE-TO-MANY con RESERVAS
    // ========================================================

    /**
     * @JsonIgnoreProperties("habitacion"): EVITA LA RECURSIÓN INFINITA. 
     * Cuando serializamos una Habitación, serializamos sus Reservas, 
     * pero le indicamos a Jackson que ignore la propiedad 'habitacion' 
     * dentro de esas Reservas para que el ciclo se detenga aquí.
     */
    @OneToMany(mappedBy = "habitacion", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("habitacion") 
    private List<Reserva> reservas = new ArrayList<>();

    // Getter para mantener compatibilidad con el service que usa getId()
    public Integer getId() {
        return idHabitacion;
    }
}