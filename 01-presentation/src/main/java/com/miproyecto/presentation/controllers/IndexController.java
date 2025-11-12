package com.miproyecto.presentation.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

// Importar con la estructura organizada
import com.miproyecto.application.services.habitacion.HabitacionService;
import com.miproyecto.domain.entities.habitacion.Habitacion;
import java.util.List;

@Controller
public class IndexController {

    @Autowired
    private HabitacionService habitacionService;

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("pageTitle", "Inicio");
        model.addAttribute("dbStatus", "Conectada");
        model.addAttribute("serverStatus", "Activo");
        model.addAttribute("serverPort", "8080");
        return "index";
    }

@GetMapping("/habitaciones")
public String habitaciones(Model model) {
    List<Habitacion> habitaciones = habitacionService.obtenerTodasLasHabitaciones();
    model.addAttribute("pageTitle", "Habitaciones");
    model.addAttribute("habitaciones", habitaciones);
    model.addAttribute("totalHabitaciones", habitaciones.size());
    return "habitaciones/habitaciones";
}

    @GetMapping("/reservas")
    public String reservas(Model model) {
        model.addAttribute("pageTitle", "Reservas");
        return "reservas";
    }
}