package com.example.infracciones.controllers;

import com.example.infracciones.entities.Usuario;
import com.example.infracciones.repositories.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UsuarioRepository usuarioRepository;

    public AuthController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping("/check")
    public ResponseEntity<?> check() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.ok(Map.of("autenticado", false));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("autenticado", true);
        response.put("username", auth.getName());

        String rol = auth.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority().replace("ROLE_", ""))
                .orElse("");
        response.put("rol", rol);

        // Si tiene autoridad ligada la devuelve
        usuarioRepository.findByUsername(auth.getName()).ifPresent(usuario -> {
            if (usuario.getAutoridad() != null) {
                Map<String, Object> autoridadData = new HashMap<>();
                autoridadData.put("id", usuario.getAutoridad().getId());
                autoridadData.put("nombre", usuario.getAutoridad().getNombre());
                autoridadData.put("apellido", usuario.getAutoridad().getApellido());
                autoridadData.put("dni", usuario.getAutoridad().getDni());
                autoridadData.put("idLegajo", usuario.getAutoridad().getIdLegajo());
                autoridadData.put("organizacionId", usuario.getAutoridad().getOrganizacionEstatal() != null
                        ? usuario.getAutoridad().getOrganizacionEstatal().getId() : null);
                autoridadData.put("organizacionNombre", usuario.getAutoridad().getOrganizacionEstatal() != null
                        ? usuario.getAutoridad().getOrganizacionEstatal().getNombre() : null);
                response.put("autoridad", autoridadData);
            }
        });

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<?> me() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(401).body(Map.of("autenticado", false));
        }
        String rol = auth.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority().replace("ROLE_", ""))
                .orElse("");
        return ResponseEntity.ok(Map.of(
                "autenticado", true,
                "username", auth.getName(),
                "rol", rol
        ));
    }
}
