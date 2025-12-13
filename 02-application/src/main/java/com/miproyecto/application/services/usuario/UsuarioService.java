package com.miproyecto.application.services.usuario;

import com.miproyecto.domain.entities.usuario.Usuario;
import com.miproyecto.infrastructure.repositories.usuario.IUsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UsuarioService {
    
    @Autowired
    private IUsuarioRepository usuarioRepository;
    
    /**
     * Obtener todos los usuarios
     * @return Lista de usuarios
     */
    public List<Usuario> obtenerTodosUsuarios() {
        return usuarioRepository.findAll();
    }
    
    /**
     * Obtener usuario por ID
     * @param id ID del usuario
     * @return Usuario si existe
     */
    public Optional<Usuario> obtenerUsuarioPorId(Integer id) {
        return usuarioRepository.findById(id);
    }
    
    /**
     * Obtener usuario por nombre de usuario
     * @param nombreUsuario Nombre de usuario
     * @return Usuario si existe
     */
    public Optional<Usuario> obtenerUsuarioPorNombre(String nombreUsuario) {
        return usuarioRepository.findByNombreUsuario(nombreUsuario);
    }
    
    /**
     * Guardar o actualizar usuario
     * @param usuario Objeto usuario
     * @return Usuario guardado
     */
    public Usuario guardarUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }
    
    /**
     * Eliminar usuario por ID
     * @param id ID del usuario
     */
    public void eliminarUsuario(Integer id) {
        usuarioRepository.deleteById(id);
    }
    
    /**
     * Contar total de usuarios
     * @return Número total de usuarios
     */
    public long contarUsuarios() {
        return usuarioRepository.count();
    }
}