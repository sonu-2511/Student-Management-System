package com.college.sms.controller;

import com.college.sms.dto.response.AttendanceReportResponse;
import com.college.sms.dto.response.CountItem;
import com.college.sms.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@Tag(name = "Reports", description = "Academic reports filterable by department, course, semester and date range")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/students-by-department")
    @Operation(summary = "Student headcount grouped by department (ADMIN, TEACHER)")
    public ResponseEntity<List<CountItem>> studentsByDepartment() {
        return ResponseEntity.ok(reportService.studentsByDepartment());
    }

    @GetMapping("/students-by-semester")
    @Operation(summary = "Student headcount grouped by semester (ADMIN, TEACHER)")
    public ResponseEntity<List<CountItem>> studentsBySemester() {
        return ResponseEntity.ok(reportService.studentsBySemester());
    }

    @GetMapping("/attendance")
    @Operation(summary = "Attendance report, optionally filtered by department, course, semester and date range (ADMIN, TEACHER)")
    public ResponseEntity<AttendanceReportResponse> attendanceReport(
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) Long courseId,
            @RequestParam(required = false) Integer semester,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {
        return ResponseEntity.ok(reportService.attendanceReport(departmentId, courseId, semester, fromDate, toDate));
    }

    @GetMapping("/grade-distribution")
    @Operation(summary = "Grade distribution, optionally filtered by department, course and semester (ADMIN, TEACHER)")
    public ResponseEntity<List<CountItem>> gradeDistribution(
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) Long courseId,
            @RequestParam(required = false) Integer semester) {
        return ResponseEntity.ok(reportService.gradeDistribution(departmentId, courseId, semester));
    }
}
