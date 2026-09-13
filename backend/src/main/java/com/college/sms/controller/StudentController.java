package com.college.sms.controller;

import com.college.sms.dto.request.StudentRequest;
import com.college.sms.dto.request.StudentProfileRequest;
import com.college.sms.dto.response.PagedResponse;
import com.college.sms.dto.response.StudentCreationResponse;
import com.college.sms.dto.response.StudentResponse;
import com.college.sms.entity.AcademicStatus;
import com.college.sms.service.StudentService;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
@Tag(name = "Students", description = "Manage student records")
public class StudentController {

    private final StudentService studentService;

    @GetMapping
    @Operation(summary = "List students (paginated), optionally filtered by department, course, semester, status")
    public ResponseEntity<PagedResponse<StudentResponse>> getAll(
            @PageableDefault(size = 10, sort = "firstName") Pageable pageable,
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) Long courseId,
            @RequestParam(required = false) Integer semester,
            @RequestParam(required = false) AcademicStatus status) {
        return ResponseEntity.ok(studentService.getAll(pageable, departmentId, courseId, semester, status));
    }

    @GetMapping("/search")
    @Operation(summary = "Search students by keyword across name, email, roll number and phone")
    public ResponseEntity<PagedResponse<StudentResponse>> search(
            @RequestParam String keyword,
            @PageableDefault(size = 10, sort = "firstName") Pageable pageable) {
        return ResponseEntity.ok(studentService.search(keyword, pageable));
    }

    @GetMapping("/department/{departmentId}")
    @Operation(summary = "List students belonging to a specific department")
    public ResponseEntity<PagedResponse<StudentResponse>> getByDepartment(
            @PathVariable Long departmentId,
            @PageableDefault(size = 10, sort = "firstName") Pageable pageable) {
        return ResponseEntity.ok(studentService.getByDepartment(departmentId, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a student by id")
    public ResponseEntity<StudentResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getById(id));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get the logged-in student's profile")
    public ResponseEntity<StudentResponse> getMyProfile(Authentication authentication) {
        return ResponseEntity.ok(studentService.getMyProfile(authentication.getName()));
    }

    @PatchMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Update the logged-in student's contact profile")
    public ResponseEntity<StudentResponse> updateMyProfile(Authentication authentication,
                                                             @Valid @RequestBody StudentProfileRequest request) {
        return ResponseEntity.ok(studentService.updateMyProfile(authentication.getName(), request));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new student (ADMIN only)")
    public ResponseEntity<StudentCreationResponse> create(@Valid @RequestBody StudentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(studentService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update a student (ADMIN only)")
    public ResponseEntity<StudentResponse> update(@PathVariable Long id,
                                                   @Valid @RequestBody StudentRequest request) {
        return ResponseEntity.ok(studentService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a student (ADMIN only)")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        studentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
