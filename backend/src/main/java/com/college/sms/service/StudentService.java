package com.college.sms.service;

import com.college.sms.dto.request.StudentRequest;
import com.college.sms.dto.request.StudentProfileRequest;
import com.college.sms.dto.response.PagedResponse;
import com.college.sms.dto.response.StudentCreationResponse;
import com.college.sms.dto.response.StudentResponse;
import com.college.sms.entity.AcademicStatus;
import org.springframework.data.domain.Pageable;

public interface StudentService {

    PagedResponse<StudentResponse> getAll(Pageable pageable,
                                           Long departmentId,
                                           Long courseId,
                                           Integer semester,
                                           AcademicStatus status);

    PagedResponse<StudentResponse> search(String keyword, Pageable pageable);

    PagedResponse<StudentResponse> getByDepartment(Long departmentId, Pageable pageable);

    StudentResponse getById(Long id);

    StudentResponse getMyProfile(String username);

    StudentResponse updateMyProfile(String username, StudentProfileRequest request);

    StudentCreationResponse create(StudentRequest request);

    StudentResponse update(Long id, StudentRequest request);

    void delete(Long id);
}
