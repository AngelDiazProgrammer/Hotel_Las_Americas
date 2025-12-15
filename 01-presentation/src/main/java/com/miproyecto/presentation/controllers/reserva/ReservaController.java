package com.miproyecto.presentation.controllers.reserva;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.miproyecto.application.services.reserva.ReservaService;
import com.miproyecto.domain.entities.reserva.Reserva;
import com.miproyecto.infrastructure.repositories.habitacion.IHabitacionRepository;
import com.miproyecto.infrastructure.repositories.huesped.IHuespedRepository;
import com.miproyecto.infrastructure.repositories.reserva.EstadoReservaRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.HashMap;

@Controller
@RequestMapping("/vistas")
@RequiredArgsConstructor
public class ReservaController {

    private final ReservaService reservaService;
    private final IHuespedRepository huespedRepository;
    private final IHabitacionRepository habitacionRepository;
    private final EstadoReservaRepository estadoReservaRepository;

    @GetMapping("/componentes/reservas")
    public String componenteReserva(
            Model model,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        System.out.println("🗓️ GET /componentes/reservas - Cargando componente SPA");

        Pageable pageable = PageRequest.of(page, size);
        Page<Reserva> paginaReserva = reservaService.listarReservas(pageable); 

        model.addAttribute("reservas", paginaReserva.getContent());
        model.addAttribute("totalReservas", paginaReserva.getTotalElements());
        model.addAttribute("totalPaginas", paginaReserva.getTotalPages());
        model.addAttribute("paginaActual", page);
        model.addAttribute("nuevaReserva", new Reserva());

        model.addAttribute("listaHuespedes", huespedRepository.findAll());
        model.addAttribute("listaHabitaciones", habitacionRepository.findAll());
        model.addAttribute("listaEstadosReserva", estadoReservaRepository.findAll());


        System.out.println("✅ Componente reserva listo: " + paginaReserva.getTotalElements() + " reservas");

        return "reservas/reservas :: vistaReservas";
    }

    // AÑADIR A ReservasApiController.java

    // ----- 4. POST (Creación) -----
    @PostMapping
    public ResponseEntity<Map<String, Object>> crearReserva(@RequestBody Reserva nuevaReserva) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Lógica para guardar la nueva Reserva
            // Aquí debes asegurarte de que tu Service reciba la nuevaReserva 
            // y maneje la conexión de las entidades (Huésped, Habitación, Estado)
            Reserva reservaGuardada = reservaService.guardarReserva(nuevaReserva); 
            
            response.put("success", true);
            response.put("message", "Reserva #" + reservaGuardada.getIdReserva() + " creada con éxito.");
            response.put("data", reservaGuardada);
            return ResponseEntity.status(201).body(response); // 201 Created

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al crear la reserva: " + e.getMessage());
            return ResponseEntity.status(400).body(response); // 400 Bad Request
        }
    }

// Archivo: ReservaController.java (Método POST)

    // 🚨 CAMBIO CLAVE: Cambiar @RequestBody por @ModelAttribute
    @PostMapping("/api/reservas")
    public String crearReserva(
            @ModelAttribute("nuevaReserva") Reserva reserva, // ⬅️ Recibe los datos del formulario tradicional
            BindingResult result,
            RedirectAttributes redirectAttributes
    ) {
        System.out.println("📝 POST /api/reservas - Creando vía Formulario");

        // NOTA: Elimina @ResponseBody y el return de ResponseEntity si usas este método
        // y deseas redireccionar a una vista.

        // ... (Tu lógica de validación aquí) ...

        try {
            reservaService.guardarReserva(reserva);
            redirectAttributes.addFlashAttribute("success", "Reserva creada exitosamente.");
            return "redirect:/vistas/componentes/reservas"; // Redireccionar al componente de la tabla

        } catch (Exception e) {
            System.out.println("❌ Error al crear reserva: " + e.getMessage());
            redirectAttributes.addFlashAttribute("error", "Error al guardar: " + e.getMessage());
            return "redirect:/vistas/componentes/reservas"; // Redireccionar con error
        }
    }

    /**
     * Obtener reserva por ID vía AJAX
     */
    @GetMapping("/api/reservas/{id}")
    @ResponseBody
    public ResponseEntity<ApiResponse<Reserva>> obtenerReservaAjax(@PathVariable Integer id) {
        System.out.println("🔍 GET /api/reservas/" + id + " - Obteniendo vía AJAX");

        try {
            Reserva reserva = reservaService.obtenerReserva(id);

            // CORRECCIÓN: Usar getId()
            System.out.println("✅ Reserva encontrada: " + reserva.getIdReserva()); 
            return ResponseEntity.ok(new ApiResponse<>(
                    true,
                    "Reserva encontrada",
                    reserva
            ));


        } catch (RuntimeException e) {
             System.out.println("❌ Error al obtener reserva: " + e.getMessage());
             return ResponseEntity.status(HttpStatus.NOT_FOUND)
                     .body(new ApiResponse<>(false, "Reserva no encontrada: " + id, null));
        } catch (Exception e) {
            System.out.println("❌ Error al obtener reserva: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error: " + e.getMessage(), null));
        }
    }

    /**
     * Actualizar reserva vía AJAX
     */
    @PutMapping("/api/reservas/{id}")
    @ResponseBody
    public ResponseEntity<ApiResponse<Reserva>> actualizarReservaAjax(
            @PathVariable Integer id,
            @RequestBody Reserva reservaActualizada
    ) {
        System.out.println("🔄 PUT /api/reservas/" + id + " - Actualizando vía AJAX");

        try {
            Reserva actualizada = reservaService.editarReserva(id, reservaActualizada);

            // CORRECCIÓN: Usar getId()
            System.out.println("✅ Reserva actualizada: " + actualizada.getIdReserva()); 

            return ResponseEntity.ok(new ApiResponse<>(
                    true,
                    "Reserva actualizada exitosamente",
                    actualizada
            ));

        } catch (RuntimeException e) {
            System.out.println("❌ Error al actualizar reserva: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            System.out.println("❌ Error interno al actualizar reserva: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error interno: " + e.getMessage(), null));
        }
    }
    
    /**
     * Confirmar reserva vía AJAX (Ej: Poner estado 2: Confirmada)
     */
    @PostMapping("/api/reservas/{id}/confirmar")
    @ResponseBody
    public ResponseEntity<ApiResponse<Reserva>> confirmarReservaAjax(@PathVariable Integer id) {
        System.out.println("✅ POST /api/reservas/" + id + "/confirmar - Confirmando vía AJAX");

        try {
            Reserva confirmada = reservaService.confirmarReserva(id); 

            System.out.println("✅ Reserva confirmada: ID: " + confirmada.getIdReserva());
            return ResponseEntity.ok(new ApiResponse<>(
                    true,
                    "Reserva confirmada exitosamente",
                    confirmada
            ));

        } catch (RuntimeException e) {
            System.out.println("❌ Error al confirmar reserva: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            System.out.println("❌ Error interno al confirmar reserva: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error interno: " + e.getMessage(), null));
        }
    }

    /**
     * Cancelar reserva vía AJAX (Ej: Poner estado 5: Cancelada)
     */
    @PostMapping("/api/reservas/{id}/cancelar")
    @ResponseBody
    public ResponseEntity<ApiResponse<Reserva>> cancelarReservaAjax(@PathVariable Integer id) {
        System.out.println("❌ POST /api/reservas/" + id + "/cancelar - Cancelando vía AJAX");

        try {
            Reserva cancelada = reservaService.cancelarReserva(id); 

            System.out.println("✅ Reserva cancelada: ID: " + cancelada.getIdReserva());
            return ResponseEntity.ok(new ApiResponse<>(
                    true,
                    "Reserva cancelada exitosamente",
                    cancelada
            ));

        } catch (RuntimeException e) {
            System.out.println("❌ Error al cancelar reserva: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            System.out.println("❌ Error interno al cancelar reserva: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error interno: " + e.getMessage(), null));
        }
    }

    /**
     * Eliminar reserva vía AJAX (DELETE)
     */
    @DeleteMapping("/api/reservas/{id}")
    @ResponseBody
    public ResponseEntity<ApiResponse<Void>> eliminarReservaAjax(@PathVariable Integer id) {
        System.out.println("🗑️ DELETE /api/reservas/" + id + " - Eliminando vía AJAX");

        try {
            reservaService.eliminarReserva(id);
            System.out.println("✅ Reserva eliminada: ID: " + id);
            
            return ResponseEntity.ok(new ApiResponse<>(
                    true,
                    "Reserva eliminada exitosamente",
                    null
            ));

        } catch (RuntimeException e) {
            System.out.println("❌ Error al eliminar reserva: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            System.out.println("❌ Error interno al eliminar reserva: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error interno: " + e.getMessage(), null));
        }
    }
    
    /**
     * Obtener estadísticas de reservas vía AJAX (Mantiene consistencia)
     */
    @GetMapping("/api/reservas/estadisticas")
    @ResponseBody
    public ResponseEntity<ApiResponse<Map<String, Object>>> obtenerEstadisticasReservasAjax() {
        System.out.println("📊 GET /api/reservas/estadisticas - Estadísticas vía AJAX");
        
        try {
            // Asumo que tu servicio tiene estos métodos
            long total = reservaService.contarReservas(); 
            long confirmadas = reservaService.contarReservasConfirmadas();
            long pendientes = total - confirmadas; // Esta lógica depende de la definición de "pendientes"
            double porcentajeConfirmadas = total > 0 ? (confirmadas * 100.0) / total : 0;
            
            Map<String, Object> datos = new HashMap<>();
            datos.put("total", total);
            datos.put("confirmadas", confirmadas);
            datos.put("pendientes", pendientes);
            datos.put("porcentajeConfirmadas", Math.round(porcentajeConfirmadas * 10.0) / 10.0);
            
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


    // =======================================================
    // MÉTODOS TRADICIONALES (MANTENER POR COMPATIBILIDAD)
    // =======================================================
    
    /**
     * Mantener actualización tradicional para compatibilidad (Redirecciona)
     */
    @PostMapping("/reservas/actualizar/{id}")
    public String actualizarReserva(
            @PathVariable Integer id,
            @ModelAttribute Reserva reserva,
            RedirectAttributes redirectAttributes
    ) {
        System.out.println("🔄 POST /vistas/reservas/actualizar/" + id + " - Tradicional");

        try {
            reservaService.editarReserva(id, reserva);
            redirectAttributes.addFlashAttribute("success", "Reserva actualizada exitosamente!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al actualizar reserva: " + e.getMessage());
        }
        return "redirect:/vistas/reservas";
    }
    

    // =======================================================
    // CLASE INTERNA DE RESPUESTA DE API
    // =======================================================

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