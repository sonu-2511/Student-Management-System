package com.college.sms.service.impl;

import com.college.sms.dto.request.AdminPasswordResetRequest;
import com.college.sms.dto.request.UserStatusRequest;
import com.college.sms.dto.response.PagedResponse;
import com.college.sms.dto.response.UserResponse;
import com.college.sms.entity.User;
import com.college.sms.exception.ResourceNotFoundException;
import com.college.sms.repository.UserRepository;
import com.college.sms.service.UserAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserAdminServiceImpl implements UserAdminService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public PagedResponse<UserResponse> getAll(Pageable pageable) {
        Page<UserResponse> page = userRepository.findAll(pageable).map(this::toResponse);
        return PagedResponse.from(page);
    }

    @Override
    @Transactional
    public UserResponse updateStatus(Long id, UserStatusRequest request, String adminUsername) {
        User user = findUser(id);
        if (user.getUsername().equals(adminUsername) && !request.getEnabled()) {
            throw new AccessDeniedException("You cannot deactivate your own administrator account");
        }
        user.setEnabled(request.getEnabled());
        return toResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public void resetPassword(Long id, AdminPasswordResetRequest request) {
        User user = findUser(id);
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private User findUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("User", id));
    }

    private UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .enabled(user.isEnabled())
                .studentId(user.getStudentId())
                .teacherId(user.getTeacherId())
                .createdAt(user.getCreatedAt())
                .build();
    }
}