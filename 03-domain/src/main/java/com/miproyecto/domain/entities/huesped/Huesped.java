package com.miproyecto.domain.entities.huesped;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "huespedes")
@Getter
@Setter
@RequiredArgsConstructor
@AllArgsConstructor
public class Huesped {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_huesped")
    private Integer id;

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
}
