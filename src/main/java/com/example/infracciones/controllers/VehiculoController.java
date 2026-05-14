package com.example.infracciones.controllers;

import com.example.infracciones.dto.VehiculoDTO;
import com.example.infracciones.entities.Vehiculo;
import com.example.infracciones.services.VehiculoServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/vehiculos")
@CrossOrigin(origins = "*")
public class VehiculoController extends BaseControllerImpl<Vehiculo, VehiculoDTO, VehiculoServiceImpl> {

    @GetMapping("/dominio/{dominio}")
    public ResponseEntity<?> findByDominio(@PathVariable String dominio) {
        try {
            return servicio.findByDominio(dominio)
                    .map(dto -> ResponseEntity.status(HttpStatus.OK).body((Object) dto))
                    .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body("{\"encontrado\":false}"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\":\"Error al buscar vehículo.\"}");
        }
    }
}