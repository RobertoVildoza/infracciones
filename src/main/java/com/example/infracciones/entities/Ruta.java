package com.example.infracciones.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "ruta")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Ruta extends Base {
    @Column(name = "nombre", length = 50, nullable = false)
    private String nombre;

    @Column(name = "kilometro", length = 10)
    private String kilometro;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tipo_ruta_id", nullable = false)
    private TipoRuta tipoRuta;
}
