package com.college.sms.service;

import com.college.sms.dto.response.StudentRiskAlertResponse;
import com.college.sms.entity.*;
import com.college.sms.repository.*;
import com.college.sms.service.impl.DashboardServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DashboardServiceImplTest {

    @Mock private StudentRepository studentRepository;
    @Mock private TeacherRepository teacherRepository;
    @Mock private CourseRepository courseRepository;
    @Mock private DepartmentRepository departmentRepository;
    @Mock private AttendanceRepository attendanceRepository;
    @Mock private MarksRepository marksRepository;

    @InjectMocks private DashboardServiceImpl dashboardService;

    @Test
    void getAtRiskStudentsFlagsStudentsWithLowAttendanceOrMarks() {
        Department department = Department.builder().id(1L).departmentName("Computer Science").build();
        Course course = Course.builder().id(2L).courseName("Algorithms").build();
        Student student = Student.builder()
                .id(10L)
                .firstName("Asha")
                .lastName("Patel")
                .rollNumber("CS-101")
                .email("asha@test.com")
                .phone("9999999999")
                .department(department)
                .course(course)
                .semester(5)
                .status(AcademicStatus.ACTIVE)
                .build();

        when(studentRepository.findAll()).thenReturn(List.of(student));
        when(attendanceRepository.countByStudentId(10L)).thenReturn(12L);
        when(attendanceRepository.countByStudentIdAndStatus(10L, AttendanceStatus.PRESENT)).thenReturn(5L);
        when(marksRepository.findByStudentId(10L, Pageable.unpaged())).thenReturn(new PageImpl<>(List.of(
                Marks.builder().student(student).course(course).totalMarks(new BigDecimal("42.00")).grade("F").build()
        )));

        List<StudentRiskAlertResponse> alerts = dashboardService.getAtRiskStudents();

        assertThat(alerts).hasSize(1);
        assertThat(alerts.get(0).getStudentName()).isEqualTo("Asha Patel");
        assertThat(alerts.get(0).getPriority()).isEqualTo("HIGH");
        assertThat(alerts.get(0).getReasons()).isNotEmpty();
    }
}
