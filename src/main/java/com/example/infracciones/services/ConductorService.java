package com.example.infracciones.services;

import com.example.infracciones.dto.ConductorDTO;
import com.example.infracciones.entities.Conductor;

import java.util.Optional;

public interface ConductorService extends BaseService<Conductor, ConductorDTO, Long> {
    Optional<ConductorDTO> findByDni(Integer dni);
}