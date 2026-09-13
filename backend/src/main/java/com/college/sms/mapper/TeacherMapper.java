package com.college.sms.mapper;

import com.college.sms.dto.response.TeacherResponse;
import com.college.sms.entity.AcademicStatus;
import com.college.sms.entity.Course;
import com.college.sms.entity.Department;
import com.college.sms.entity.Teacher;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.Set;

@Component
public class TeacherMapper {

    public Teacher toEntity(String employeeId, String firstName, String lastName, String email,
                             String phone, Department department, String designation,
                             LocalDate joiningDate, AcademicStatus status,
                             Set<Course> courses) {
        return Teacher.builder()
                .employeeId(employeeId)
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .phone(phone)
                .department(department)
                .designation(designation)
                .joiningDate(joiningDate)
                .status(status)
                .courses(courses)
                .build();
    }

    public TeacherResponse toResponse(Teacher teacher) {
        TeacherResponse.DepartmentSummary departmentSummary = null;
        if (teacher.getDepartment() != null) {
            Department d = teacher.getDepartment();
            departmentSummary = TeacherResponse.DepartmentSummary.builder()
                    .id(d.getId())
                    .departmentCode(d.getDepartmentCode())
                    .departmentName(d.getDepartmentName())
                    .build();
        }

        var courseSummaries = teacher.getCourses().stream()
                .sorted(Comparator.comparing(Course::getCourseName))
                .map(c -> TeacherResponse.CourseSummary.builder()
                        .id(c.getId())
                        .courseCode(c.getCourseCode())
                        .courseName(c.getCourseName())
                        .build())
                .toList();

        return TeacherResponse.builder()
                .id(teacher.getId())
                .employeeId(teacher.getEmployeeId())
                .firstName(teacher.getFirstName())
                .lastName(teacher.getLastName())
                .email(teacher.getEmail())
                .phone(teacher.getPhone())
                .department(departmentSummary)
                .designation(teacher.getDesignation())
                .joiningDate(teacher.getJoiningDate())
                .status(teacher.getStatus())
                .courses(courseSummaries)
                .createdAt(teacher.getCreatedAt())
                .updatedAt(teacher.getUpdatedAt())
                .build();
    }
}
