package com.example.infracciones.services;

import com.example.infracciones.dto.AutoridadDeConstatacionDTO;
import com.example.infracciones.entities.AutoridadDeConstatacion;

import java.util.Optional;

public interface AutoridadDeConstatacionService extends BaseService<AutoridadDeConstatacion, AutoridadDeConstatacionDTO, Long> {
    Optional<AutoridadDeConstatacionDTO> findByLegajo(Integer idLegajo);
    Optional<AutoridadDeConstatacionDTO> findByDni(Integer dni);
}