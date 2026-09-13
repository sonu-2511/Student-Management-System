package com.college.sms.controller;

import com.college.sms.dto.response.DashboardSummaryResponse;
import com.college.sms.dto.response.StudentRiskAlertResponse;
import com.college.sms.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Aggregate counts and stats for the admin/teacher dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    @Operation(summary = "Get dashboard summary counts and averages (ADMIN, TEACHER)")
    public ResponseEntity<DashboardSummaryResponse> getSummary() {
        return ResponseEntity.ok(dashboardService.getSummary());
    }

    @GetMapping("/at-risk-students")
    @Operation(summary = "Get students needing academic intervention based on attendance and marks")
    public ResponseEntity<List<StudentRiskAlertResponse>> getAtRiskStudents() {
        return ResponseEntity.ok(dashboardService.getAtRiskStudents());
    }
}
