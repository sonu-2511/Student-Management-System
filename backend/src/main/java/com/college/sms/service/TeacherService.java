package com.college.sms.service;

import com.college.sms.dto.request.TeacherRequest;
import com.college.sms.dto.request.TeacherProfileRequest;
import com.college.sms.dto.response.PagedResponse;
import com.college.sms.dto.response.TeacherResponse;
import org.springframework.data.domain.Pageable;

public interface TeacherService {

    PagedResponse<TeacherResponse> getAll(Pageable pageable);

    PagedResponse<TeacherResponse> getByDepartment(Long departmentId, Pageable pageable);

    TeacherResponse getById(Long id);

    TeacherResponse getMyProfile(String username);

    TeacherResponse updateMyProfile(String username, TeacherProfileRequest request);

    TeacherResponse create(TeacherRequest request);

    TeacherResponse update(Long id, TeacherRequest request);

    void delete(Long id);
}
