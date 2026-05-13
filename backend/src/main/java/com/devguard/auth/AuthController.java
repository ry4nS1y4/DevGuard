package com.devguard.auth;

import com.devguard.shared.config.JwtService;
import com.devguard.user.User;
import com.devguard.user.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Register and login endpoints")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    @Operation(summary = "Login and receive JWT token")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    // ── DTOs ─────────────────────────────────────────────────────────────

    @Data
    public static class RegisterRequest {
        @NotBlank @Email
        private String email;
        @NotBlank @Size(min = 6)
        private String password;
        @NotBlank
        private String firstName;
        @NotBlank
        private String lastName;
        private User.Role role = User.Role.DEVELOPER;
    }

    @Data
    public static class LoginRequest {
        @NotBlank @Email
        private String email;
        @NotBlank
        private String password;
    }

    @Data @Builder @AllArgsConstructor @NoArgsConstructor
    public static class AuthResponse {
        private String token;
        private String email;
        private String firstName;
        private String lastName;
        private User.Role role;
    }
}
