package com.miproyecto.presentation.controllers.huesped;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.miproyecto.application.services.huesped.HuespedService;
import com.miproyecto.domain.entities.habitacion.Habitacion;
import com.miproyecto.domain.entities.huesped.Huesped;
import com.miproyecto.presentation.controllers.Habitaciones.HabitacionController;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.LocalDateTime;
import java.util.Optional;

@Controller
@RequestMapping("/vistas")
@RequiredArgsConstructor
public class HuespedController {

    private final HuespedService huespedService;

    @GetMapping("/componentes/huespedes")
    public String componenteHuesped(
            Model model,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        System.out.println("🏨 GET /componentes/huespedes - Cargando componente SPA");

        Pageable pageable = PageRequest.of(page, size);
        Page<Huesped> paginaHuesped = huespedService.listarHuespedes(pageable);

        model.addAttribute("huespedes", paginaHuesped.getContent());
        model.addAttribute("totalHuespedes", paginaHuesped.getTotalElements());
        model.addAttribute("totalPaginas", paginaHuesped.getTotalPages());
        model.addAttribute("paginaActual", page);
        model.addAttribute("nuevoHuesped", new Huesped());

        System.out.println("✅ Componente huesped listo: " + paginaHuesped.getTotalElements() + " huesped");

        return "huespedes/huespedes :: vistaHuespedes";
    }

    @PostMapping("/api/huespedes")
    @ResponseBody
    public ResponseEntity<HuespedController.ApiResponse<Huesped>> crearHuespedAjax(@RequestBody Huesped huesped) {
        System.out.println("📝 POST /api/huespedes - Creando vía AJAX");

        try {
            // Guardar
            Huesped huespedGuardado = huespedService.guardarHuesped(huesped);

            return ResponseEntity.ok(new HuespedController.ApiResponse<>(
                    true,
                    "huesped creado exitosamente",
                    huespedGuardado
            ));

        } catch (Exception e) {
            System.out.println("❌ Error al crear habitación: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new HuespedController.ApiResponse<>(false, "Error: " + e.getMessage(), null));
        }
    }

    @GetMapping("/api/huespedes/{id}")
    @ResponseBody
    public ResponseEntity<HuespedController.ApiResponse<Huesped>> obtenerHuespedAjax(@PathVariable Integer id) {
        System.out.println("🔍 GET /api/huesped/" + id + " - Obteniendo vía AJAX");

        try {
            Huesped huesped = huespedService.obtenerHuesped(id);

            System.out.println("✅ Huesped encontrado: " + huesped.getId());
            return ResponseEntity.ok(new HuespedController.ApiResponse<>(
                    true,
                    "Huesped encontrado",
                    huesped
            ));


        } catch (Exception e) {
            System.out.println("❌ Error al obtener: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new HuespedController.ApiResponse<>(false, "Error: " + e.getMessage(), null));
        }
    }

    @PutMapping("/api/huespedes/{id}")
    @ResponseBody
    public ResponseEntity<HuespedController.ApiResponse<Huesped>> actualizarHuespedAjax(
            @PathVariable Integer id,
            @RequestBody Huesped huespedActualizado
    ) {
        System.out.println("🔄 PUT /api/habitaciones/" + id + " - Actualizando vía AJAX");

        try {
            Huesped actualizada = huespedService.editarHuesped(id, huespedActualizado);

            System.out.println("✅ Huesped actualizaoa: " + actualizada.getId());

            return ResponseEntity.ok(new HuespedController.ApiResponse<>(
                    true,
                    "Huesped actualizado exitosamente",
                    actualizada
            ));

        } catch (RuntimeException e) {
            System.out.println("❌ Error al actualizar: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new HuespedController.ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            System.out.println("❌ Error interno: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new HuespedController.ApiResponse<>(false, "Error interno: " + e.getMessage(), null));
        }
    }

    @PostMapping("/huespedes/actualizar/{id}")
    public String actualizarHuesped(
            @PathVariable Integer id,
            @ModelAttribute Huesped huesped,
            RedirectAttributes redirectAttributes
    ) {
        System.out.println("🔄 POST /vistas/huespedes/actualizar/" + id + " - Tradicional");

        try {
            huespedService.editarHuesped(id, huesped);
            redirectAttributes.addFlashAttribute("success", "Huesped actualizado exitosamente!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al actualizar: " + e.getMessage());
        }
        return "redirect:/vistas/huespedes";
    }

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
