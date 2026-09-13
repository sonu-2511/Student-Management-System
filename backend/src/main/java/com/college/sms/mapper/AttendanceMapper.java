package com.college.sms.mapper;

import com.college.sms.dto.response.AttendanceResponse;
import com.college.sms.entity.Attendance;
import com.college.sms.entity.Course;
import com.college.sms.entity.Student;
import org.springframework.stereotype.Component;

@Component
public class AttendanceMapper {

    public AttendanceResponse toResponse(Attendance attendance) {
        Student s = attendance.getStudent();
        Course c = attendance.getCourse();

        AttendanceResponse.StudentSummary studentSummary = AttendanceResponse.StudentSummary.builder()
                .id(s.getId())
                .rollNumber(s.getRollNumber())
                .firstName(s.getFirstName())
                .lastName(s.getLastName())
                .build();

        AttendanceResponse.CourseSummary courseSummary = AttendanceResponse.CourseSummary.builder()
                .id(c.getId())
                .courseCode(c.getCourseCode())
                .courseName(c.getCourseName())
                .build();

        return AttendanceResponse.builder()
                .id(attendance.getId())
                .student(studentSummary)
                .course(courseSummary)
                .date(attendance.getDate())
                .status(attendance.getStatus())
                .remarks(attendance.getRemarks())
                .createdAt(attendance.getCreatedAt())
                .updatedAt(attendance.getUpdatedAt())
                .build();
    }
}
