package com.example.infracciones.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "estado_del_acta")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EstadoDelActa extends Base {
    @Column(name = "nombre_estado_acta", length = 50, nullable = false, unique = true)
    private String nombreEstadoActa;
}
