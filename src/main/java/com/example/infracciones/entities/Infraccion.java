package com.example.infracciones.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "infraccion")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Infraccion extends Base {
    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "importe", nullable = false)
    private Double importe;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "acta_id", nullable = false)
    private ActaDeConstatacion acta;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "infraccion_tipo",
        joinColumns = @JoinColumn(name = "infraccion_id"),
        inverseJoinColumns = @JoinColumn(name = "tipo_infraccion_id")
    )
    private List<TipoDeInfraccion> tiposInfraccion = new ArrayList<>();
}
