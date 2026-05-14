package com.example.infracciones.mapper;


import com.example.infracciones.dto.EstadoDelActaDTO;
import com.example.infracciones.entities.EstadoDelActa;

public class EstadoDelActaMapper {

    public static EstadoDelActaDTO toDTO(EstadoDelActa estado) {
        if (estado == null) return null;
        return new EstadoDelActaDTO(estado.getId(), estado.getNombreEstadoActa());
    }

    public static EstadoDelActa toEntity(EstadoDelActaDTO dto) {
        if (dto == null) return null;
        EstadoDelActa estado = new EstadoDelActa();
        estado.setId(dto.getId());
        estado.setNombreEstadoActa(dto.getNombreEstadoActa());
        return estado;
    }
}