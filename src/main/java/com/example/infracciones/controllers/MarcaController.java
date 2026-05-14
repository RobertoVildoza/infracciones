package com.example.infracciones.controllers;

import com.example.infracciones.dto.MarcaDTO;
import com.example.infracciones.entities.Marca;
import com.example.infracciones.services.MarcaServiceImpl;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/marcas")
@CrossOrigin(origins = "*")
public class MarcaController extends BaseControllerImpl<Marca, MarcaDTO, MarcaServiceImpl> {
}