package com.example.infracciones.repositories;

import com.example.infracciones.entities.AutoridadDeConstatacion;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AutoridadDeConstatacionRepository extends BaseRepository<AutoridadDeConstatacion, Long> {
    Optional<AutoridadDeConstatacion> findByIdLegajo(Integer idLegajo);
    Optional<AutoridadDeConstatacion> findByDni(Integer dni);
}
