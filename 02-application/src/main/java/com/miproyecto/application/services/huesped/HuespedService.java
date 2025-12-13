package com.miproyecto.application.services.huesped;

import com.miproyecto.domain.entities.huesped.Huesped;
import com.miproyecto.infrastructure.repositories.huesped.IHuespedRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class HuespedService {

    private final IHuespedRepository huespedRepository;

    @Transactional
    public Huesped guardarHuesped(Huesped huesped) {
        return huespedRepository.save(huesped);
    }

    @Transactional(readOnly = true)
    public Page<Huesped> listarHuespedes(Pageable pageable) {
        return huespedRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Huesped obtenerHuesped(Integer id) {
        return huespedRepository.findById(id)
                .orElseThrow(()-> new EntityNotFoundException("Huesped no encontrado por el ID:" + id));
    }

    @Transactional
    public Huesped editarHuesped(Integer id, Huesped huespedActualizado) {
        return huespedRepository.findById(id)
                .map(huesped -> {
                    huesped.setNombres(huespedActualizado.getNombres());
                    huesped.setApellidos(huespedActualizado.getApellidos());
                    huesped.setId_tipo_documento(huespedActualizado.getId_tipo_documento());
                    huesped.setDocumento(huespedActualizado.getDocumento());
                    huesped.setEmail(huespedActualizado.getEmail());
                    huesped.setTelefono(huespedActualizado.getTelefono());
                    huesped.setDireccion(huespedActualizado.getDireccion());
                    huesped.setId_estado_huesped(huespedActualizado.getId_estado_huesped());
                    return huespedRepository.save(huesped);
                })
                .orElseThrow(() -> new EntityNotFoundException("Huesped no encontrado con ID: " + id));
    }

}
