package com.example.infracciones.repositories;

import com.example.infracciones.entities.Infraccion;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InfraccionRepository extends BaseRepository<Infraccion, Long> {
    List<Infraccion> findByActaId(Long actaId);
}
