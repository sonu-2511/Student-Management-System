package com.college.sms.service;

import com.college.sms.dto.request.AttendanceRequest;
import com.college.sms.dto.response.AttendanceResponse;
import com.college.sms.dto.response.PagedResponse;
import com.college.sms.dto.response.StudentAttendanceSummaryResponse;
import org.springframework.data.domain.Pageable;

public interface AttendanceService {

    AttendanceResponse create(AttendanceRequest request, String username);

    AttendanceResponse update(Long id, AttendanceRequest request, String username);

    PagedResponse<AttendanceResponse> getByStudent(Long studentId, Pageable pageable);

    StudentAttendanceSummaryResponse getStudentSummary(Long studentId, String username);

    PagedResponse<AttendanceResponse> getByCourse(Long courseId, Pageable pageable, String username);
}
