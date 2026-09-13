package com.college.sms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentRiskAlertResponse {
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private String departmentName;
    private String courseName;
    private Integer semester;
    private BigDecimal attendancePercentage;
    private BigDecimal averageMarks;
    private String priority;
    private int priorityScore;
    private List<String> reasons;
}
