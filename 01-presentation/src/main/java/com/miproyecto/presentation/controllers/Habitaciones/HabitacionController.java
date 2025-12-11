package com.miproyecto.presentation.controllers.Habitaciones;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.miproyecto.application.services.habitacion.HabitacionService;
import com.miproyecto.domain.entities.habitacion.Habitacion;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Controller
@RequestMapping("/vistas")
public class HabitacionController {

    @Autowired
    private HabitacionService habitacionService;

    // ===== ENDPOINTS PARA COMPONENTES THYMELEAF =====
    
    /**
     * Endpoint para cargar el componente de habitaciones en SPA
     * Se llama desde: cargarComponente('habitaciones')
     */
@GetMapping("/componentes/habitaciones")
public String componenteHabitaciones(
        Model model,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
) {
    System.out.println("🏨 GET /componentes/habitaciones - Cargando componente SPA");
    
    Pageable pageable = PageRequest.of(page, size);
    Page<Habitacion> paginaHabitaciones = habitacionService.obtenerHabitacionesPaginadas(pageable);

    model.addAttribute("habitaciones", paginaHabitaciones.getContent());
    model.addAttribute("totalHabitaciones", paginaHabitaciones.getTotalElements());
    model.addAttribute("totalPaginas", paginaHabitaciones.getTotalPages());
    model.addAttribute("paginaActual", page);
    model.addAttribute("nuevaHabitacion", new Habitacion());

    System.out.println("✅ Componente habitaciones listo: " + paginaHabitaciones.getTotalElements() + " habitaciones");
    
    // CAMBIA ESTA LÍNEA:
    // return "componentes/habitaciones :: fragmento"; ← Antes
    return "habitaciones/habitaciones :: vistaHabitaciones"; // ← Ahora
}

    // ===== ENDPOINTS PARA API/REST (AJAX) =====
    
    /**
     * Crear habitación vía AJAX (retorna JSON)
     */
    @PostMapping("/api/habitaciones")
    @ResponseBody
    public ResponseEntity<ApiResponse<Habitacion>> crearHabitacionAjax(@RequestBody Habitacion habitacion) {
        System.out.println("📝 POST /api/habitaciones - Creando vía AJAX");
        
        try {
            // Validaciones
            if (habitacion.getNumeroHabitacion() == null || habitacion.getNumeroHabitacion().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse<>(false, "El número de habitación es requerido", null));
            }
            
            if (habitacionService.existeHabitacionPorNumero(habitacion.getNumeroHabitacion())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(new ApiResponse<>(false, "Ya existe una habitación con ese número", null));
            }
            
            // Establecer valores por defecto
            habitacion.setEstadoHabitacionId(1); // Habilitada por defecto
            
            // Guardar
            Habitacion habitacionGuardada = habitacionService.guardarHabitacion(habitacion);
            
            System.out.println("✅ Habitación creada: " + habitacionGuardada.getNumeroHabitacion() + " (ID: " + habitacionGuardada.getId() + ")");
            
            return ResponseEntity.ok(new ApiResponse<>(
                true, 
                "Habitación creada exitosamente", 
                habitacionGuardada
            ));
            
        } catch (Exception e) {
            System.out.println("❌ Error al crear habitación: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error: " + e.getMessage(), null));
        }
    }
    
    /**
     * Actualizar habitación vía AJAX (retorna JSON)
     */
    @PutMapping("/api/habitaciones/{id}")
    @ResponseBody
    public ResponseEntity<ApiResponse<Habitacion>> actualizarHabitacionAjax(
            @PathVariable Integer id,
            @RequestBody Habitacion habitacionActualizada
    ) {
        System.out.println("🔄 PUT /api/habitaciones/" + id + " - Actualizando vía AJAX");
        
        try {
            Habitacion actualizada = habitacionService.actualizarHabitacion(id, habitacionActualizada);
            
            System.out.println("✅ Habitación actualizada: " + actualizada.getNumeroHabitacion());
            
            return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Habitación actualizada exitosamente",
                actualizada
            ));
            
        } catch (RuntimeException e) {
            System.out.println("❌ Error al actualizar: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            System.out.println("❌ Error interno: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error interno: " + e.getMessage(), null));
        }
    }
    
    /**
     * Obtener habitación para editar vía AJAX (retorna JSON)
     */
    @GetMapping("/api/habitaciones/{id}")
    @ResponseBody
    public ResponseEntity<ApiResponse<Habitacion>> obtenerHabitacionAjax(@PathVariable Integer id) {
        System.out.println("🔍 GET /api/habitaciones/" + id + " - Obteniendo vía AJAX");
        
        try {
            Optional<Habitacion> habitacion = habitacionService.obtenerHabitacionPorId(id);
            
            if (habitacion.isPresent()) {
                System.out.println("✅ Habitación encontrada: " + habitacion.get().getNumeroHabitacion());
                return ResponseEntity.ok(new ApiResponse<>(
                    true,
                    "Habitación encontrada",
                    habitacion.get()
                ));
            } else {
                System.out.println("❌ Habitación no encontrada: " + id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse<>(false, "Habitación no encontrada", null));
            }
            
        } catch (Exception e) {
            System.out.println("❌ Error al obtener: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error: " + e.getMessage(), null));
        }
    }
    
    /**
     * Inhabilitar habitación vía AJAX (retorna JSON)
     */
    @PostMapping("/api/habitaciones/{id}/inhabilitar")
    @ResponseBody
    public ResponseEntity<ApiResponse<Habitacion>> inhabilitarHabitacionAjax(@PathVariable Integer id) {
        System.out.println("🚫 POST /api/habitaciones/" + id + "/inhabilitar - Inhabilitando vía AJAX");
        
        try {
            Habitacion habitacion = habitacionService.inhabilitarHabitacion(id);
            
            System.out.println("✅ Habitación inhabilitada: " + habitacion.getNumeroHabitacion());
            
            return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Habitación inhabilitada exitosamente",
                habitacion
            ));
            
        } catch (RuntimeException e) {
            System.out.println("❌ Error al inhabilitar: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            System.out.println("❌ Error interno: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error: " + e.getMessage(), null));
        }
    }
    
    /**
     * Habilitar habitación vía AJAX (retorna JSON)
     */
    @PostMapping("/api/habitaciones/{id}/habilitar")
    @ResponseBody
    public ResponseEntity<ApiResponse<Habitacion>> habilitarHabitacionAjax(@PathVariable Integer id) {
        System.out.println("✅ POST /api/habitaciones/" + id + "/habilitar - Habilitando vía AJAX");
        
        try {
            Habitacion habitacion = habitacionService.habilitarHabitacion(id);
            
            System.out.println("✅ Habitación habilitada: " + habitacion.getNumeroHabitacion());
            
            return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Habitación habilitada exitosamente",
                habitacion
            ));
            
        } catch (RuntimeException e) {
            System.out.println("❌ Error al habilitar: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            System.out.println("❌ Error interno: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error: " + e.getMessage(), null));
        }
    }
    
    /**
     * Obtener estadísticas vía AJAX (retorna JSON)
     */
    @GetMapping("/api/habitaciones/estadisticas")
    @ResponseBody
    public ResponseEntity<ApiResponse<Map<String, Object>>> obtenerEstadisticasAjax() {
        System.out.println("📊 GET /api/habitaciones/estadisticas - Estadísticas vía AJAX");
        
        try {
            String estadisticas = habitacionService.obtenerEstadisticas();
            long total = habitacionService.contarHabitaciones();
            long disponibles = habitacionService.contarHabitacionesDisponibles();
            double porcentaje = total > 0 ? (disponibles * 100.0) / total : 0;
            
            Map<String, Object> datos = new HashMap<>();
            datos.put("texto", estadisticas);
            datos.put("total", total);
            datos.put("disponibles", disponibles);
            datos.put("ocupadas", total - disponibles);
            datos.put("porcentajeDisponibles", Math.round(porcentaje * 10.0) / 10.0);
            datos.put("timestamp", LocalDateTime.now().toString());
            
            System.out.println("✅ Estadísticas generadas: " + estadisticas);
            
            return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Estadísticas obtenidas",
                datos
            ));
            
        } catch (Exception e) {
            System.out.println("❌ Error en estadísticas: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error: " + e.getMessage(), null));
        }
    }
    
    /**
     * Verificar si existe número de habitación (para validación en tiempo real)
     */
    @GetMapping("/api/habitaciones/verificar-numero/{numero}")
    @ResponseBody
    public ResponseEntity<ApiResponse<Boolean>> verificarNumeroHabitacion(@PathVariable String numero) {
        System.out.println("🔢 GET /api/habitaciones/verificar-numero/" + numero);
        
        boolean existe = habitacionService.existeHabitacionPorNumero(numero);
        
        return ResponseEntity.ok(new ApiResponse<>(
            true,
            existe ? "El número ya existe" : "Número disponible",
            existe
        ));
    }

    // ===== ENDPOINTS PARA COMPATIBILIDAD (mantener funcionando) =====
    
    /**
     * Mantener endpoint original para compatibilidad
     */
    @GetMapping("/habitaciones")
    public String vistaHabitaciones(
            Model model,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        System.out.println("📋 GET /vistas/habitaciones - Vista tradicional (compatibilidad)");
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Habitacion> paginaHabitaciones = habitacionService.obtenerHabitacionesPaginadas(pageable);

        model.addAttribute("habitaciones", paginaHabitaciones.getContent());
        model.addAttribute("totalHabitaciones", paginaHabitaciones.getTotalElements());
        model.addAttribute("totalPaginas", paginaHabitaciones.getTotalPages());
        model.addAttribute("paginaActual", page);
        model.addAttribute("nuevaHabitacion", new Habitacion());

        return "habitaciones/habitaciones :: vistaHabitaciones";
    }
    
    /**
     * Mantener creación tradicional para compatibilidad
     */
    @PostMapping("/habitaciones/crear")
    public String crearHabitacion(
            @ModelAttribute("nuevaHabitacion") Habitacion habitacion,
            RedirectAttributes redirectAttributes
    ) {
        System.out.println("📝 POST /vistas/habitaciones/crear - Creación tradicional");
        
        try {
            habitacion.setEstadoHabitacionId(1);
            habitacionService.guardarHabitacion(habitacion);
            redirectAttributes.addFlashAttribute("success", "Habitación creada exitosamente!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al crear habitación: " + e.getMessage());
        }
        
        return "redirect:/vistas/habitaciones";
    }
    
    /**
     * Mantener endpoint de obtención para compatibilidad
     */
    @GetMapping("/habitaciones/obtener/{id}")
    @ResponseBody
    public Habitacion obtenerHabitacionParaEditar(@PathVariable Integer id) {
        System.out.println("🔍 GET /vistas/habitaciones/obtener/" + id + " - Tradicional");
        return habitacionService.obtenerHabitacionPorId(id)
                .orElseThrow(() -> new RuntimeException("Habitación no encontrada"));
    }
    
    /**
     * Mantener actualización tradicional para compatibilidad
     */
    @PostMapping("/habitaciones/actualizar/{id}")
    public String actualizarHabitacion(
            @PathVariable Integer id,
            @ModelAttribute Habitacion habitacionActualizada,
            RedirectAttributes redirectAttributes
    ) {
        System.out.println("🔄 POST /vistas/habitaciones/actualizar/" + id + " - Tradicional");
        
        try {
            habitacionService.actualizarHabitacion(id, habitacionActualizada);
            redirectAttributes.addFlashAttribute("success", "Habitación actualizada exitosamente!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al actualizar: " + e.getMessage());
        }
        return "redirect:/vistas/habitaciones";
    }
    
    /**
     * Mantener inhabilitación tradicional para compatibilidad
     */
    @PostMapping("/habitaciones/inhabilitar/{id}")
    public String inhabilitarHabitacion(
            @PathVariable Integer id,
            RedirectAttributes redirectAttributes
    ) {
        System.out.println("🚫 POST /vistas/habitaciones/inhabilitar/" + id + " - Tradicional");
        
        try {
            habitacionService.inhabilitarHabitacion(id);
            redirectAttributes.addFlashAttribute("success", "Habitación inhabilitada exitosamente!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al inhabilitar: " + e.getMessage());
        }
        return "redirect:/vistas/habitaciones";
    }
    
    /**
     * Mantener habilitación tradicional para compatibilidad
     */
    @PostMapping("/habitaciones/habilitar/{id}")
    public String habilitarHabitacion(
            @PathVariable Integer id,
            RedirectAttributes redirectAttributes
    ) {
        System.out.println("✅ POST /vistas/habitaciones/habilitar/" + id + " - Tradicional");
        
        try {
            habitacionService.habilitarHabitacion(id);
            redirectAttributes.addFlashAttribute("success", "Habitación habilitada exitosamente!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al habilitar: " + e.getMessage());
        }
        return "redirect:/vistas/habitaciones";
    }
    
    /**
     * Mantener estadísticas tradicionales para compatibilidad
     */
    @GetMapping("/habitaciones/estadisticas")
    @ResponseBody
    public String obtenerEstadisticas() {
        System.out.println("📊 GET /vistas/habitaciones/estadisticas - Tradicional");
        return habitacionService.obtenerEstadisticas();
    }

    // ===== CLASES INTERNAS PARA RESPUESTAS JSON =====
    
    /**
     * Clase para respuestas API estandarizadas
     */
    @Data
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ApiResponse<T> {
        private boolean success;
        private String message;
        private T data;
        private String timestamp;
        
        public ApiResponse(boolean success, String message, T data) {
            this.success = success;
            this.message = message;
            this.data = data;
            this.timestamp = LocalDateTime.now().toString();
        }
    }
}