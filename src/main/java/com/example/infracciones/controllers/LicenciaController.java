package com.example.infracciones.controllers;

import com.example.infracciones.dto.LicenciaDTO;
import com.example.infracciones.entities.Licencia;
import com.example.infracciones.services.LicenciaServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/licencias")
@CrossOrigin(origins = "*")
public class LicenciaController extends BaseControllerImpl<Licencia, LicenciaDTO, LicenciaServiceImpl> {

    @GetMapping("/conductor/{conductorId}")
    public ResponseEntity<?> findByConductor(@PathVariable Long conductorId) {
        try {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(servicio.findByConductorId(conductorId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\":\"Error al buscar licencias.\"}");
        }
    }
}
