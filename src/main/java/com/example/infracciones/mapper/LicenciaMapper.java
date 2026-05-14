package com.example.infracciones.mapper;


import com.example.infracciones.dto.LicenciaDTO;
import com.example.infracciones.entities.Licencia;

public class LicenciaMapper {

    public static LicenciaDTO toDTO(Licencia licencia) {
        if (licencia == null) return null;
        return new LicenciaDTO(
                licencia.getId(),
                licencia.getClase(),
                licencia.getFechaVto(),
                ConductorMapper.toDTO(licencia.getConductor())
        );
    }

    public static Licencia toEntity(LicenciaDTO dto) {
        if (dto == null) return null;
        Licencia licencia = new Licencia();
        licencia.setId(dto.getId());
        licencia.setClase(dto.getClase());
        licencia.setFechaVto(dto.getFechaVto());
        licencia.setConductor(ConductorMapper.toEntity(dto.getConductor()));
        return licencia;
    }
}
