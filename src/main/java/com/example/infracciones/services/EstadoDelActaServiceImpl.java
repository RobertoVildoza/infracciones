package com.example.infracciones.services;

import com.example.infracciones.dto.EstadoDelActaDTO;
import com.example.infracciones.entities.EstadoDelActa;
import com.example.infracciones.mapper.EstadoDelActaMapper;
import com.example.infracciones.repositories.EstadoDelActaRepository;
import org.springframework.stereotype.Service;

@Service
public class EstadoDelActaServiceImpl
        extends BaseServiceImpl<EstadoDelActa, EstadoDelActaDTO, Long>
        implements EstadoDelActaService {

    public EstadoDelActaServiceImpl(EstadoDelActaRepository repository) {
        super(repository);
    }

    @Override
    protected EstadoDelActaDTO toDTO(EstadoDelActa entity) {
        return EstadoDelActaMapper.toDTO(entity);
    }

    @Override
    protected EstadoDelActa toEntity(EstadoDelActaDTO dto) {
        return EstadoDelActaMapper.toEntity(dto);
    }
}