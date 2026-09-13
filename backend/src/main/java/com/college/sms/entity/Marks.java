package com.college.sms.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "marks",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_marks_student_course",
                columnNames = {"student_id", "course_id"}))
@EntityListeners(AuditingEntityListener.class)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Marks extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(name = "internal_marks", nullable = false, precision = 5, scale = 2)
    private BigDecimal internalMarks;

    @Column(name = "assignment_marks", nullable = false, precision = 5, scale = 2)
    private BigDecimal assignmentMarks;

    @Column(name = "practical_marks", nullable = false, precision = 5, scale = 2)
    private BigDecimal practicalMarks;

    @Column(name = "exam_marks", nullable = false, precision = 5, scale = 2)
    private BigDecimal examMarks;

    @Column(name = "total_marks", nullable = false, precision = 6, scale = 2)
    private BigDecimal totalMarks;

    @Column(length = 5)
    private String grade;

    @Column(length = 255)
    private String remarks;
}
