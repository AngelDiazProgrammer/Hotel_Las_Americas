package com.miproyecto.presentation.controllers.auth;

import com.miproyecto.application.services.usuario.AuthService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Controller
@RequestMapping("/auth")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @GetMapping("/login")
    public String mostrarLogin(Model model, HttpSession session) {
        System.out.println("\n=== 🔐 GET /auth/login ===");
        System.out.println("Session ID: " + session.getId());
        System.out.println("isAuthenticated en sesión: " + session.getAttribute("isAuthenticated"));
        
        Boolean isAuthenticated = (Boolean) session.getAttribute("isAuthenticated");
        if (isAuthenticated != null && isAuthenticated) {
            System.out.println("✅ Ya autenticado, redirigiendo a /");
            return "redirect:/";
        }
        
        System.out.println("📄 Mostrando formulario de login");
        model.addAttribute("pageTitle", "Login");
        return "auth/login";
    }
    
    @PostMapping("/login")
    public String procesarLogin(
            @RequestParam String nombreUsuario,
            @RequestParam String contrasena,
            HttpSession session,
            Model model) {
        
        System.out.println("\n=== 🔐 POST /auth/login ===");
        System.out.println("Usuario: " + nombreUsuario);
        System.out.println("Session ID antes: " + session.getId());
        
        Map<String, Object> resultado = authService.autenticarUsuario(nombreUsuario, contrasena);
        System.out.println("Resultado success: " + resultado.get("success"));
        
        if (Boolean.TRUE.equals(resultado.get("success"))) {
            // Guardar en sesión
            session.setAttribute("usuario", resultado.get("usuario"));
            session.setAttribute("rol", resultado.get("rol"));
            session.setAttribute("isAuthenticated", true);
            
            // VERIFICAR que se guardó
            System.out.println("✅ Atributos guardados en sesión:");
            System.out.println("   - isAuthenticated: " + session.getAttribute("isAuthenticated"));
            System.out.println("   - rol: " + session.getAttribute("rol"));
            System.out.println("   - usuario existe: " + (session.getAttribute("usuario") != null));
            System.out.println("Session ID después: " + session.getId());
            
            System.out.println("🔄 Redirigiendo a /");
            return "redirect:/";
            
        } else {
            System.out.println("❌ Login fallido: " + resultado.get("message"));
            model.addAttribute("error", resultado.get("message"));
            return "auth/login";
        }
    }
    
    @GetMapping("/logout")
    public String logout(HttpSession session) {
        System.out.println("🔓 Cerrando sesión - Session ID: " + session.getId());
        session.invalidate();
        return "redirect:/auth/login";
    }
    
    @GetMapping("/check-session")
    @ResponseBody
    public String checkSession(HttpSession session) {
        return "Session ID: " + session.getId() + 
               "\nisAuthenticated: " + session.getAttribute("isAuthenticated") +
               "\nUsuario: " + session.getAttribute("usuario");
    }
}