package com.college.sms.service.impl;

import com.college.sms.dto.response.DashboardSummaryResponse;
import com.college.sms.dto.response.StudentRiskAlertResponse;
import com.college.sms.entity.AcademicStatus;
import com.college.sms.entity.AttendanceStatus;
import com.college.sms.entity.Marks;
import com.college.sms.entity.Student;
import com.college.sms.repository.AttendanceRepository;
import com.college.sms.repository.CourseRepository;
import com.college.sms.repository.DepartmentRepository;
import com.college.sms.repository.MarksRepository;
import com.college.sms.repository.StudentRepository;
import com.college.sms.repository.TeacherRepository;
import com.college.sms.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final CourseRepository courseRepository;
    private final DepartmentRepository departmentRepository;
    private final AttendanceRepository attendanceRepository;
    private final MarksRepository marksRepository;

    @Override
    public DashboardSummaryResponse getSummary() {
        long totalStudents = studentRepository.count();
        long totalTeachers = teacherRepository.count();
        long totalCourses = courseRepository.count();
        long totalDepartments = departmentRepository.count();

        long presentToday = attendanceRepository.countByDateAndStatus(LocalDate.now(), AttendanceStatus.PRESENT);

        long totalAttendanceRecords = attendanceRepository.count();
        long presentRecords = attendanceRepository.countByStatus(AttendanceStatus.PRESENT);
        BigDecimal averageAttendancePercentage = totalAttendanceRecords == 0
                ? BigDecimal.ZERO
                : BigDecimal.valueOf(presentRecords)
                    .multiply(BigDecimal.valueOf(100))
                    .divide(BigDecimal.valueOf(totalAttendanceRecords), 2, RoundingMode.HALF_UP);

        BigDecimal averageMarks = marksRepository.averageTotalMarks();
        if (averageMarks == null) {
            averageMarks = BigDecimal.ZERO;
        } else {
            averageMarks = averageMarks.setScale(2, RoundingMode.HALF_UP);
        }

        return DashboardSummaryResponse.builder()
                .totalStudents(totalStudents)
                .totalTeachers(totalTeachers)
                .totalCourses(totalCourses)
                .totalDepartments(totalDepartments)
                .presentStudentsToday(presentToday)
                .averageAttendancePercentage(averageAttendancePercentage)
                .averageMarks(averageMarks)
                .build();
    }

    @Override
    public List<StudentRiskAlertResponse> getAtRiskStudents() {
        List<Student> students = studentRepository.findAll();

        return students.stream()
                .map(this::buildRiskAlert)
                .filter(alert -> !alert.getReasons().isEmpty())
                .sorted(Comparator.comparing(StudentRiskAlertResponse::getPriorityScore).reversed())
                .limit(8)
                .toList();
    }

    private StudentRiskAlertResponse buildRiskAlert(Student student) {
        long totalAttendance = attendanceRepository.countByStudentId(student.getId());
        long presentAttendance = attendanceRepository.countByStudentIdAndStatus(student.getId(), AttendanceStatus.PRESENT);
        BigDecimal attendancePercentage = totalAttendance == 0
                ? BigDecimal.ZERO
                : BigDecimal.valueOf(presentAttendance)
                    .multiply(BigDecimal.valueOf(100))
                    .divide(BigDecimal.valueOf(totalAttendance), 2, RoundingMode.HALF_UP);

        List<Marks> studentMarks = marksRepository.findByStudentId(student.getId(), Pageable.unpaged()).getContent();
        BigDecimal averageMarks = studentMarks.isEmpty()
                ? BigDecimal.ZERO
                : studentMarks.stream()
                    .map(Marks::getTotalMarks)
                    .reduce(BigDecimal.ZERO, BigDecimal::add)
                    .divide(BigDecimal.valueOf(studentMarks.size()), 2, RoundingMode.HALF_UP);

        List<String> reasons = new ArrayList<>();
        if (attendancePercentage.compareTo(new BigDecimal("75")) < 0) {
            reasons.add("Attendance below 75%");
        }
        if (averageMarks.compareTo(new BigDecimal("50")) < 0) {
            reasons.add("Average marks below 50");
        }
        if (student.getStatus() != AcademicStatus.ACTIVE) {
            reasons.add("Academic status not active");
        }
        if (studentMarks.stream().anyMatch(mark -> "F".equalsIgnoreCase(mark.getGrade()))) {
            reasons.add("Repeated failing grade");
        }

        int priorityScore = reasons.size() * 10;
        String priority = priorityScore >= 20 ? "HIGH" : (priorityScore >= 10 ? "MEDIUM" : "LOW");

        return StudentRiskAlertResponse.builder()
                .studentId(student.getId())
                .studentName(student.getFirstName() + " " + student.getLastName())
                .rollNumber(student.getRollNumber())
                .departmentName(student.getDepartment() != null ? student.getDepartment().getDepartmentName() : "N/A")
                .courseName(student.getCourse() != null ? student.getCourse().getCourseName() : "General")
                .semester(student.getSemester())
                .attendancePercentage(attendancePercentage)
                .averageMarks(averageMarks)
                .priority(priority)
                .priorityScore(priorityScore)
                .reasons(reasons)
                .build();
    }
}
