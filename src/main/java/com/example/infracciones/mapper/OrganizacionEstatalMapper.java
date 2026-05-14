package com.example.infracciones.mapper;

import com.example.infracciones.dto.OrganizacionEstatalDTO;
import com.example.infracciones.entities.OrganizacionEstatal;

public class OrganizacionEstatalMapper {

    public static OrganizacionEstatalDTO toDTO(OrganizacionEstatal org) {
        if (org == null) return null;
        return new OrganizacionEstatalDTO(org.getId(), org.getNombre());
    }

    public static OrganizacionEstatal toEntity(OrganizacionEstatalDTO dto) {
        if (dto == null) return null;
        OrganizacionEstatal org = new OrganizacionEstatal();
        org.setId(dto.getId());
        org.setNombre(dto.getNombre());
        return org;
    }
}
