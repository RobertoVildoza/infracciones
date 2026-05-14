package com.example.infracciones.repositories;

import com.example.infracciones.entities.Conductor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ConductorRepository extends BaseRepository<Conductor, Long> {
    Optional<Conductor> findByDni(Integer dni);
}
