package com.example.infracciones.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InfraccionDTO {
    private Long id;
    private String descripcion;
    private Double importe;
    private List<TipoDeInfraccionDTO> tiposInfraccion;
}
