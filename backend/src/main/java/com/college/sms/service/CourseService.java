package com.college.sms.service;

import com.college.sms.dto.request.CourseRequest;
import com.college.sms.dto.response.CourseResponse;
import com.college.sms.dto.response.PagedResponse;
import org.springframework.data.domain.Pageable;

public interface CourseService {

    PagedResponse<CourseResponse> getAll(Pageable pageable);

    PagedResponse<CourseResponse> getByDepartment(Long departmentId, Pageable pageable);

    PagedResponse<CourseResponse> getBySemester(Integer semester, Pageable pageable);

    CourseResponse getById(Long id);

    CourseResponse create(CourseRequest request);

    CourseResponse update(Long id, CourseRequest request);

    void delete(Long id);
}
