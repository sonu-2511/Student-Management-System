package com.college.sms.service;

import com.college.sms.dto.response.AuditLogResponse;
import com.college.sms.dto.response.PagedResponse;
import org.springframework.data.domain.Pageable;

public interface AuditLogService {

    void record(String username, String action, String resource, Long resourceId, String details);

    PagedResponse<AuditLogResponse> getAll(Pageable pageable);
}