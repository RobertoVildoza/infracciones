package com.example.infracciones.controllers;

import com.example.infracciones.dto.ConductorDTO;
import com.example.infracciones.entities.Conductor;
import com.example.infracciones.services.ConductorServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/conductores")
@CrossOrigin(origins = "*")
public class ConductorController extends BaseControllerImpl<Conductor, ConductorDTO, ConductorServiceImpl> {

    @GetMapping("/dni/{dni}")
    public ResponseEntity<?> findByDni(@PathVariable Integer dni) {
        try {
            return servicio.findByDni(dni)
                    .map(dto -> ResponseEntity.status(HttpStatus.OK).body((Object) dto))
                    .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body("{\"encontrado\":false}"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\":\"Error al buscar conductor.\"}");
        }
    }
}