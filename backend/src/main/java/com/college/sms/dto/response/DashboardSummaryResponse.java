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
public class DashboardSummaryResponse {
    private long totalStudents;
    private long totalTeachers;
    private long totalCourses;
    private long totalDepartments;
    /** Students marked PRESENT for today's date, across all courses. */
    private long presentStudentsToday;
    /** Overall attendance rate across all recorded attendance, as a percentage (0-100). */
    private BigDecimal averageAttendancePercentage;
    /** Overall average of totalMarks across all recorded Marks (raw scale out of 400 — see GradeCalculator). */
    private BigDecimal averageMarks;
}
