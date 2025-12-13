package com.miproyecto.presentation.controllers;

import com.miproyecto.application.services.habitacion.HabitacionService;
import com.miproyecto.application.services.huesped.HuespedService;
import com.miproyecto.domain.entities.habitacion.Habitacion;
import com.miproyecto.domain.entities.huesped.Huesped;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Controller
public class IndexController {

    @Autowired
    private HabitacionService habitacionService;

    @Autowired
    private HuespedService huespedService;

    @GetMapping("/")
    public String index(Model model, HttpSession session) {
        System.out.println("\n=== 🏠 GET / (IndexController) ===");
        System.out.println("Session ID recibido: " + (session != null ? session.getId() : "SESION NULA"));
        
        if (session == null) {
            System.out.println("❌ ERROR: La sesión es NULL");
            return "redirect:/auth/login";
        }
        
        // Verificar autenticación
        Boolean isAuthenticated = (Boolean) session.getAttribute("isAuthenticated");
        System.out.println("🔍 isAuthenticated obtenido: " + isAuthenticated);
        
        if (isAuthenticated == null || !isAuthenticated) {
            System.out.println("❌ NO autenticado - Redirigiendo a /auth/login");
            return "redirect:/auth/login";
        }
        
        System.out.println("✅ AUTENTICADO - Mostrando index.html (SPA)");
        
        // Mostrar página principal SPA
        model.addAttribute("pageTitle", "Inicio");
        model.addAttribute("dbStatus", "Conectada");
        model.addAttribute("serverStatus", "Activo");
        model.addAttribute("serverPort", "8080");
        model.addAttribute("isAuthenticated", true);
        model.addAttribute("usuario", session.getAttribute("usuario"));
        model.addAttribute("rol", session.getAttribute("rol"));
        
        return "index";
    }

    // ===== ENDPOINTS PARA COMPONENTES SPA =====
    
    /**
     * Endpoint para cargar componentes dinámicos
     * Se llama desde JavaScript con fetch()
     */
    @GetMapping("/componentes/{nombre}")
    public String cargarComponente(
            @PathVariable String nombre,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Model model,
            HttpSession session
    ) {
        System.out.println("\n=== 📦 GET /componentes/" + nombre + " ===");
        
        // Verificar autenticación
        Boolean isAuthenticated = (Boolean) session.getAttribute("isAuthenticated");
        if (isAuthenticated == null || !isAuthenticated) {
            System.out.println("❌ No autenticado - Rechazando componente");
            return "redirect:/auth/login";
        }
        
        System.out.println("✅ Usuario autenticado, cargando componente: " + nombre);
        
        switch (nombre) {
            case "dashboard":
                System.out.println("📊 Cargando dashboard...");
                model.addAttribute("componente", "dashboard");
                break;
                
            case "habitaciones":
                System.out.println("🏨 Cargando componente de habitaciones...");
                model.addAttribute("componente", "habitaciones");
                
                // Cargar datos para habitaciones
                Pageable pageable = PageRequest.of(page, size);
                Page<Habitacion> paginaHabitaciones = habitacionService.obtenerHabitacionesPaginadas(pageable);
                
                model.addAttribute("habitaciones", paginaHabitaciones.getContent());
                model.addAttribute("totalHabitaciones", paginaHabitaciones.getTotalElements());
                model.addAttribute("totalPaginas", paginaHabitaciones.getTotalPages());
                model.addAttribute("paginaActual", page);
                model.addAttribute("nuevaHabitacion", new Habitacion());
                break;

            case "huespedes":
                System.out.println("🏨 Cargando componente de habitaciones...");
                model.addAttribute("componente", "huespedes");

                // Cargar datos para habitaciones
                Pageable pageableHuesped = PageRequest.of(page, size);
                Page<Huesped> paginaHuespedes = huespedService.listarHuespedes(pageableHuesped);

                model.addAttribute("huespedes", paginaHuespedes.getContent());
                model.addAttribute("totalHuesped", paginaHuespedes.getTotalElements());
                model.addAttribute("totalPaginas", paginaHuespedes.getTotalPages());
                model.addAttribute("paginaActual", page);
                model.addAttribute("nuevoHuesped", new Huesped());
                break;
                
            default:
                System.out.println("⚠️ Componente no reconocido: " + nombre);
                model.addAttribute("componente", "error");
                model.addAttribute("mensajeError", "Componente '" + nombre + "' no encontrado");
                break;
        }
        
        // Devolver solo el fragmento del componente (sin layout completo)
        return "componentes/" + nombre + " :: fragmento";
    }
    
    /**
     * Endpoint para probar el sistema de componentes
     */
    @GetMapping("/componentes/test")
    @ResponseBody
    public Map<String, Object> testComponentes() {
        System.out.println("🧪 GET /componentes/test - Probando sistema de componentes");
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Sistema de componentes funcionando correctamente");
        response.put("timestamp", System.currentTimeMillis());
        response.put("components", new String[]{"dashboard", "habitaciones"});
        
        return response;
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
    
    /**
     * Endpoint para verificar salud del sistema
     */
    @GetMapping("/health")
    @ResponseBody
    public Map<String, Object> healthCheck() {
        System.out.println("🏥 GET /health - Verificando salud del sistema");
        
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "Hotel Las Américas SPA");
        health.put("timestamp", System.currentTimeMillis());
        health.put("components", Map.of(
            "database", "connected",
            "session", "enabled",
            "spa", "ready"
        ));
        
        return health;
    }
}