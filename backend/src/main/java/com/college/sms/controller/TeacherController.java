package com.college.sms.controller;

import com.college.sms.dto.request.TeacherRequest;
import com.college.sms.dto.request.TeacherProfileRequest;
import com.college.sms.dto.response.PagedResponse;
import com.college.sms.dto.response.TeacherResponse;
import com.college.sms.service.TeacherService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/teachers")
@RequiredArgsConstructor
@Tag(name = "Teachers", description = "Manage teacher records and course assignments")
public class TeacherController {

    private final TeacherService teacherService;

    @GetMapping
    @Operation(summary = "List teachers (paginated)")
    public ResponseEntity<PagedResponse<TeacherResponse>> getAll(
            @PageableDefault(size = 10, sort = "firstName") Pageable pageable) {
        return ResponseEntity.ok(teacherService.getAll(pageable));
    }

    @GetMapping("/department/{departmentId}")
    @Operation(summary = "List teachers belonging to a specific department")
    public ResponseEntity<PagedResponse<TeacherResponse>> getByDepartment(
            @PathVariable Long departmentId,
            @PageableDefault(size = 10, sort = "firstName") Pageable pageable) {
        return ResponseEntity.ok(teacherService.getByDepartment(departmentId, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a teacher by id")
    public ResponseEntity<TeacherResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(teacherService.getById(id));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('TEACHER')")
    @Operation(summary = "Get the logged-in faculty member's profile")
    public ResponseEntity<TeacherResponse> getMyProfile(Authentication authentication) {
        return ResponseEntity.ok(teacherService.getMyProfile(authentication.getName()));
    }

    @PatchMapping("/me")
    @PreAuthorize("hasRole('TEACHER')")
    @Operation(summary = "Update the logged-in faculty member's contact profile")
    public ResponseEntity<TeacherResponse> updateMyProfile(Authentication authentication,
                                                             @Valid @RequestBody TeacherProfileRequest request) {
        return ResponseEntity.ok(teacherService.updateMyProfile(authentication.getName(), request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    @Operation(summary = "Create a new teacher (ADMIN only)")
    public ResponseEntity<TeacherResponse> create(@Valid @RequestBody TeacherRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(teacherService.create(request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    @Operation(summary = "Update a teacher (ADMIN only)")
    public ResponseEntity<TeacherResponse> update(@PathVariable Long id,
                                                   @Valid @RequestBody TeacherRequest request) {
        return ResponseEntity.ok(teacherService.update(id, request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a teacher (ADMIN only)")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        teacherService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
