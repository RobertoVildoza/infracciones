package com.example.infracciones.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "organizacion_estatal")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrganizacionEstatal extends Base {
    @Column(name = "nombre", length = 100, nullable = false, unique = true)
    private String nombre;
}
