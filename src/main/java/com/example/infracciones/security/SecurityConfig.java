package com.example.infracciones.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserDetailsServiceImpl userDetailsService;

    public SecurityConfig(UserDetailsServiceImpl userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authenticationProvider(authenticationProvider());
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // Públicos
                        .requestMatchers(
                                "/login.html", "/login", "/pages/*.html",
                                "/css/**", "/js/**", "/favicon.ico", "/api/auth/check"
                        ).permitAll()

                        // Autoridades — GET para todos, resto solo ADMIN
                        .requestMatchers(HttpMethod.GET, "/api/v1/autoridades/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/v1/autoridades/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/autoridades/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/autoridades/**").hasRole("ADMIN")

                        // Actas — PUT y DELETE solo ADMIN
                        .requestMatchers(HttpMethod.PUT, "/api/v1/actas/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/actas/**").hasRole("ADMIN")

                        // Conductores — PUT y DELETE solo ADMIN
                        .requestMatchers(HttpMethod.PUT, "/api/v1/conductores/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/conductores/**").hasRole("ADMIN")

                        // Vehículos — PUT y DELETE solo ADMIN
                        .requestMatchers(HttpMethod.PUT, "/api/v1/vehiculos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/vehiculos/**").hasRole("ADMIN")

                        // Licencias — PUT y DELETE solo ADMIN
                        .requestMatchers(HttpMethod.PUT, "/api/v1/licencias/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/licencias/**").hasRole("ADMIN")

                        // Marcas — POST para ambos, PUT y DELETE solo ADMIN
                        .requestMatchers(HttpMethod.GET, "/api/v1/marcas/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/v1/marcas/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/v1/marcas/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/marcas/**").hasRole("ADMIN")

                        // Modelos — POST para ambos, PUT y DELETE solo ADMIN
                        .requestMatchers(HttpMethod.GET, "/api/v1/modelos/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/v1/modelos/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/v1/modelos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/modelos/**").hasRole("ADMIN")

                        // Tipos de Ruta — GET para todos, resto solo ADMIN
                        .requestMatchers(HttpMethod.GET, "/api/v1/tipo-rutas/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/v1/tipo-rutas/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/tipo-rutas/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/tipo-rutas/**").hasRole("ADMIN")

                        // Rutas — POST para ambos, PUT y DELETE solo ADMIN
                        .requestMatchers(HttpMethod.GET, "/api/v1/rutas/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/v1/rutas/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/v1/rutas/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/rutas/**").hasRole("ADMIN")

                        // Organizaciones — GET para todos, resto solo ADMIN
                        .requestMatchers(HttpMethod.GET, "/api/v1/organizaciones/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/v1/organizaciones/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/organizaciones/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/organizaciones/**").hasRole("ADMIN")

                        // Estados del Acta — GET para todos, resto solo ADMIN
                        .requestMatchers(HttpMethod.GET, "/api/v1/estados-acta/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/v1/estados-acta/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/estados-acta/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/estados-acta/**").hasRole("ADMIN")

                        // Tipos de Infracción — POST para ambos, PUT y DELETE solo ADMIN
                        .requestMatchers(HttpMethod.GET, "/api/v1/tipos-infraccion/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/v1/tipos-infraccion/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/v1/tipos-infraccion/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/tipos-infraccion/**").hasRole("ADMIN")

                        .anyRequest().authenticated()
                )
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> {
                            if (request.getRequestURI().startsWith("/api/")) {
                                response.sendError(401, "No autorizado");
                            } else {
                                response.sendRedirect("/login.html");
                            }
                        })
                )
                .formLogin(form -> form
                        .loginPage("/login.html")
                        .loginProcessingUrl("/login")
                        .defaultSuccessUrl("/index.html", true)
                        .failureUrl("/login.html?error=true")
                        .permitAll()
                )
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/login.html?logout=true")
                        .permitAll()
                );

        return http.build();
    }
}