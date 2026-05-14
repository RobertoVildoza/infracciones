package com.example.infracciones.services;

import com.example.infracciones.dto.TipoDeInfraccionDTO;
import com.example.infracciones.entities.TipoDeInfraccion;
import com.example.infracciones.mapper.TipoDeInfraccionMapper;
import com.example.infracciones.repositories.TipoDeInfraccionRepository;
import org.springframework.stereotype.Service;

@Service
public class TipoDeInfraccionServiceImpl
        extends BaseServiceImpl<TipoDeInfraccion, TipoDeInfraccionDTO, Long>
        implements TipoDeInfraccionService {

    public TipoDeInfraccionServiceImpl(TipoDeInfraccionRepository repository) {
        super(repository);
    }

    @Override
    protected TipoDeInfraccionDTO toDTO(TipoDeInfraccion entity) {
        return TipoDeInfraccionMapper.toDTO(entity);
    }

    @Override
    protected TipoDeInfraccion toEntity(TipoDeInfraccionDTO dto) {
        return TipoDeInfraccionMapper.toEntity(dto);
    }
}