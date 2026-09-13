package com.college.sms.service.impl;

import com.college.sms.dto.request.DepartmentRequest;
import com.college.sms.dto.response.DepartmentResponse;
import com.college.sms.entity.Department;
import com.college.sms.exception.DuplicateResourceException;
import com.college.sms.exception.ResourceNotFoundException;
import com.college.sms.mapper.DepartmentMapper;
import com.college.sms.repository.DepartmentRepository;
import com.college.sms.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final DepartmentMapper departmentMapper;

    @Override
    public List<DepartmentResponse> getAll() {
        return departmentRepository.findAll().stream()
                .map(departmentMapper::toResponse)
                .toList();
    }

    @Override
    public DepartmentResponse getById(Long id) {
        return departmentMapper.toResponse(findEntityOrThrow(id));
    }

    @Override
    @Transactional
    public DepartmentResponse create(DepartmentRequest request) {
        if (departmentRepository.existsByDepartmentCodeIgnoreCase(request.getDepartmentCode())) {
            throw new DuplicateResourceException(
                    "Department code already exists: " + request.getDepartmentCode());
        }
        Department saved = departmentRepository.save(departmentMapper.toEntity(request));
        return departmentMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public DepartmentResponse update(Long id, DepartmentRequest request) {
        Department existing = findEntityOrThrow(id);

        if (departmentRepository.existsByDepartmentCodeIgnoreCaseAndIdNot(request.getDepartmentCode(), id)) {
            throw new DuplicateResourceException(
                    "Department code already exists: " + request.getDepartmentCode());
        }

        departmentMapper.updateEntity(existing, request);
        return departmentMapper.toResponse(departmentRepository.save(existing));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Department existing = findEntityOrThrow(id);
        departmentRepository.delete(existing);
    }

    private Department findEntityOrThrow(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Department", id));
    }
}
