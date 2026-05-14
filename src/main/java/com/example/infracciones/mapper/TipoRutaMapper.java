package com.example.infracciones.mapper;

import com.example.infracciones.dto.TipoRutaDTO;
import com.example.infracciones.entities.TipoRuta;

public class TipoRutaMapper {

    public static TipoRutaDTO toDTO(TipoRuta tipoRuta) {
        if (tipoRuta == null) return null;
        return new TipoRutaDTO(tipoRuta.getId(), tipoRuta.getNombre());
    }

    public static TipoRuta toEntity(TipoRutaDTO dto) {
        if (dto == null) return null;
        TipoRuta tipoRuta = new TipoRuta();
        tipoRuta.setId(dto.getId());
        tipoRuta.setNombre(dto.getNombre());
        return tipoRuta;
    }
}
