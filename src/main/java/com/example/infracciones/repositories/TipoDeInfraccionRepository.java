package com.example.infracciones.repositories;

import com.example.infracciones.entities.TipoDeInfraccion;
import org.springframework.stereotype.Repository;

@Repository
public interface TipoDeInfraccionRepository extends BaseRepository<TipoDeInfraccion, Long> {
}
