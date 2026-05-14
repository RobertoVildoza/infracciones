package com.example.infracciones.controllers;

import com.example.infracciones.dto.OrganizacionEstatalDTO;
import com.example.infracciones.entities.OrganizacionEstatal;
import com.example.infracciones.services.OrganizacionEstatalServiceImpl;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/organizaciones")
@CrossOrigin(origins = "*")
public class OrganizacionEstatalController extends BaseControllerImpl<OrganizacionEstatal, OrganizacionEstatalDTO, OrganizacionEstatalServiceImpl> {
}