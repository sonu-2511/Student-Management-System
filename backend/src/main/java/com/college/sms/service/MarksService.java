package com.college.sms.service;

import com.college.sms.dto.request.MarksRequest;
import com.college.sms.dto.response.MarksResponse;
import com.college.sms.dto.response.PagedResponse;
import org.springframework.data.domain.Pageable;

public interface MarksService {

    MarksResponse create(MarksRequest request, String username);

    MarksResponse update(Long id, MarksRequest request, String username);

    PagedResponse<MarksResponse> getByStudent(Long studentId, Pageable pageable);

    PagedResponse<MarksResponse> getByCourse(Long courseId, Pageable pageable, String username);
}
