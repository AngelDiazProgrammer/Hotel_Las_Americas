package com.miproyecto.infrastructure.repositories.usuario;

import com.miproyecto.domain.entities.usuario.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IUsuarioRepository extends JpaRepository<Usuario, Integer> {
    
    // Buscar usuario por nombre de usuario
    Optional<Usuario> findByNombreUsuario(String nombreUsuario);
    
    // Buscar usuario por email
    Optional<Usuario> findByEmail(String email);
    
    // Buscar usuario activo por nombre de usuario
    @Query("SELECT u FROM Usuario u WHERE u.nombreUsuario = :nombreUsuario AND u.activo = true")
    Optional<Usuario> findActiveByNombreUsuario(@Param("nombreUsuario") String nombreUsuario);
    
    // Verificar si existe un usuario por nombre de usuario
    boolean existsByNombreUsuario(String nombreUsuario);
    
    // Verificar si existe un usuario por email
    boolean existsByEmail(String email);
}