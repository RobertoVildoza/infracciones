package com.example.infracciones.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tipo_ruta")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TipoRuta extends Base {
    @Column(name = "nombre", length = 50, nullable = false, unique = true)
    private String nombre;
}
