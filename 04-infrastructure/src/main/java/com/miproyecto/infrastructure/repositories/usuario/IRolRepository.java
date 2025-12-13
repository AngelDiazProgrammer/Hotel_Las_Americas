package com.miproyecto.infrastructure.repositories.usuario;

import com.miproyecto.domain.entities.usuario.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IRolRepository extends JpaRepository<Rol, Integer> {
    
    // Buscar rol por nombre
    Optional<Rol> findByNombreRol(String nombreRol);
    
    // Verificar si existe un rol por nombre
    boolean existsByNombreRol(String nombreRol);
}