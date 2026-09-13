package com.college.sms.controller;

import com.college.sms.dto.request.BootstrapAdminRequest;
import com.college.sms.dto.request.ChangePasswordRequest;
import com.college.sms.dto.request.LoginRequest;
import com.college.sms.dto.request.RegisterRequest;
import com.college.sms.dto.response.JwtResponse;
import com.college.sms.dto.response.SetupStatusResponse;
import com.college.sms.dto.response.UserResponse;
import com.college.sms.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Login, one-time setup, and account creation endpoints")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Authenticate a user and receive a JWT")
    public ResponseEntity<JwtResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/setup-status")
    @Operation(summary = "Check whether the system still needs its first admin account created (public)")
    public ResponseEntity<SetupStatusResponse> setupStatus() {
        return ResponseEntity.ok(SetupStatusResponse.builder().needsSetup(authService.needsBootstrap()).build());
    }

    @PostMapping("/bootstrap-admin")
    @Operation(summary = "Create the first ADMIN account (public, but only works while zero accounts exist)")
    public ResponseEntity<UserResponse> bootstrapAdmin(@Valid @RequestBody BootstrapAdminRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.bootstrapAdmin(request));
    }

    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Register a new user account (ADMIN only)")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PutMapping("/password")
    @Operation(summary = "Change the authenticated user's password")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody ChangePasswordRequest request,
                                                Authentication authentication) {
        authService.changePassword(authentication.getName(), request);
        return ResponseEntity.noContent().build();
    }
}
