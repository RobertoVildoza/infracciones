package com.example.infracciones.mapper;

import com.example.infracciones.dto.MarcaDTO;
import com.example.infracciones.entities.Marca;

public class MarcaMapper {

    public static MarcaDTO toDTO(Marca marca) {
        if (marca == null) return null;
        return new MarcaDTO(marca.getId(), marca.getNombre());
    }

    public static Marca toEntity(MarcaDTO dto) {
        if (dto == null) return null;
        Marca marca = new Marca();
        marca.setId(dto.getId());
        marca.setNombre(dto.getNombre());
        return marca;
    }
}