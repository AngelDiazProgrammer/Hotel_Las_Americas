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


    @GetMapping("/reservas")
    public String reservas(Model model) {
        model.addAttribute("pageTitle", "Reservas");
        return "reservas";
    }
}