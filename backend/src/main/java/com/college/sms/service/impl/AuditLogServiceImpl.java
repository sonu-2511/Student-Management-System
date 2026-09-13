package com.college.sms.service.impl;

import com.college.sms.dto.response.AuditLogResponse;
import com.college.sms.dto.response.PagedResponse;
import com.college.sms.entity.AuditLog;
import com.college.sms.repository.AuditLogRepository;
import com.college.sms.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Override
    @Transactional
    public void record(String username, String action, String resource, Long resourceId, String details) {
        auditLogRepository.save(AuditLog.builder()
                .username(username)
                .action(action)
                .resource(resource)
                .resourceId(resourceId)
                .details(details)
                .build());
    }

    @Override
    public PagedResponse<AuditLogResponse> getAll(Pageable pageable) {
        Page<AuditLogResponse> page = auditLogRepository.findAll(pageable).map(log -> AuditLogResponse.builder()
                .id(log.getId())
                .username(log.getUsername())
                .action(log.getAction())
                .resource(log.getResource())
                .resourceId(log.getResourceId())
                .details(log.getDetails())
                .createdAt(log.getCreatedAt())
                .build());
        return PagedResponse.from(page);
    }
}