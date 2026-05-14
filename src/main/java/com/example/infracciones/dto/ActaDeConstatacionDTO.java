package com.example.infracciones.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ActaDeConstatacionDTO {
    private Long id;
    private LocalDate fechaLabrado;
    private LocalTime horaLabrado;
    private String lugarConstatacion;
    private String observaciones;
    private LocalDate fechaVtoPagoVolun;
    private AutoridadDeConstatacionDTO autoridad;
    private VehiculoDTO vehiculo;
    private LicenciaDTO licencia;
    private RutaDTO ruta;
    private OrganizacionEstatalDTO organizacionEstatal;
    private EstadoDelActaDTO estadoDelActa;
    private List<InfraccionDTO> infracciones;
}