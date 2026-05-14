package com.example.infracciones.services;

import com.example.infracciones.dto.TipoRutaDTO;
import com.example.infracciones.entities.TipoRuta;
import com.example.infracciones.mapper.TipoRutaMapper;
import com.example.infracciones.repositories.TipoRutaRepository;
import org.springframework.stereotype.Service;

@Service
public class TipoRutaServiceImpl extends BaseServiceImpl<TipoRuta, TipoRutaDTO, Long>
        implements TipoRutaService {

    public TipoRutaServiceImpl(TipoRutaRepository repository) {
        super(repository);
    }

    @Override
    protected TipoRutaDTO toDTO(TipoRuta entity) {
        return TipoRutaMapper.toDTO(entity);
    }

    @Override
    protected TipoRuta toEntity(TipoRutaDTO dto) {
        return TipoRutaMapper.toEntity(dto);
    }
}