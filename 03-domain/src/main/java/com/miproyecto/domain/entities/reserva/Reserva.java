package com.miproyecto.domain.entities.reserva;

import com.miproyecto.domain.entities.habitacion.Habitacion; 
import com.miproyecto.domain.entities.huesped.Huesped; 
import com.miproyecto.domain.entities.reserva.EstadoReserva; 
import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // Importante: Nueva importación
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservas")
@Data 
@NoArgsConstructor
@AllArgsConstructor 
// Opcional: Usar solo las propiedades de la entidad para ToString/Equals, excluyendo relaciones LAZY
@ToString(exclude = {"huesped", "habitacion", "estadoReserva"})
@EqualsAndHashCode(exclude = {"huesped", "habitacion", "estadoReserva"})
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_reserva")
    private Integer idReserva;

    // ========================================================
    // ✅ CORRECCIÓN DE CICLO DE REFERENCIA JSON
    // ========================================================

    /** * Relación Many-to-One con Huesped.
     * @JsonIgnoreProperties: Evita la recursión infinita. Cuando Jackson serializa Reserva, 
     * serializa Huesped, pero le dice a Jackson que IGNORE la lista de 'reservas' 
     * que Huesped pueda tener, y también los campos internos de Hibernate (handler/initializer).
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_huesped", nullable = false)
    @JsonIgnoreProperties({"reservas", "hibernateLazyInitializer", "handler"}) 
    private Huesped huesped; 

    /** * Relación Many-to-One con Habitacion.
     * @JsonIgnoreProperties: Similar al anterior.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_habitacion", nullable = false)
    @JsonIgnoreProperties({"reservas", "hibernateLazyInitializer", "handler"}) 
    private Habitacion habitacion; 

    /** * Relación Many-to-One con EstadoReserva.
     * @JsonIgnoreProperties: Los estados rara vez causan ciclos, pero es buena práctica de limpieza.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_estado_reserva", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private EstadoReserva estadoReserva;
    
    // NOTA: idUsuarioCrea se mantiene como Integer si no es necesario el objeto completo del usuario
    @Column(name = "id_usuario_crea")
    private Integer idUsuarioCrea;

    // ========================================================
    // DATOS DE RESERVA
    // ========================================================

    @Column(name = "fecha_entrada", nullable = false)
    private LocalDate fechaEntrada;

    @Column(name = "fecha_salida", nullable = false)
    private LocalDate fechaSalida;
    
    @Column(name = "fecha_reserva", nullable = false)
    private LocalDateTime fechaReserva;

    @Column(name = "total_estimado", precision = 10, scale = 2)
    private BigDecimal totalEstimado;

    @Column(name = "observaciones", length = 255)
    private String observaciones;

    // ========================================================
    // MÉTODOS AUXILIARES PARA LA VISTA (Mantienen la funcionalidad)
    // ========================================================

    /**
     * Método auxiliar para obtener el nombre y apellido concatenados.
     */
    @Transient // Indica a JPA que este campo no existe en la base de datos
    public String getNombreHuespedCompleto() {
        if (this.huesped == null || this.huesped.getNombre() == null) {
            return "N/A";
        }
        return this.huesped.getNombre() + " " + this.huesped.getApellido();
    }
    
    @Transient 
    public String getNumeroHabitacion() {
        return this.habitacion != null ? this.habitacion.getNumeroHabitacion() : "N/A";
    }

    @Transient 
    public String getDescripcionEstado() {
        return this.estadoReserva != null ? this.estadoReserva.getDescripcion() : "Desconocido";
    }
}