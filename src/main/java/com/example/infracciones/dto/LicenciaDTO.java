package com.example.infracciones.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LicenciaDTO {
    private Long id;
    private String clase;
    private LocalDate fechaVto;
    private ConductorDTO conductor;
}
