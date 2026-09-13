package com.college.sms.service.impl;

import com.college.sms.dto.request.BootstrapAdminRequest;
import com.college.sms.dto.request.ChangePasswordRequest;
import com.college.sms.dto.request.LoginRequest;
import com.college.sms.dto.request.RegisterRequest;
import com.college.sms.dto.response.JwtResponse;
import com.college.sms.dto.response.UserResponse;
import com.college.sms.entity.Role;
import com.college.sms.entity.User;
import com.college.sms.exception.DuplicateResourceException;
import com.college.sms.exception.UnauthorizedException;
import com.college.sms.repository.UserRepository;
import com.college.sms.security.JwtService;
import com.college.sms.security.SecurityUserDetails;
import com.college.sms.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Override
    public JwtResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found: " + request.getUsername()));

        String token = jwtService.generateToken(new SecurityUserDetails(user));

        return JwtResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .username(user.getUsername())
                .role(user.getRole())
                .expiresInMs(jwtService.getExpirationMs())
                .studentId(user.getStudentId())
                .teacherId(user.getTeacherId())
                .build();
    }

    @Override
    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("Username already taken: " + request.getUsername());
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered: " + request.getEmail());
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .enabled(true)
                .studentId(request.getStudentId())
                .teacherId(request.getTeacherId())
                .build();

        User saved = userRepository.save(user);

        return UserResponse.builder()
                .id(saved.getId())
                .username(saved.getUsername())
                .email(saved.getEmail())
                .role(saved.getRole())
                .enabled(saved.isEnabled())
                .studentId(saved.getStudentId())
                .teacherId(saved.getTeacherId())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    @Override
    public boolean needsBootstrap() {
        return userRepository.count() == 0;
    }

    @Override
    @Transactional
    public synchronized UserResponse bootstrapAdmin(BootstrapAdminRequest request) {
        // synchronized + a fresh count check under the lock closes the race window between two
        // concurrent bootstrap calls both observing "zero users" before either one commits.
        if (!needsBootstrap()) {
            throw new UnauthorizedException(
                    "Setup has already been completed. Ask an existing administrator for an account.");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("Username already taken: " + request.getUsername());
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered: " + request.getEmail());
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ADMIN)
                .enabled(true)
                .build();

        User saved = userRepository.save(user);

        return UserResponse.builder()
                .id(saved.getId())
                .username(saved.getUsername())
                .email(saved.getEmail())
                .role(saved.getRole())
                .enabled(saved.isEnabled())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    @Override
    @Transactional
    public void changePassword(String username, ChangePasswordRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UnauthorizedException("Login account not found"));
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new UnauthorizedException("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
