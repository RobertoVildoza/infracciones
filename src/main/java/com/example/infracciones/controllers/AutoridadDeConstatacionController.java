package com.example.infracciones.controllers;

import com.example.infracciones.dto.AutoridadDeConstatacionDTO;
import com.example.infracciones.entities.AutoridadDeConstatacion;
import com.example.infracciones.services.AutoridadDeConstatacionServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/autoridades")
@CrossOrigin(origins = "*")
public class AutoridadDeConstatacionController extends BaseControllerImpl<AutoridadDeConstatacion, AutoridadDeConstatacionDTO, AutoridadDeConstatacionServiceImpl> {

    @GetMapping("/legajo/{legajo}")
    public ResponseEntity<?> findByLegajo(@PathVariable Integer legajo) {
        try {
            return servicio.findByLegajo(legajo)
                    .map(dto -> ResponseEntity.status(HttpStatus.OK).body((Object) dto))
                    .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body("{\"encontrado\":false}"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\":\"Error al buscar autoridad.\"}");
        }
    }

    @GetMapping("/dni/{dni}")
    public ResponseEntity<?> findByDni(@PathVariable Integer dni) {
        try {
            return servicio.findByDni(dni)
                    .map(dto -> ResponseEntity.status(HttpStatus.OK).body((Object) dto))
                    .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body("{\"encontrado\":false}"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\":\"Error al buscar autoridad.\"}");
        }
    }
}