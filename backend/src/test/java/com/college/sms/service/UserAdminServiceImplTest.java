package com.college.sms.service;

import com.college.sms.dto.request.UserStatusRequest;
import com.college.sms.entity.Role;
import com.college.sms.entity.User;
import com.college.sms.repository.UserRepository;
import com.college.sms.service.impl.UserAdminServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserAdminServiceImplTest {

    @Mock private UserRepository userRepository;
    @InjectMocks private UserAdminServiceImpl userAdminService;

    @Test
    void preventsAdminFromDeactivatingOwnAccount() {
        User admin = User.builder().id(1L).username("admin").role(Role.ADMIN).enabled(true).build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(admin));

        assertThatThrownBy(() -> userAdminService.updateStatus(1L, new UserStatusRequest(false), "admin"))
                .isInstanceOf(AccessDeniedException.class);
    }
}