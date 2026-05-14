package com.example.infracciones.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RutaDTO {
    private Long id;
    private String nombre;
    private String kilometro;
    private TipoRutaDTO tipoRuta;
}
