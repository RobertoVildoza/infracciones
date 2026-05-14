package com.example.infracciones.controllers;

import com.example.infracciones.dto.ModeloDTO;
import com.example.infracciones.entities.Modelo;
import com.example.infracciones.services.ModeloServiceImpl;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/modelos")
@CrossOrigin(origins = "*")
public class ModeloController extends BaseControllerImpl<Modelo, ModeloDTO, ModeloServiceImpl> {
}