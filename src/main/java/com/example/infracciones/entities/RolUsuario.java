package com.example.infracciones.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "rol_usuario")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RolUsuario extends Base {

    @Column(name = "nombre", length = 30, nullable = false, unique = true)
    private String nombre;
}