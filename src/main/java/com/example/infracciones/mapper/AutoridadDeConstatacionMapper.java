package com.example.infracciones.mapper;


import com.example.infracciones.dto.AutoridadDeConstatacionDTO;
import com.example.infracciones.entities.AutoridadDeConstatacion;

public class AutoridadDeConstatacionMapper {

    public static AutoridadDeConstatacionDTO toDTO(AutoridadDeConstatacion autoridad) {
        if (autoridad == null) return null;
        return new AutoridadDeConstatacionDTO(
                autoridad.getId(),
                autoridad.getDni(),
                autoridad.getNombre(),
                autoridad.getApellido(),
                autoridad.getGenero(),
                autoridad.getIdLegajo(),
                autoridad.getIdPlaca(),
                OrganizacionEstatalMapper.toDTO(autoridad.getOrganizacionEstatal())
        );
    }

    public static AutoridadDeConstatacion toEntity(AutoridadDeConstatacionDTO dto) {
        if (dto == null) return null;
        AutoridadDeConstatacion autoridad = new AutoridadDeConstatacion();
        autoridad.setId(dto.getId());
        autoridad.setDni(dto.getDni());
        autoridad.setNombre(dto.getNombre());
        autoridad.setApellido(dto.getApellido());
        autoridad.setGenero(dto.getGenero());
        autoridad.setIdLegajo(dto.getIdLegajo());
        autoridad.setIdPlaca(dto.getIdPlaca());
        autoridad.setOrganizacionEstatal(OrganizacionEstatalMapper.toEntity(dto.getOrganizacionEstatal()));
        return autoridad;
    }
}
