package com.example.infracciones.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "acta_de_constatacion")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ActaDeConstatacion extends Base {
    @Column(name = "fecha_labrado", nullable = false)
    private LocalDate fechaLabrado;

    @Column(name = "hora_labrado", nullable = false)
    private LocalTime horaLabrado;

    @Column(name = "lugar_constatacion", length = 255)
    private String lugarConstatacion;

    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;

    @Column(name = "fecha_vto_pago_volun")
    private LocalDate fechaVtoPagoVolun;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "autoridad_id", nullable = false)
    private AutoridadDeConstatacion autoridad;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "vehiculo_id", nullable = false)
    private Vehiculo vehiculo;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "licencia_id", nullable = false)
    private Licencia licencia;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ruta_id", nullable = true)
    private Ruta ruta;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "organizacion_id", nullable = false)
    private OrganizacionEstatal organizacionEstatal;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "estado_acta_id", nullable = false)
    private EstadoDelActa estadoDelActa;

    @OneToMany(mappedBy = "acta", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Infraccion> infracciones = new ArrayList<>();
}
