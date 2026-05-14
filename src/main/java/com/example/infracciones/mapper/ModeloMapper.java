package com.example.infracciones.mapper;

import com.example.infracciones.dto.ModeloDTO;
import com.example.infracciones.entities.Modelo;

public class ModeloMapper {

    public static ModeloDTO toDTO(Modelo modelo) {
        if (modelo == null) return null;
        return new ModeloDTO(modelo.getId(), modelo.getNombre());
    }

    public static Modelo toEntity(ModeloDTO dto) {
        if (dto == null) return null;
        Modelo modelo = new Modelo();
        modelo.setId(dto.getId());
        modelo.setNombre(dto.getNombre());
        return modelo;
    }
}
