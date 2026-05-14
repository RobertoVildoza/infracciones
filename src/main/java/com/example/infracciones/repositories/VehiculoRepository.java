package com.example.infracciones.repositories;

import com.example.infracciones.entities.Vehiculo;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VehiculoRepository extends BaseRepository<Vehiculo, Long> {
    Optional<Vehiculo> findByDominio(String dominio);
}
