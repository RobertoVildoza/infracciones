package com.example.infracciones.controllers;

import com.example.infracciones.dto.RutaDTO;
import com.example.infracciones.entities.Ruta;
import com.example.infracciones.services.RutaServiceImpl;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/rutas")
@CrossOrigin(origins = "*")
public class RutaController extends BaseControllerImpl<Ruta, RutaDTO, RutaServiceImpl> {
}