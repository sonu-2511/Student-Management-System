package com.college.sms.repository;

import com.college.sms.entity.Attendance;
import com.college.sms.entity.AttendanceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.LocalDate;

public interface AttendanceRepository extends JpaRepository<Attendance, Long>, JpaSpecificationExecutor<Attendance> {

    boolean existsByStudentIdAndCourseIdAndDate(Long studentId, Long courseId, LocalDate date);

    boolean existsByStudentIdAndCourseIdAndDateAndIdNot(Long studentId, Long courseId,
                                                         LocalDate date, Long id);

    Page<Attendance> findByStudentId(Long studentId, Pageable pageable);

    Page<Attendance> findByCourseId(Long courseId, Pageable pageable);

    long countByStudentIdAndStatus(Long studentId, AttendanceStatus status);

    long countByStudentId(Long studentId);

    long countByDate(LocalDate date);

    long countByDateAndStatus(LocalDate date, AttendanceStatus status);

    long countByStatus(AttendanceStatus status);
}
