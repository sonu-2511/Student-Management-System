package com.college.sms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentAttendanceSummaryResponse {
    private long totalRecords;
    private long presentCount;
    private long absentCount;
    private long leaveCount;
    private BigDecimal attendancePercentage;
}