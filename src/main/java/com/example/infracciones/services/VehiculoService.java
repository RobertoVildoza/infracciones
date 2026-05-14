package com.example.infracciones.services;

import com.example.infracciones.dto.VehiculoDTO;
import com.example.infracciones.entities.Vehiculo;

import java.util.Optional;

public interface VehiculoService extends BaseService<Vehiculo, VehiculoDTO, Long> {
    Optional<VehiculoDTO> findByDominio(String dominio);
}
