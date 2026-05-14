package com.example.infracciones.repositories;

import com.example.infracciones.entities.Licencia;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LicenciaRepository extends BaseRepository<Licencia, Long> {
    List<Licencia> findByConductorId(Long conductorId);
}
