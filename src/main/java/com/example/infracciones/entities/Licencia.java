package com.example.infracciones.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "licencia")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Licencia extends Base {
    @Column(name = "clase", length = 15)
    private String clase;

    @Column(name = "fecha_vto", nullable = false)
    private LocalDate fechaVto;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "conductor_id", nullable = false)
    private Conductor conductor;
}
