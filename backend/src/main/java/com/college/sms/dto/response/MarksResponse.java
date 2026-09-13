package com.college.sms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MarksResponse {
    private Long id;
    private StudentSummary student;
    private CourseSummary course;
    private BigDecimal internalMarks;
    private BigDecimal assignmentMarks;
    private BigDecimal practicalMarks;
    private BigDecimal examMarks;
    private BigDecimal totalMarks;
    private String grade;
    private String remarks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StudentSummary {
        private Long id;
        private String rollNumber;
        private String firstName;
        private String lastName;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CourseSummary {
        private Long id;
        private String courseCode;
        private String courseName;
    }
}
