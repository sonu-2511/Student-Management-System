package com.college.sms.mapper;

import com.college.sms.dto.response.CourseResponse;
import com.college.sms.entity.Course;
import com.college.sms.entity.Department;
import org.springframework.stereotype.Component;

@Component
public class CourseMapper {

    public Course toEntity(String courseCode, String courseName, Integer credits, Integer semester, Department department) {
        return Course.builder()
                .courseCode(courseCode)
                .courseName(courseName)
                .credits(credits)
                .semester(semester)
                .department(department)
                .build();
    }

    public CourseResponse toResponse(Course course) {
        CourseResponse.DepartmentSummary departmentSummary = CourseResponse.DepartmentSummary.builder()
                .id(course.getDepartment().getId())
                .departmentCode(course.getDepartment().getDepartmentCode())
                .departmentName(course.getDepartment().getDepartmentName())
                .build();

        return CourseResponse.builder()
                .id(course.getId())
                .courseCode(course.getCourseCode())
                .courseName(course.getCourseName())
                .credits(course.getCredits())
                .semester(course.getSemester())
                .department(departmentSummary)
                .createdAt(course.getCreatedAt())
                .updatedAt(course.getUpdatedAt())
                .build();
    }
}
