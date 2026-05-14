package com.example.infracciones.controllers;

import com.example.infracciones.dto.ActaDeConstatacionDTO;
import com.example.infracciones.entities.ActaDeConstatacion;
import com.example.infracciones.services.ActaDeConstatacionServiceImpl;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/actas")
@CrossOrigin(origins = "*")
public class ActaDeConstatacionController extends BaseControllerImpl<ActaDeConstatacion, ActaDeConstatacionDTO, ActaDeConstatacionServiceImpl> {
}