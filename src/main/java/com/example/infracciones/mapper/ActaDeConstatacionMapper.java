package com.example.infracciones.mapper;


import com.example.infracciones.dto.ActaDeConstatacionDTO;
import com.example.infracciones.entities.ActaDeConstatacion;

import java.util.stream.Collectors;

public class ActaDeConstatacionMapper {

    public static ActaDeConstatacionDTO toDTO(ActaDeConstatacion acta) {
        if (acta == null) return null;
        return new ActaDeConstatacionDTO(
                acta.getId(),
                acta.getFechaLabrado(),
                acta.getHoraLabrado(),
                acta.getLugarConstatacion(),
                acta.getObservaciones(),
                acta.getFechaVtoPagoVolun(),
                AutoridadDeConstatacionMapper.toDTO(acta.getAutoridad()),
                VehiculoMapper.toDTO(acta.getVehiculo()),
                LicenciaMapper.toDTO(acta.getLicencia()),
                RutaMapper.toDTO(acta.getRuta()),
                OrganizacionEstatalMapper.toDTO(acta.getOrganizacionEstatal()),
                EstadoDelActaMapper.toDTO(acta.getEstadoDelActa()),
                acta.getInfracciones().stream()
                        .map(InfraccionMapper::toDTO)
                        .collect(Collectors.toList())
        );
    }

    public static ActaDeConstatacion toEntity(ActaDeConstatacionDTO dto) {
        if (dto == null) return null;
        ActaDeConstatacion acta = new ActaDeConstatacion();
        acta.setId(dto.getId());
        acta.setFechaLabrado(dto.getFechaLabrado());
        acta.setHoraLabrado(dto.getHoraLabrado());
        acta.setLugarConstatacion(dto.getLugarConstatacion());
        acta.setObservaciones(dto.getObservaciones());
        acta.setFechaVtoPagoVolun(dto.getFechaVtoPagoVolun());
        acta.setAutoridad(AutoridadDeConstatacionMapper.toEntity(dto.getAutoridad()));
        acta.setVehiculo(VehiculoMapper.toEntity(dto.getVehiculo()));
        acta.setLicencia(LicenciaMapper.toEntity(dto.getLicencia()));
        acta.setRuta(RutaMapper.toEntity(dto.getRuta()));
        acta.setOrganizacionEstatal(OrganizacionEstatalMapper.toEntity(dto.getOrganizacionEstatal()));
        acta.setEstadoDelActa(EstadoDelActaMapper.toEntity(dto.getEstadoDelActa()));
        if (dto.getInfracciones() != null) {
            acta.setInfracciones(
                    dto.getInfracciones().stream()
                            .map(InfraccionMapper::toEntity)
                            .collect(Collectors.toList())
            );
        }
        return acta;
    }
}
