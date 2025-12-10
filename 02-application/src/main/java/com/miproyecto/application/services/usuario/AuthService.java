package com.miproyecto.application.services.usuario;

import com.miproyecto.domain.entities.usuario.Usuario;
import com.miproyecto.infrastructure.repositories.usuario.IUsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class AuthService {
    
    @Autowired
    private IUsuarioRepository usuarioRepository;
    
    public Map<String, Object> autenticarUsuario(String nombreUsuario, String contrasena) {
        Map<String, Object> resultado = new HashMap<>();
        
        System.out.println("\n🔍 AuthService.autenticarUsuario()");
        System.out.println("Usuario: " + nombreUsuario);
        
        try {
            // 1. Verificar que el repositorio funcione
            System.out.println("📊 Contando usuarios...");
            long count = usuarioRepository.count();
            System.out.println("Total usuarios en BD: " + count);
            
            // 2. Buscar usuario
            System.out.println("🔎 Buscando: " + nombreUsuario);
            Optional<Usuario> usuarioOpt = usuarioRepository.findActiveByNombreUsuario(nombreUsuario);
            
            if (usuarioOpt.isEmpty()) {
                System.out.println("❌ Usuario no encontrado");
                resultado.put("success", false);
                resultado.put("message", "Usuario no encontrado");
                return resultado;
            }
            
            Usuario usuario = usuarioOpt.get();
            System.out.println("✅ Usuario encontrado: " + usuario.getNombreCompleto());
            System.out.println("Contraseña BD: " + usuario.getContrasena());
            System.out.println("Contraseña recibida: " + contrasena);
            
            // 3. Comparar contraseñas
            if (!usuario.getContrasena().equals(contrasena)) {
                System.out.println("❌ Contraseña incorrecta");
                resultado.put("success", false);
                resultado.put("message", "Contraseña incorrecta");
                return resultado;
            }
            
            // 4. Éxito
            System.out.println("🎉 Autenticación exitosa!");
            resultado.put("success", true);
            resultado.put("message", "Bienvenido");
            resultado.put("usuario", usuario);
            resultado.put("rol", obtenerNombreRol(usuario.getIdRol()));
            
        } catch (Exception e) {
            System.out.println("💥 ERROR: " + e.getMessage());
            e.printStackTrace();
            resultado.put("success", false);
            resultado.put("message", "Error: " + e.getMessage());
        }
        
        return resultado;
    }
    
    private String obtenerNombreRol(Integer idRol) {
        if (idRol == null) return "Usuario";
        return switch(idRol) {
            case 1 -> "Administrador";
            case 2 -> "Recepcionista";
            case 3 -> "Gerente";
            default -> "Usuario";
        };
    }
}