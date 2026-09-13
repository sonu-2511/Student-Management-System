package com.college.sms.mapper;

import com.college.sms.dto.response.MarksResponse;
import com.college.sms.entity.Course;
import com.college.sms.entity.Marks;
import com.college.sms.entity.Student;
import org.springframework.stereotype.Component;

@Component
public class MarksMapper {

    public MarksResponse toResponse(Marks marks) {
        Student s = marks.getStudent();
        Course c = marks.getCourse();

        MarksResponse.StudentSummary studentSummary = MarksResponse.StudentSummary.builder()
                .id(s.getId())
                .rollNumber(s.getRollNumber())
                .firstName(s.getFirstName())
                .lastName(s.getLastName())
                .build();

        MarksResponse.CourseSummary courseSummary = MarksResponse.CourseSummary.builder()
                .id(c.getId())
                .courseCode(c.getCourseCode())
                .courseName(c.getCourseName())
                .build();

        return MarksResponse.builder()
                .id(marks.getId())
                .student(studentSummary)
                .course(courseSummary)
                .internalMarks(marks.getInternalMarks())
                .assignmentMarks(marks.getAssignmentMarks())
                .practicalMarks(marks.getPracticalMarks())
                .examMarks(marks.getExamMarks())
                .totalMarks(marks.getTotalMarks())
                .grade(marks.getGrade())
                .remarks(marks.getRemarks())
                .createdAt(marks.getCreatedAt())
                .updatedAt(marks.getUpdatedAt())
                .build();
    }
}
