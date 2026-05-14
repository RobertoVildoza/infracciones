package com.example.infracciones.services;

import com.example.infracciones.dto.LicenciaDTO;
import com.example.infracciones.entities.Licencia;

import java.util.List;

public interface LicenciaService extends BaseService<Licencia, LicenciaDTO, Long> {
    List<LicenciaDTO> findByConductorId(Long conductorId);
}