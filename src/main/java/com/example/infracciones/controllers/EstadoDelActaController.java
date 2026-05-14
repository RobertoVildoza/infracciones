package com.example.infracciones.controllers;

import com.example.infracciones.dto.EstadoDelActaDTO;
import com.example.infracciones.entities.EstadoDelActa;
import com.example.infracciones.services.EstadoDelActaServiceImpl;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/estados-acta")
@CrossOrigin(origins = "*")
public class EstadoDelActaController extends BaseControllerImpl<EstadoDelActa, EstadoDelActaDTO, EstadoDelActaServiceImpl> {
}