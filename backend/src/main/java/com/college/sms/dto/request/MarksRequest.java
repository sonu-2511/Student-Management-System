package com.college.sms.dto.request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MarksRequest {

    @NotNull(message = "Student is required")
    private Long studentId;

    @NotNull(message = "Course is required")
    private Long courseId;

    @NotNull(message = "Internal marks is required")
    @DecimalMin(value = "0", message = "Internal marks cannot be negative")
    @DecimalMax(value = "100", message = "Internal marks cannot exceed 100")
    private BigDecimal internalMarks;

    @NotNull(message = "Assignment marks is required")
    @DecimalMin(value = "0", message = "Assignment marks cannot be negative")
    @DecimalMax(value = "100", message = "Assignment marks cannot exceed 100")
    private BigDecimal assignmentMarks;

    @NotNull(message = "Practical marks is required")
    @DecimalMin(value = "0", message = "Practical marks cannot be negative")
    @DecimalMax(value = "100", message = "Practical marks cannot exceed 100")
    private BigDecimal practicalMarks;

    @NotNull(message = "Exam marks is required")
    @DecimalMin(value = "0", message = "Exam marks cannot be negative")
    @DecimalMax(value = "100", message = "Exam marks cannot exceed 100")
    private BigDecimal examMarks;

    @Size(max = 255, message = "Remarks cannot exceed 255 characters")
    private String remarks;
}
