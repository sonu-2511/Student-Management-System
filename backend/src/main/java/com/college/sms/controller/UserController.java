package com.college.sms.controller;

import com.college.sms.dto.request.AdminPasswordResetRequest;
import com.college.sms.dto.request.UserStatusRequest;
import com.college.sms.dto.response.PagedResponse;
import com.college.sms.dto.response.UserResponse;
import com.college.sms.service.UserAdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Users", description = "Administrator account lifecycle controls")
public class UserController {

    private final UserAdminService userAdminService;

    @GetMapping
    @Operation(summary = "List login accounts")
    public ResponseEntity<PagedResponse<UserResponse>> getAll(
            @PageableDefault(size = 20, sort = "username") Pageable pageable) {
        return ResponseEntity.ok(userAdminService.getAll(pageable));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Activate or deactivate a login account")
    public ResponseEntity<UserResponse> updateStatus(@PathVariable Long id,
                                                      @Valid @RequestBody UserStatusRequest request,
                                                      Authentication authentication) {
        return ResponseEntity.ok(userAdminService.updateStatus(id, request, authentication.getName()));
    }

    @PutMapping("/{id}/password")
    @Operation(summary = "Reset a user's password")
    public ResponseEntity<Void> resetPassword(@PathVariable Long id,
                                              @Valid @RequestBody AdminPasswordResetRequest request) {
        userAdminService.resetPassword(id, request);
        return ResponseEntity.noContent().build();
    }
}