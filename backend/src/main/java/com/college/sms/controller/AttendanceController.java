package com.college.sms.controller;

import com.college.sms.dto.request.AttendanceRequest;
import com.college.sms.dto.response.AttendanceResponse;
import com.college.sms.dto.response.PagedResponse;
import com.college.sms.dto.response.StudentAttendanceSummaryResponse;
import com.college.sms.service.AttendanceService;
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
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
@Tag(name = "Attendance", description = "Mark and query student attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    @PostMapping
    @Operation(summary = "Mark attendance for a student in a course on a given date (ADMIN, TEACHER)")
    public ResponseEntity<AttendanceResponse> create(@Valid @RequestBody AttendanceRequest request,
                                                      Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED).body(attendanceService.create(request, authentication.getName()));
    }

    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    @PutMapping("/{id}")
    @Operation(summary = "Update an existing attendance record (ADMIN, TEACHER)")
    public ResponseEntity<AttendanceResponse> update(@PathVariable Long id,
                                                      @Valid @RequestBody AttendanceRequest request,
                                                      Authentication authentication) {
        return ResponseEntity.ok(attendanceService.update(id, request, authentication.getName()));
    }

    @GetMapping("/student/{studentId}")
    @Operation(summary = "Get a student's attendance history (paginated)")
    public ResponseEntity<PagedResponse<AttendanceResponse>> getByStudent(
            @PathVariable Long studentId,
            @PageableDefault(size = 20, sort = "date") Pageable pageable) {
        return ResponseEntity.ok(attendanceService.getByStudent(studentId, pageable));
    }

    @GetMapping("/student/{studentId}/summary")
    @Operation(summary = "Get a student's attendance summary")
    public ResponseEntity<StudentAttendanceSummaryResponse> getStudentSummary(
            @PathVariable Long studentId, Authentication authentication) {
        return ResponseEntity.ok(attendanceService.getStudentSummary(studentId, authentication.getName()));
    }

    @GetMapping("/course/{courseId}")
    @Operation(summary = "Get a course's attendance records (paginated)")
    public ResponseEntity<PagedResponse<AttendanceResponse>> getByCourse(
            @PathVariable Long courseId,
            @PageableDefault(size = 20, sort = "date") Pageable pageable,
            Authentication authentication) {
        return ResponseEntity.ok(attendanceService.getByCourse(courseId, pageable, authentication.getName()));
    }
}
