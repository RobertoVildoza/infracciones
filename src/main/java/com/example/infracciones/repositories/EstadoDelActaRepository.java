package com.example.infracciones.repositories;

import com.example.infracciones.entities.EstadoDelActa;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EstadoDelActaRepository extends BaseRepository<EstadoDelActa, Long> {
    Optional<EstadoDelActa> findByNombreEstadoActa(String nombreEstadoActa);
}