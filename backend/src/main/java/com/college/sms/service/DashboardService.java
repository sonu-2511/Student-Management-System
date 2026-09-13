package com.college.sms.service;

import com.college.sms.dto.response.DashboardSummaryResponse;
import com.college.sms.dto.response.StudentRiskAlertResponse;

import java.util.List;

public interface DashboardService {

    DashboardSummaryResponse getSummary();

    List<StudentRiskAlertResponse> getAtRiskStudents();
}
