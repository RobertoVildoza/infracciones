package com.example.infracciones.controllers;

import com.example.infracciones.dto.TipoRutaDTO;
import com.example.infracciones.entities.TipoRuta;
import com.example.infracciones.services.TipoRutaServiceImpl;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/tipo-rutas")
@CrossOrigin(origins = "*")
public class TipoRutaController extends BaseControllerImpl<TipoRuta, TipoRutaDTO, TipoRutaServiceImpl> {
}