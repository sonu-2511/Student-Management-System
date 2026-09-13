package com.college.sms.service.impl;

import com.college.sms.dto.request.MarksRequest;
import com.college.sms.dto.response.MarksResponse;
import com.college.sms.dto.response.PagedResponse;
import com.college.sms.entity.Course;
import com.college.sms.entity.Marks;
import com.college.sms.entity.Student;
import com.college.sms.exception.DuplicateResourceException;
import com.college.sms.exception.ResourceNotFoundException;
import com.college.sms.mapper.MarksMapper;
import com.college.sms.repository.CourseRepository;
import com.college.sms.repository.MarksRepository;
import com.college.sms.repository.StudentRepository;
import com.college.sms.repository.TeacherRepository;
import com.college.sms.repository.UserRepository;
import com.college.sms.service.MarksService;
import com.college.sms.service.AuditLogService;
import com.college.sms.util.GradeCalculator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MarksServiceImpl implements MarksService {

    private final MarksRepository marksRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final MarksMapper marksMapper;
    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    @Override
    @Transactional
    public MarksResponse create(MarksRequest request, String username) {
        verifyCourseAccess(username, request.getCourseId());
        if (marksRepository.existsByStudentIdAndCourseId(request.getStudentId(), request.getCourseId())) {
            throw new DuplicateResourceException(
                    "Marks for this student in this course have already been recorded");
        }

        Student student = findStudentOrThrow(request.getStudentId());
        Course course = findCourseOrThrow(request.getCourseId());

        BigDecimal total = GradeCalculator.computeTotal(
                request.getInternalMarks(), request.getAssignmentMarks(),
                request.getPracticalMarks(), request.getExamMarks());
        String grade = GradeCalculator.computeGrade(total);

        Marks marks = Marks.builder()
                .student(student)
                .course(course)
                .internalMarks(request.getInternalMarks())
                .assignmentMarks(request.getAssignmentMarks())
                .practicalMarks(request.getPracticalMarks())
                .examMarks(request.getExamMarks())
                .totalMarks(total)
                .grade(grade)
                .remarks(request.getRemarks())
                .build();

        Marks saved = marksRepository.save(marks);
        auditLogService.record(username, "CREATE", "MARKS", saved.getId(),
            "Recorded marks for student " + request.getStudentId() + " in course " + request.getCourseId());
        return marksMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public MarksResponse update(Long id, MarksRequest request, String username) {
        verifyCourseAccess(username, request.getCourseId());
        Marks existing = marksRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Marks record", id));

        if (marksRepository.existsByStudentIdAndCourseIdAndIdNot(
                request.getStudentId(), request.getCourseId(), id)) {
            throw new DuplicateResourceException(
                    "Marks for this student in this course have already been recorded");
        }

        Student student = findStudentOrThrow(request.getStudentId());
        Course course = findCourseOrThrow(request.getCourseId());

        BigDecimal total = GradeCalculator.computeTotal(
                request.getInternalMarks(), request.getAssignmentMarks(),
                request.getPracticalMarks(), request.getExamMarks());
        String grade = GradeCalculator.computeGrade(total);

        existing.setStudent(student);
        existing.setCourse(course);
        existing.setInternalMarks(request.getInternalMarks());
        existing.setAssignmentMarks(request.getAssignmentMarks());
        existing.setPracticalMarks(request.getPracticalMarks());
        existing.setExamMarks(request.getExamMarks());
        existing.setTotalMarks(total);
        existing.setGrade(grade);
        existing.setRemarks(request.getRemarks());

        Marks saved = marksRepository.save(existing);
        auditLogService.record(username, "UPDATE", "MARKS", saved.getId(),
            "Updated marks for student " + request.getStudentId() + " in course " + request.getCourseId());
        return marksMapper.toResponse(saved);
    }

    @Override
    public PagedResponse<MarksResponse> getByStudent(Long studentId, Pageable pageable) {
        if (!studentRepository.existsById(studentId)) {
            throw ResourceNotFoundException.of("Student", studentId);
        }
        return toPagedResponse(marksRepository.findByStudentId(studentId, pageable));
    }

    @Override
    public PagedResponse<MarksResponse> getByCourse(Long courseId, Pageable pageable, String username) {
        verifyCourseAccess(username, courseId);
        if (!courseRepository.existsById(courseId)) {
            throw ResourceNotFoundException.of("Course", courseId);
        }
        return toPagedResponse(marksRepository.findByCourseId(courseId, pageable));
    }

    private PagedResponse<MarksResponse> toPagedResponse(Page<Marks> page) {
        return PagedResponse.from(page.map(marksMapper::toResponse));
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
}
