package com.example.infracciones.services;

import com.example.infracciones.dto.ActaDeConstatacionDTO;
import com.example.infracciones.entities.*;
import com.example.infracciones.mapper.ActaDeConstatacionMapper;
import com.example.infracciones.repositories.*;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class ActaDeConstatacionServiceImpl
        extends BaseServiceImpl<ActaDeConstatacion, ActaDeConstatacionDTO, Long>
        implements ActaDeConstatacionService {

    private final ActaDeConstatacionRepository actaRepository;
    private final AutoridadDeConstatacionRepository autoridadRepository;
    private final VehiculoRepository vehiculoRepository;
    private final LicenciaRepository licenciaRepository;
    private final RutaRepository rutaRepository;
    private final OrganizacionEstatalRepository organizacionRepository;
    private final EstadoDelActaRepository estadoRepository;
    private final ConductorRepository conductorRepository;

    public ActaDeConstatacionServiceImpl(
            ActaDeConstatacionRepository actaRepository,
            AutoridadDeConstatacionRepository autoridadRepository,
            VehiculoRepository vehiculoRepository,
            LicenciaRepository licenciaRepository,
            RutaRepository rutaRepository,
            OrganizacionEstatalRepository organizacionRepository,
            EstadoDelActaRepository estadoRepository,
            ConductorRepository conductorRepository) {
        super(actaRepository);
        this.actaRepository = actaRepository;
        this.autoridadRepository = autoridadRepository;
        this.vehiculoRepository = vehiculoRepository;
        this.licenciaRepository = licenciaRepository;
        this.rutaRepository = rutaRepository;
        this.organizacionRepository = organizacionRepository;
        this.estadoRepository = estadoRepository;
        this.conductorRepository = conductorRepository;
    }

    @Override
    protected ActaDeConstatacionDTO toDTO(ActaDeConstatacion entity) {
        return ActaDeConstatacionMapper.toDTO(entity);
    }

    @Override
    protected ActaDeConstatacion toEntity(ActaDeConstatacionDTO dto) {
        return ActaDeConstatacionMapper.toEntity(dto);
    }

    @Override
    @Transactional
    public ActaDeConstatacionDTO save(ActaDeConstatacionDTO dto) throws Exception {
        try {
            ActaDeConstatacion acta = new ActaDeConstatacion();
            acta.setFechaLabrado(dto.getFechaLabrado());
            acta.setHoraLabrado(dto.getHoraLabrado());
            acta.setLugarConstatacion(dto.getLugarConstatacion());
            acta.setObservaciones(dto.getObservaciones());
            acta.setFechaVtoPagoVolun(dto.getFechaVtoPagoVolun());

            // Autoridad
            acta.setAutoridad(autoridadRepository.findById(dto.getAutoridad().getId())
                    .orElseThrow(() -> new Exception("Autoridad no encontrada")));

            // Vehículo
            acta.setVehiculo(vehiculoRepository.findById(dto.getVehiculo().getId())
                    .orElseThrow(() -> new Exception("Vehículo no encontrado")));

            // Licencia
            acta.setLicencia(licenciaRepository.findById(dto.getLicencia().getId())
                    .orElseThrow(() -> new Exception("Licencia no encontrada")));

            // Ruta — opcional
            if (dto.getRuta() != null && dto.getRuta().getId() != null) {
                acta.setRuta(rutaRepository.findById(dto.getRuta().getId())
                        .orElse(null));
            }

            // Organización
            acta.setOrganizacionEstatal(organizacionRepository.findById(dto.getOrganizacionEstatal().getId())
                    .orElseThrow(() -> new Exception("Organización no encontrada")));

            // Estado — siempre Pendiente
            EstadoDelActa estadoPendiente = estadoRepository.findByNombreEstadoActa("Pendiente")
                    .orElseThrow(() -> new Exception("Estado 'Pendiente' no encontrado en la base de datos"));
            acta.setEstadoDelActa(estadoPendiente);

            // Infracciones
            if (dto.getInfracciones() != null) {
                dto.getInfracciones().forEach(infDto -> {
                    Infraccion inf = new Infraccion();
                    inf.setDescripcion(infDto.getDescripcion());
                    inf.setImporte(infDto.getImporte());
                    inf.setActa(acta);
                    if (infDto.getTiposInfraccion() != null) {
                        inf.setTiposInfraccion(
                                infDto.getTiposInfraccion().stream()
                                        .map(t -> {
                                            TipoDeInfraccion tipo = new TipoDeInfraccion();
                                            tipo.setId(t.getId());
                                            return tipo;
                                        }).collect(Collectors.toList())
                        );
                    }
                    acta.getInfracciones().add(inf);
                });
            }

            return toDTO(actaRepository.save(acta));
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }
}