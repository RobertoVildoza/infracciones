package com.example.infracciones.services;

import com.example.infracciones.dto.ConductorDTO;
import com.example.infracciones.entities.Conductor;
import com.example.infracciones.mapper.ConductorMapper;
import com.example.infracciones.repositories.ConductorRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ConductorServiceImpl extends BaseServiceImpl<Conductor, ConductorDTO, Long>
        implements ConductorService {

    private final ConductorRepository conductorRepository;

    public ConductorServiceImpl(ConductorRepository conductorRepository) {
        super(conductorRepository);
        this.conductorRepository = conductorRepository;
    }

    @Override
    protected ConductorDTO toDTO(Conductor entity) {
        return ConductorMapper.toDTO(entity);
    }

    @Override
    protected Conductor toEntity(ConductorDTO dto) {
        return ConductorMapper.toEntity(dto);
    }

    @Override
    public Optional<ConductorDTO> findByDni(Integer dni) {
        return conductorRepository.findByDni(dni)
                .map(ConductorMapper::toDTO);
    }
}