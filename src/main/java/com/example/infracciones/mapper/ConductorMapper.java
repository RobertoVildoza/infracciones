package com.example.infracciones.mapper;

import com.example.infracciones.dto.ConductorDTO;
import com.example.infracciones.entities.Conductor;

public class ConductorMapper {

    public static ConductorDTO toDTO(Conductor conductor) {
        if (conductor == null) return null;
        return new ConductorDTO(
                conductor.getId(),
                conductor.getDni(),
                conductor.getNombre(),
                conductor.getApellido(),
                conductor.getGenero(),
                conductor.getDomicilio()
        );
    }

    public static Conductor toEntity(ConductorDTO dto) {
        if (dto == null) return null;
        Conductor conductor = new Conductor();
        conductor.setId(dto.getId());
        conductor.setDni(dto.getDni());
        conductor.setNombre(dto.getNombre());
        conductor.setApellido(dto.getApellido());
        conductor.setGenero(dto.getGenero());
        conductor.setDomicilio(dto.getDomicilio());
        return conductor;
    }
}
