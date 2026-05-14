package com.example.infracciones.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "vehiculo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Vehiculo extends Base {
    @Column(name = "dominio", length = 10, unique = true, nullable = false)
    private String dominio;

    @Column(name = "color", length = 20)
    private String color;

    @Column(name = "anio_patentamiento")
    private Integer anioPatentamiento;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "marca_id", nullable = false)
    private Marca marca;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "modelo_id", nullable = false)
    private Modelo modelo;
}
