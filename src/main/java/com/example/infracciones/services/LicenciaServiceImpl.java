package com.example.infracciones.services;

import com.example.infracciones.dto.LicenciaDTO;
import com.example.infracciones.entities.Licencia;
import com.example.infracciones.mapper.LicenciaMapper;
import com.example.infracciones.repositories.LicenciaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LicenciaServiceImpl extends BaseServiceImpl<Licencia, LicenciaDTO, Long>
        implements LicenciaService {

    private final LicenciaRepository licenciaRepository;

    public LicenciaServiceImpl(LicenciaRepository licenciaRepository) {
        super(licenciaRepository);
        this.licenciaRepository = licenciaRepository;
    }

    @Override
    protected LicenciaDTO toDTO(Licencia entity) {
        return LicenciaMapper.toDTO(entity);
    }

    @Override
    protected Licencia toEntity(LicenciaDTO dto) {
        return LicenciaMapper.toEntity(dto);
    }

    @Override
    public List<LicenciaDTO> findByConductorId(Long conductorId) {
        return licenciaRepository.findByConductorId(conductorId).stream()
                .map(LicenciaMapper::toDTO)
                .collect(Collectors.toList());
    }
}