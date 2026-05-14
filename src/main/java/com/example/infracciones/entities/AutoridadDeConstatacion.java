package com.example.infracciones.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "autoridad_de_constatacion")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AutoridadDeConstatacion extends Base {
    @Column(name = "dni", nullable = false, unique = true)
    private Integer dni;

    @Column(name = "nombre", length = 50, nullable = false)
    private String nombre;

    @Column(name = "apellido", length = 50, nullable = false)
    private String apellido;

    @Column(name = "genero", length = 20)
    private String genero;

    @Column(name = "id_legajo", nullable = false, unique = true)
    private Integer idLegajo;

    @Column(name = "id_placa", nullable = false, unique = true)
    private Integer idPlaca;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "organizacion_id")
    private OrganizacionEstatal organizacionEstatal;
}
