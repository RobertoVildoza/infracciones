package com.example.infracciones.repositories;

import com.example.infracciones.entities.Marca;
import org.springframework.stereotype.Repository;

@Repository
public interface MarcaRepository extends BaseRepository<Marca, Long> {
}
