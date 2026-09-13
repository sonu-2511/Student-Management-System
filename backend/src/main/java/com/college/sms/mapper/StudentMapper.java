package com.college.sms.mapper;

import com.college.sms.dto.request.StudentRequest;
import com.college.sms.dto.response.StudentResponse;
import com.college.sms.entity.Course;
import com.college.sms.entity.Department;
import com.college.sms.entity.Student;
import org.springframework.stereotype.Component;

@Component
public class StudentMapper {

    public Student toEntity(StudentRequest request, Department department, Course course) {
        return Student.builder()
                .rollNumber(request.getRollNumber())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .dateOfBirth(request.getDateOfBirth())
                .gender(request.getGender())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .admissionDate(request.getAdmissionDate())
                .department(department)
                .course(course)
                .semester(request.getSemester())
                .status(request.getStatus())
                .profileImage(request.getProfileImage())
                .build();
    }

    public void updateEntity(Student student, StudentRequest request, Department department, Course course) {
        student.setRollNumber(request.getRollNumber());
        student.setFirstName(request.getFirstName());
        student.setLastName(request.getLastName());
        student.setEmail(request.getEmail());
        student.setPhone(request.getPhone());
        student.setDateOfBirth(request.getDateOfBirth());
        student.setGender(request.getGender());
        student.setAddress(request.getAddress());
        student.setCity(request.getCity());
        student.setState(request.getState());
        student.setPincode(request.getPincode());
        student.setAdmissionDate(request.getAdmissionDate());
        student.setDepartment(department);
        student.setCourse(course);
        student.setSemester(request.getSemester());
        student.setStatus(request.getStatus());
        student.setProfileImage(request.getProfileImage());
    }

    public StudentResponse toResponse(Student student) {
        StudentResponse.DepartmentSummary departmentSummary = null;
        if (student.getDepartment() != null) {
            Department d = student.getDepartment();
            departmentSummary = StudentResponse.DepartmentSummary.builder()
                    .id(d.getId())
                    .departmentCode(d.getDepartmentCode())
                    .departmentName(d.getDepartmentName())
                    .build();
        }

        StudentResponse.CourseSummary courseSummary = null;
        if (student.getCourse() != null) {
            Course c = student.getCourse();
            courseSummary = StudentResponse.CourseSummary.builder()
                    .id(c.getId())
                    .courseCode(c.getCourseCode())
                    .courseName(c.getCourseName())
                    .build();
        }

        return StudentResponse.builder()
                .id(student.getId())
                .rollNumber(student.getRollNumber())
                .firstName(student.getFirstName())
                .lastName(student.getLastName())
                .email(student.getEmail())
                .phone(student.getPhone())
                .dateOfBirth(student.getDateOfBirth())
                .gender(student.getGender())
                .address(student.getAddress())
                .city(student.getCity())
                .state(student.getState())
                .pincode(student.getPincode())
                .admissionDate(student.getAdmissionDate())
                .department(departmentSummary)
                .course(courseSummary)
                .semester(student.getSemester())
                .status(student.getStatus())
                .profileImage(student.getProfileImage())
                .createdAt(student.getCreatedAt())
                .updatedAt(student.getUpdatedAt())
                .build();
    }
}
