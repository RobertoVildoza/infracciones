package com.example.infracciones.controllers;

import com.example.infracciones.dto.TipoDeInfraccionDTO;
import com.example.infracciones.entities.TipoDeInfraccion;
import com.example.infracciones.services.TipoDeInfraccionServiceImpl;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/tipos-infraccion")
@CrossOrigin(origins = "*")
public class TipoDeInfraccionController extends BaseControllerImpl<TipoDeInfraccion, TipoDeInfraccionDTO, TipoDeInfraccionServiceImpl> {
}