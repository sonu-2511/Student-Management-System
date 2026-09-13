package com.college.sms.controller;

import com.college.sms.dto.request.MarksRequest;
import com.college.sms.dto.response.MarksResponse;
import com.college.sms.dto.response.PagedResponse;
import com.college.sms.service.MarksService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/marks")
@RequiredArgsConstructor
@Tag(name = "Marks", description = "Record and query student marks/grades")
public class MarksController {

    private final MarksService marksService;

    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    @PostMapping
    @Operation(summary = "Record marks for a student in a course; total and grade are computed server-side (ADMIN, TEACHER)")
    public ResponseEntity<MarksResponse> create(@Valid @RequestBody MarksRequest request,
                                                 Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED).body(marksService.create(request, authentication.getName()));
    }

    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    @PutMapping("/{id}")
    @Operation(summary = "Update a marks record; total and grade are recomputed (ADMIN, TEACHER)")
    public ResponseEntity<MarksResponse> update(@PathVariable Long id,
                                                 @Valid @RequestBody MarksRequest request,
                                                 Authentication authentication) {
        return ResponseEntity.ok(marksService.update(id, request, authentication.getName()));
    }

    @GetMapping("/student/{studentId}")
    @Operation(summary = "Get a student's marks across courses (paginated)")
    public ResponseEntity<PagedResponse<MarksResponse>> getByStudent(
            @PathVariable Long studentId,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(marksService.getByStudent(studentId, pageable));
    }

    @GetMapping("/course/{courseId}")
    @Operation(summary = "Get all students' marks for a course (paginated)")
    public ResponseEntity<PagedResponse<MarksResponse>> getByCourse(
            @PathVariable Long courseId,
            @PageableDefault(size = 20) Pageable pageable,
            Authentication authentication) {
        return ResponseEntity.ok(marksService.getByCourse(courseId, pageable, authentication.getName()));
    }
}
