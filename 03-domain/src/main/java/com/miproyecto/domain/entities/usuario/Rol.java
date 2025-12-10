package com.miproyecto.domain.entities.usuario;

import jakarta.persistence.*;

@Entity
@Table(name = "dom_roles")
public class Rol {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_rol")
    private Integer idRol;
    
    @Column(name = "nombre_rol", nullable = false, unique = true)
    private String nombreRol;
    
    private String descripcion;
    
    // Constructores
    public Rol() {}
    
    public Rol(String nombreRol, String descripcion) {
        this.nombreRol = nombreRol;
        this.descripcion = descripcion;
    }
    
    // Getters y Setters
    public Integer getIdRol() { return idRol; }
    public void setIdRol(Integer idRol) { this.idRol = idRol; }
    
    public String getNombreRol() { return nombreRol; }
    public void setNombreRol(String nombreRol) { this.nombreRol = nombreRol; }
    
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    
    // Método helper para mostrar info
    public String getInfoCompleta() {
        return String.format("%s - %s", nombreRol, descripcion);
    }
}