package com.example.infracciones.repositories;

import com.example.infracciones.entities.RolUsuario;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RolUsuarioRepository extends BaseRepository<RolUsuario, Long> {
    Optional<RolUsuario> findByNombre(String nombre);
}