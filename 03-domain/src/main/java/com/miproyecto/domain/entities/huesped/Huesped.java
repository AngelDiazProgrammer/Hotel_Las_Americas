package com.miproyecto.domain.entities.huesped;

import com.miproyecto.domain.entities.reserva.Reserva; // Importación necesaria
import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // Importación necesaria
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List; // Importación necesaria
import java.util.ArrayList; // Importación necesaria

@Entity
@Table(name = "huespedes")
@Getter
@Setter
@RequiredArgsConstructor
@AllArgsConstructor
// Excluir la colección de reservas para evitar problemas de rendimiento y recursión en logs
@ToString(exclude = "reservas") 
@EqualsAndHashCode(exclude = "reservas")
public class Huesped {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_huesped")
    // Usar 'idHuesped' en lugar de 'id' es una buena práctica si la columna se llama id_huesped
    private Integer idHuesped; 

    @Column(name = "nombres", nullable = false)
    private String nombre;

    @Column(name = "apellidos", nullable = false)
    private String apellido;

    @Column(name = "id_tipo_documento", nullable = false)
    private Integer idTipoDocumento;

    @Column(name = "documento", nullable = false)
    private String documento;

    @Column(name = "email")
    private String email;

    @Column(name = "telefono")
    private String telefono;

    @Column(name = "direccion")
    private String direccion;

    @Column(name = "id_estado_huesped")
    private Integer idEstadoHuesped;

    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;

    // ========================================================
    // RELACIÓN ONE-TO-MANY con RESERVAS
    // ========================================================

    /**
     * @JsonIgnoreProperties("huesped"): Muy importante. Cuando serializamos un Huésped, 
     * serializamos sus Reservas, pero le indicamos a Jackson que ignore la propiedad 
     * 'huesped' dentro de esas Reservas para EVITAR LA RECURSIÓN INFINITA.
     */
    @OneToMany(mappedBy = "huesped", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("huesped") 
    private List<Reserva> reservas = new ArrayList<>();
    
    // Si utiliza @Data o @Getter/@Setter de Lombok, asegúrese de que la propiedad 'id' 
    // se resuelva correctamente para getIdHuesped(), o cámbiela a 'idHuesped'.
    // He cambiado 'id' por 'idHuesped' arriba para consistencia con la columna 'id_huesped'.
    
    public Integer getId() { // Mantener este método para compatibilidad con el service que usa getId()
        return idHuesped;
    }
}