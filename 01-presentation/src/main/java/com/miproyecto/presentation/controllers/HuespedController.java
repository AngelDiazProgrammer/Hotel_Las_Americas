package com.miproyecto.presentation.controllers;


import com.miproyecto.application.services.huesped.HuespedService;
import com.miproyecto.domain.entities.huesped.Huesped;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/huespedes")
@RequiredArgsConstructor
public class HuespedController {

    private final HuespedService huespedService;

    @PostMapping
    private Huesped guardarHuesped(@RequestBody Huesped huesped) {
        return huespedService.guardarHuesped(huesped);
    }

    @GetMapping
    private List<Huesped> listarHuespedes() {
        return huespedService.listarHuespedes();
    }

    @GetMapping("/{id}")
    private Huesped obtenerHuesped(@PathVariable Integer id) {
        return huespedService.obtenerHuesped(id);
    }

    @PutMapping("/{id}")
    private Huesped editarHuesped(@PathVariable Integer id, @RequestBody Huesped huespedActualizado) {
        return huespedService.editarHuesped(id, huespedActualizado);
    }
}
