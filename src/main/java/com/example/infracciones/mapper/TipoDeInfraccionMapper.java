package com.example.infracciones.mapper;

import com.example.infracciones.dto.TipoDeInfraccionDTO;
import com.example.infracciones.entities.TipoDeInfraccion;

public class TipoDeInfraccionMapper {

    public static TipoDeInfraccionDTO toDTO(TipoDeInfraccion tipo) {
        if (tipo == null) return null;
        return new TipoDeInfraccionDTO(tipo.getId(), tipo.getCodigo(), tipo.getDescripcion());
    }

    public static TipoDeInfraccion toEntity(TipoDeInfraccionDTO dto) {
        if (dto == null) return null;
        TipoDeInfraccion tipo = new TipoDeInfraccion();
        tipo.setId(dto.getId());
        tipo.setCodigo(dto.getCodigo());
        tipo.setDescripcion(dto.getDescripcion());
        return tipo;
    }
}
