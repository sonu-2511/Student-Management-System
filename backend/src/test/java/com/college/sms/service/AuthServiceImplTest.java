package com.college.sms.service;

import com.college.sms.dto.request.ChangePasswordRequest;
import com.college.sms.entity.Role;
import com.college.sms.entity.User;
import com.college.sms.exception.UnauthorizedException;
import com.college.sms.repository.UserRepository;
import com.college.sms.security.JwtService;
import com.college.sms.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private JwtService jwtService;
    @InjectMocks private AuthServiceImpl authService;

    @Test
    void changePasswordVerifiesCurrentPasswordAndEncodesNewPassword() {
        User user = User.builder().id(1L).username("student1").password("old-hash").role(Role.STUDENT).build();
        when(userRepository.findByUsername("student1")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("old-pass", "old-hash")).thenReturn(true);
        when(passwordEncoder.encode("Newpass1")).thenReturn("new-hash");

        authService.changePassword("student1", new ChangePasswordRequest("old-pass", "Newpass1"));

        verify(passwordEncoder).encode("Newpass1");
        verify(userRepository).save(user);
    }

    @Test
    void rejectsIncorrectCurrentPassword() {
        User user = User.builder().username("student1").password("old-hash").role(Role.STUDENT).build();
        when(userRepository.findByUsername("student1")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(any(), any())).thenReturn(false);

        assertThatThrownBy(() -> authService.changePassword(
                "student1", new ChangePasswordRequest("wrong", "Newpass1")))
                .isInstanceOf(UnauthorizedException.class);
    }
}