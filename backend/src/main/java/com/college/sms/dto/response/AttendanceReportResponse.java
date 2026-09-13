package com.college.sms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceReportResponse {
    private long totalRecords;
    private long presentCount;
    private long absentCount;
    private long leaveCount;
    private BigDecimal attendancePercentage;
}
