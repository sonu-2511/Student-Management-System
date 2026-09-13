package com.college.sms.service.impl;

import com.college.sms.dto.request.AttendanceRequest;
import com.college.sms.dto.response.AttendanceResponse;
import com.college.sms.dto.response.PagedResponse;
import com.college.sms.dto.response.StudentAttendanceSummaryResponse;
import com.college.sms.entity.Attendance;
import com.college.sms.entity.Course;
import com.college.sms.entity.Student;
import com.college.sms.exception.DuplicateResourceException;
import com.college.sms.exception.ResourceNotFoundException;
import com.college.sms.mapper.AttendanceMapper;
import com.college.sms.repository.AttendanceRepository;
import com.college.sms.repository.CourseRepository;
import com.college.sms.repository.StudentRepository;
import com.college.sms.repository.TeacherRepository;
import com.college.sms.repository.UserRepository;
import com.college.sms.service.AttendanceService;
import com.college.sms.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final AttendanceMapper attendanceMapper;
    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    @Override
    @Transactional
    public AttendanceResponse create(AttendanceRequest request, String username) {
        verifyCourseAccess(username, request.getCourseId());
        if (attendanceRepository.existsByStudentIdAndCourseIdAndDate(
                request.getStudentId(), request.getCourseId(), request.getDate())) {
            throw new DuplicateResourceException(
                    "Attendance for this student, course and date has already been recorded");
        }

        Student student = findStudentOrThrow(request.getStudentId());
        Course course = findCourseOrThrow(request.getCourseId());

        Attendance attendance = Attendance.builder()
                .student(student)
                .course(course)
                .date(request.getDate())
                .status(request.getStatus())
                .remarks(request.getRemarks())
                .build();

        Attendance saved = attendanceRepository.save(attendance);
        auditLogService.record(username, "CREATE", "ATTENDANCE", saved.getId(),
            "Recorded attendance for student " + request.getStudentId() + " in course " + request.getCourseId());
        return attendanceMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public AttendanceResponse update(Long id, AttendanceRequest request, String username) {
        verifyCourseAccess(username, request.getCourseId());
        Attendance existing = attendanceRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Attendance record", id));

        if (attendanceRepository.existsByStudentIdAndCourseIdAndDateAndIdNot(
                request.getStudentId(), request.getCourseId(), request.getDate(), id)) {
            throw new DuplicateResourceException(
                    "Attendance for this student, course and date has already been recorded");
        }

        Student student = findStudentOrThrow(request.getStudentId());
        Course course = findCourseOrThrow(request.getCourseId());

        existing.setStudent(student);
        existing.setCourse(course);
        existing.setDate(request.getDate());
        existing.setStatus(request.getStatus());
        existing.setRemarks(request.getRemarks());

        Attendance saved = attendanceRepository.save(existing);
        auditLogService.record(username, "UPDATE", "ATTENDANCE", saved.getId(),
            "Updated attendance for student " + request.getStudentId() + " in course " + request.getCourseId());
        return attendanceMapper.toResponse(saved);
    }

    @Override
    public PagedResponse<AttendanceResponse> getByStudent(Long studentId, Pageable pageable) {
        if (!studentRepository.existsById(studentId)) {
            throw ResourceNotFoundException.of("Student", studentId);
        }
        return toPagedResponse(attendanceRepository.findByStudentId(studentId, pageable));
    }

    @Override
    public StudentAttendanceSummaryResponse getStudentSummary(Long studentId, String username) {
        verifyStudentAccess(studentId, username);
        long total = attendanceRepository.countByStudentId(studentId);
        long present = attendanceRepository.countByStudentIdAndStatus(studentId, com.college.sms.entity.AttendanceStatus.PRESENT);
        long absent = attendanceRepository.countByStudentIdAndStatus(studentId, com.college.sms.entity.AttendanceStatus.ABSENT);
        long leave = attendanceRepository.countByStudentIdAndStatus(studentId, com.college.sms.entity.AttendanceStatus.LEAVE);
        BigDecimal percentage = total == 0 ? BigDecimal.ZERO
                : BigDecimal.valueOf(present).multiply(BigDecimal.valueOf(100))
                    .divide(BigDecimal.valueOf(total), 2, RoundingMode.HALF_UP);
        return StudentAttendanceSummaryResponse.builder()
                .totalRecords(total)
                .presentCount(present)
                .absentCount(absent)
                .leaveCount(leave)
                .attendancePercentage(percentage)
                .build();
    }

    @Override
    public PagedResponse<AttendanceResponse> getByCourse(Long courseId, Pageable pageable, String username) {
        verifyCourseAccess(username, courseId);
        if (!courseRepository.existsById(courseId)) {
            throw ResourceNotFoundException.of("Course", courseId);
        }
        return toPagedResponse(attendanceRepository.findByCourseId(courseId, pageable));
    }

    private PagedResponse<AttendanceResponse> toPagedResponse(Page<Attendance> page) {
        return PagedResponse.from(page.map(attendanceMapper::toResponse));
    }

    private Student findStudentOrThrow(Long studentId) {
        return studentRepository.findById(studentId)
                .orElseThrow(() -> ResourceNotFoundException.of("Student", studentId));
    }

    private Course findCourseOrThrow(Long courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> ResourceNotFoundException.of("Course", courseId));
    }

    private void verifyCourseAccess(String username, Long courseId) {
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new org.springframework.security.access.AccessDeniedException("Unknown login account"));
        if (user.getRole() == com.college.sms.entity.Role.TEACHER
                && (user.getTeacherId() == null
                || !teacherRepository.existsByIdAndCoursesId(user.getTeacherId(), courseId))) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "You are not assigned to this course");
        }
    }

    private void verifyStudentAccess(Long studentId, String username) {
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new org.springframework.security.access.AccessDeniedException("Unknown login account"));
        if (user.getRole() == com.college.sms.entity.Role.STUDENT
                && !studentId.equals(user.getStudentId())) {
            throw new org.springframework.security.access.AccessDeniedException("You can only view your own attendance");
        }
    }
}
