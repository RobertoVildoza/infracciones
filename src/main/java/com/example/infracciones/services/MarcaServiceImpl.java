package com.example.infracciones.services;

import com.example.infracciones.dto.MarcaDTO;
import com.example.infracciones.entities.Marca;
import com.example.infracciones.mapper.MarcaMapper;
import com.example.infracciones.repositories.MarcaRepository;
import org.springframework.stereotype.Service;

@Service
public class MarcaServiceImpl extends BaseServiceImpl<Marca, MarcaDTO, Long>
        implements MarcaService {

    public MarcaServiceImpl(MarcaRepository repository) {
        super(repository);
    }

    @Override
    protected MarcaDTO toDTO(Marca entity) {
        return MarcaMapper.toDTO(entity);
    }

    @Override
    protected Marca toEntity(MarcaDTO dto) {
        return MarcaMapper.toEntity(dto);
    }
}