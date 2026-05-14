package com.example.infracciones.mapper;


import com.example.infracciones.dto.VehiculoDTO;
import com.example.infracciones.entities.Vehiculo;

public class VehiculoMapper {

    public static VehiculoDTO toDTO(Vehiculo vehiculo) {
        if (vehiculo == null) return null;
        return new VehiculoDTO(
                vehiculo.getId(),
                vehiculo.getDominio(),
                vehiculo.getColor(),
                vehiculo.getAnioPatentamiento(),
                MarcaMapper.toDTO(vehiculo.getMarca()),
                ModeloMapper.toDTO(vehiculo.getModelo())
        );
    }

    public static Vehiculo toEntity(VehiculoDTO dto) {
        if (dto == null) return null;
        Vehiculo vehiculo = new Vehiculo();
        vehiculo.setId(dto.getId());
        vehiculo.setDominio(dto.getDominio());
        vehiculo.setColor(dto.getColor());
        vehiculo.setAnioPatentamiento(dto.getAnioPatentamiento());
        vehiculo.setMarca(MarcaMapper.toEntity(dto.getMarca()));
        vehiculo.setModelo(ModeloMapper.toEntity(dto.getModelo()));
        return vehiculo;
    }
}