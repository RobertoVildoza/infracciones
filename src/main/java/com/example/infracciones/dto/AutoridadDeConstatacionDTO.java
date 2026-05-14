package com.example.infracciones.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AutoridadDeConstatacionDTO {
    private Long id;
    private Integer dni;
    private String nombre;
    private String apellido;
    private String genero;
    private Integer idLegajo;
    private Integer idPlaca;
    private OrganizacionEstatalDTO organizacionEstatal;
}