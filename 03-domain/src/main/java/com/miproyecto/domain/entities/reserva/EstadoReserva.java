package com.miproyecto.domain.entities.reserva;

import jakarta.persistence.*;
import lombok.*;

// Opcional: Si necesitas la relación inversa de Estado a Reserva, podrías añadir un Set<Reserva>
// pero para la funcionalidad de listado actual, no es estrictamente necesario.

@Entity
@Table(name = "dom_estados_reserva") // Ajusta este nombre si tu tabla se llama diferente
@Data // Incluye @Getter, @Setter, @ToString, @EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class EstadoReserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_estado_reserva")
    private Integer idEstadoReserva;
 
    @Column(name = "estado", nullable = false, length = 50)
    private String estado;

    @Column(name = "descripcion", nullable = false, length = 50)
    private String descripcion;

}