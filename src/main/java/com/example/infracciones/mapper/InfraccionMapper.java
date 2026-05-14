package com.example.infracciones.mapper;

import com.example.infracciones.dto.InfraccionDTO;
import com.example.infracciones.entities.Infraccion;

import java.util.stream.Collectors;

public class InfraccionMapper {

    public static InfraccionDTO toDTO(Infraccion infraccion) {
        if (infraccion == null) return null;
        return new InfraccionDTO(
                infraccion.getId(),
                infraccion.getDescripcion(),
                infraccion.getImporte(),
                infraccion.getTiposInfraccion().stream()
                        .map(TipoDeInfraccionMapper::toDTO)
                        .collect(Collectors.toList())
        );
    }

    public static Infraccion toEntity(InfraccionDTO dto) {
        if (dto == null) return null;
        Infraccion infraccion = new Infraccion();
        infraccion.setId(dto.getId());
        infraccion.setDescripcion(dto.getDescripcion());
        infraccion.setImporte(dto.getImporte());
        if (dto.getTiposInfraccion() != null) {
            infraccion.setTiposInfraccion(
                    dto.getTiposInfraccion().stream()
                            .map(TipoDeInfraccionMapper::toEntity)
                            .collect(Collectors.toList())
            );
        }
        return infraccion;
    }
}
