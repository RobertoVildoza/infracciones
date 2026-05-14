package com.example.infracciones.services;

import com.example.infracciones.dto.AutoridadDeConstatacionDTO;
import com.example.infracciones.entities.AutoridadDeConstatacion;
import com.example.infracciones.mapper.AutoridadDeConstatacionMapper;
import com.example.infracciones.repositories.AutoridadDeConstatacionRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AutoridadDeConstatacionServiceImpl
        extends BaseServiceImpl<AutoridadDeConstatacion, AutoridadDeConstatacionDTO, Long>
        implements AutoridadDeConstatacionService {

    private final AutoridadDeConstatacionRepository autoridadRepository;

    public AutoridadDeConstatacionServiceImpl(AutoridadDeConstatacionRepository autoridadRepository) {
        super(autoridadRepository);
        this.autoridadRepository = autoridadRepository;
    }

    @Override
    protected AutoridadDeConstatacionDTO toDTO(AutoridadDeConstatacion entity) {
        return AutoridadDeConstatacionMapper.toDTO(entity);
    }

    @Override
    protected AutoridadDeConstatacion toEntity(AutoridadDeConstatacionDTO dto) {
        return AutoridadDeConstatacionMapper.toEntity(dto);
    }

    @Override
    public Optional<AutoridadDeConstatacionDTO> findByLegajo(Integer idLegajo) {
        return autoridadRepository.findByIdLegajo(idLegajo)
                .map(AutoridadDeConstatacionMapper::toDTO);
    }

    @Override
    public Optional<AutoridadDeConstatacionDTO> findByDni(Integer dni) {
        return autoridadRepository.findByDni(dni)
                .map(AutoridadDeConstatacionMapper::toDTO);
    }
}