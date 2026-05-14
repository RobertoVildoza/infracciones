package com.example.infracciones.services;

import com.example.infracciones.dto.RutaDTO;
import com.example.infracciones.entities.Ruta;
import com.example.infracciones.mapper.RutaMapper;
import com.example.infracciones.repositories.RutaRepository;
import org.springframework.stereotype.Service;

@Service
public class RutaServiceImpl extends BaseServiceImpl<Ruta, RutaDTO, Long>
        implements RutaService {

    public RutaServiceImpl(RutaRepository repository) {
        super(repository);
    }

    @Override
    protected RutaDTO toDTO(Ruta entity) {
        return RutaMapper.toDTO(entity);
    }

    @Override
    protected Ruta toEntity(RutaDTO dto) {
        return RutaMapper.toEntity(dto);
    }
}