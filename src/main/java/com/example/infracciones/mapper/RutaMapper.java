package com.example.infracciones.mapper;

import com.example.infracciones.dto.RutaDTO;
import com.example.infracciones.entities.Ruta;

public class RutaMapper {

    public static RutaDTO toDTO(Ruta ruta) {
        if (ruta == null) return null;
        return new RutaDTO(
                ruta.getId(),
                ruta.getNombre(),
                ruta.getKilometro(),
                TipoRutaMapper.toDTO(ruta.getTipoRuta())
        );
    }

    public static Ruta toEntity(RutaDTO dto) {
        if (dto == null) return null;
        Ruta ruta = new Ruta();
        ruta.setId(dto.getId());
        ruta.setNombre(dto.getNombre());
        ruta.setKilometro(dto.getKilometro());
        ruta.setTipoRuta(TipoRutaMapper.toEntity(dto.getTipoRuta()));
        return ruta;
    }
}
