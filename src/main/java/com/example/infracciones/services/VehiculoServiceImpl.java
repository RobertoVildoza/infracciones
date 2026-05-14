package com.example.infracciones.services;

import com.example.infracciones.dto.VehiculoDTO;
import com.example.infracciones.entities.Vehiculo;
import com.example.infracciones.mapper.VehiculoMapper;
import com.example.infracciones.repositories.VehiculoRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class VehiculoServiceImpl extends BaseServiceImpl<Vehiculo, VehiculoDTO, Long>
        implements VehiculoService {

    private final VehiculoRepository vehiculoRepository;

    public VehiculoServiceImpl(VehiculoRepository vehiculoRepository) {
        super(vehiculoRepository);
        this.vehiculoRepository = vehiculoRepository;
    }

    @Override
    protected VehiculoDTO toDTO(Vehiculo entity) {
        return VehiculoMapper.toDTO(entity);
    }

    @Override
    protected Vehiculo toEntity(VehiculoDTO dto) {
        return VehiculoMapper.toEntity(dto);
    }

    @Override
    public Optional<VehiculoDTO> findByDominio(String dominio) {
        return vehiculoRepository.findByDominio(dominio)
                .map(VehiculoMapper::toDTO);
    }
}