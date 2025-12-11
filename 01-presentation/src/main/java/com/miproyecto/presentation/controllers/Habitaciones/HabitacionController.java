package com.miproyecto.presentation.controllers.Habitaciones;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.miproyecto.application.services.habitacion.HabitacionService;
import com.miproyecto.domain.entities.habitacion.Habitacion;

@Controller
@RequestMapping("/vistas")
public class HabitacionController {

    @Autowired
    private HabitacionService habitacionService;

    @GetMapping("/habitaciones")
    public String vistaHabitaciones(
            Model model,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Habitacion> paginaHabitaciones = habitacionService.obtenerHabitacionesPaginadas(pageable);

        model.addAttribute("habitaciones", paginaHabitaciones.getContent());
        model.addAttribute("totalHabitaciones", paginaHabitaciones.getTotalElements());
        model.addAttribute("totalPaginas", paginaHabitaciones.getTotalPages());
        model.addAttribute("paginaActual", page);

        return "habitaciones/habitaciones :: vistaHabitaciones";
    }
}
