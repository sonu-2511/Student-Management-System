package com.college.sms.service;

import com.college.sms.dto.request.AdminPasswordResetRequest;
import com.college.sms.dto.request.UserStatusRequest;
import com.college.sms.dto.response.PagedResponse;
import com.college.sms.dto.response.UserResponse;
import org.springframework.data.domain.Pageable;

public interface UserAdminService {

    PagedResponse<UserResponse> getAll(Pageable pageable);

    UserResponse updateStatus(Long id, UserStatusRequest request, String adminUsername);

    void resetPassword(Long id, AdminPasswordResetRequest request);
}