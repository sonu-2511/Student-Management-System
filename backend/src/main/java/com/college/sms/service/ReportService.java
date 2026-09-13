package com.college.sms.service;

import com.college.sms.dto.response.AttendanceReportResponse;
import com.college.sms.dto.response.CountItem;

import java.time.LocalDate;
import java.util.List;

public interface ReportService {

    List<CountItem> studentsByDepartment();

    List<CountItem> studentsBySemester();

    AttendanceReportResponse attendanceReport(Long departmentId, Long courseId, Integer semester,
                                               LocalDate fromDate, LocalDate toDate);

    List<CountItem> gradeDistribution(Long departmentId, Long courseId, Integer semester);
}
