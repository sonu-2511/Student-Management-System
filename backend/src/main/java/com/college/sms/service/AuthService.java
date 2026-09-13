package com.college.sms.service;

import com.college.sms.dto.request.BootstrapAdminRequest;
import com.college.sms.dto.request.ChangePasswordRequest;
import com.college.sms.dto.request.LoginRequest;
import com.college.sms.dto.request.RegisterRequest;
import com.college.sms.dto.response.JwtResponse;
import com.college.sms.dto.response.UserResponse;

public interface AuthService {

    JwtResponse login(LoginRequest request);

    UserResponse register(RegisterRequest request);

    /** True only while no user accounts exist yet — i.e. the system has never been set up. */
    boolean needsBootstrap();

    /**
     * Creates the very first ADMIN account. Only succeeds while {@link #needsBootstrap()} is true;
     * once any account exists, this always throws {@link com.college.sms.exception.UnauthorizedException}.
     * This is what lets a public, unauthenticated frontend page safely create exactly one admin
     * and never again.
     */
    UserResponse bootstrapAdmin(BootstrapAdminRequest request);

    void changePassword(String username, ChangePasswordRequest request);
}
