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
    private String nombres;

    @Column(name = "apellidos", nullable = false)
    private String apellidos;

    @Column(name = "id_tipo_documento", nullable = false)
    private Integer id_tipo_documento;

    @Column(name = "documento", nullable = false)
    private String documento;

    @Column(name = "email")
    private String email;

    @Column(name = "telefono")
    private String telefono;

    @Column(name = "direccion")
    private String direccion;

    @Column(name = "id_estado_huesped")
    private Integer id_estado_huesped;

    @Column(name = "fecha_registro")
    private LocalDateTime fecha_registro;
}
