package com.miproyecto.presentation.controllers;

import com.miproyecto.application.services.habitacion.HabitacionService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IndexController {

    @Autowired
    private HabitacionService habitacionService;

    @GetMapping("/")
    public String index(Model model, HttpSession session) {
        System.out.println("\n=== 🏠 GET / (IndexController) ===");
        System.out.println("Session ID recibido: " + (session != null ? session.getId() : "SESION NULA"));
        
        if (session == null) {
            System.out.println("❌ ERROR: La sesión es NULL");
            return "redirect:/auth/login";
        }
        
        // Listar TODOS los atributos de la sesión
        System.out.println("📋 Atributos en la sesión:");
        java.util.Enumeration<String> attributeNames = session.getAttributeNames();
        boolean hasAttributes = false;
        while (attributeNames.hasMoreElements()) {
            String name = attributeNames.nextElement();
            System.out.println("   - " + name + ": " + session.getAttribute(name));
            hasAttributes = true;
        }
        if (!hasAttributes) {
            System.out.println("   (No hay atributos)");
        }
        
        // Verificar autenticación
        Boolean isAuthenticated = (Boolean) session.getAttribute("isAuthenticated");
        System.out.println("🔍 isAuthenticated obtenido: " + isAuthenticated);
        
        if (isAuthenticated == null || !isAuthenticated) {
            System.out.println("❌ NO autenticado - Redirigiendo a /auth/login");
            return "redirect:/auth/login";
        }
        
        System.out.println("✅ AUTENTICADO - Mostrando index.html");
        
        // Mostrar página
        model.addAttribute("pageTitle", "Inicio");
        model.addAttribute("dbStatus", "Conectada");
        model.addAttribute("serverStatus", "Activo");
        model.addAttribute("serverPort", "8080");
        model.addAttribute("isAuthenticated", true);
        model.addAttribute("usuario", session.getAttribute("usuario"));
        model.addAttribute("rol", session.getAttribute("rol"));
        
        return "index";
    }

    @GetMapping("/reservas")
    public String reservas(Model model, HttpSession session) {
        System.out.println("📅 GET /reservas - Session ID: " + session.getId());
        
        Boolean isAuthenticated = (Boolean) session.getAttribute("isAuthenticated");
        
        if (isAuthenticated == null || !isAuthenticated) {
            return "redirect:/auth/login";
        }
        
        model.addAttribute("pageTitle", "Reservas");
        model.addAttribute("isAuthenticated", true);
        model.addAttribute("usuario", session.getAttribute("usuario"));
        model.addAttribute("rol", session.getAttribute("rol"));
        
        return "reservas";
    }
    
    // Endpoint para probar directamente
    @GetMapping("/test-direct")
    public String testDirect(Model model, HttpSession session) {
        System.out.println("🧪 GET /test-direct");
        
        // Crear sesión manualmente para probar
        if (session.getAttribute("isAuthenticated") == null) {
            System.out.println("Creando sesión de prueba...");
            session.setAttribute("isAuthenticated", true);
            session.setAttribute("rol", "Administrador");
            session.setAttribute("test", "Esta es una prueba");
        }
        
        model.addAttribute("pageTitle", "Prueba Directa");
        model.addAttribute("isAuthenticated", true);
        
        return "index";
    }
}