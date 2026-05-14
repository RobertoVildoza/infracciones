package com.example.infracciones.services;

import com.example.infracciones.dto.ModeloDTO;
import com.example.infracciones.entities.Modelo;
import com.example.infracciones.mapper.ModeloMapper;
import com.example.infracciones.repositories.ModeloRepository;
import org.springframework.stereotype.Service;

@Service
public class ModeloServiceImpl extends BaseServiceImpl<Modelo, ModeloDTO, Long>
        implements ModeloService {

    public ModeloServiceImpl(ModeloRepository repository) {
        super(repository);
    }

    @Override
    protected ModeloDTO toDTO(Modelo entity) {
        return ModeloMapper.toDTO(entity);
    }

    @Override
    protected Modelo toEntity(ModeloDTO dto) {
        return ModeloMapper.toEntity(dto);
    }
}