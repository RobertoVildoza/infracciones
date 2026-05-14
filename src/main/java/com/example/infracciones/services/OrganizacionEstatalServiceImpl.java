package com.example.infracciones.services;

import com.example.infracciones.dto.OrganizacionEstatalDTO;
import com.example.infracciones.entities.OrganizacionEstatal;
import com.example.infracciones.mapper.OrganizacionEstatalMapper;
import com.example.infracciones.repositories.OrganizacionEstatalRepository;
import org.springframework.stereotype.Service;

@Service
public class OrganizacionEstatalServiceImpl
        extends BaseServiceImpl<OrganizacionEstatal, OrganizacionEstatalDTO, Long>
        implements OrganizacionEstatalService {

    public OrganizacionEstatalServiceImpl(OrganizacionEstatalRepository repository) {
        super(repository);
    }

    @Override
    protected OrganizacionEstatalDTO toDTO(OrganizacionEstatal entity) {
        return OrganizacionEstatalMapper.toDTO(entity);
    }

    @Override
    protected OrganizacionEstatal toEntity(OrganizacionEstatalDTO dto) {
        return OrganizacionEstatalMapper.toEntity(dto);
    }
}