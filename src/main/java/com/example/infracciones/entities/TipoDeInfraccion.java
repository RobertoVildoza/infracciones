package com.example.infracciones.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tipo_de_infraccion")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TipoDeInfraccion extends Base {
    @Column(name = "codigo", length = 10, nullable = false, unique = true)
    private String codigo;

    @Column(name = "descripcion", length = 255, nullable = false)
    private String descripcion;
}
