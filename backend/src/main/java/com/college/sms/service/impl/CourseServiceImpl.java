package com.college.sms.service.impl;

import com.college.sms.dto.request.CourseRequest;
import com.college.sms.dto.response.CourseResponse;
import com.college.sms.dto.response.PagedResponse;
import com.college.sms.entity.Course;
import com.college.sms.entity.Department;
import com.college.sms.exception.DuplicateResourceException;
import com.college.sms.exception.ResourceNotFoundException;
import com.college.sms.mapper.CourseMapper;
import com.college.sms.repository.CourseRepository;
import com.college.sms.repository.DepartmentRepository;
import com.college.sms.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final DepartmentRepository departmentRepository;
    private final CourseMapper courseMapper;

    @Override
    public PagedResponse<CourseResponse> getAll(Pageable pageable) {
        return toPagedResponse(courseRepository.findAll(pageable));
    }

    @Override
    public PagedResponse<CourseResponse> getByDepartment(Long departmentId, Pageable pageable) {
        if (!departmentRepository.existsById(departmentId)) {
            throw ResourceNotFoundException.of("Department", departmentId);
        }
        return toPagedResponse(courseRepository.findByDepartmentId(departmentId, pageable));
    }

    @Override
    public PagedResponse<CourseResponse> getBySemester(Integer semester, Pageable pageable) {
        return toPagedResponse(courseRepository.findBySemester(semester, pageable));
    }

    @Override
    public CourseResponse getById(Long id) {
        return courseMapper.toResponse(findEntityOrThrow(id));
    }

    @Override
    @Transactional
    public CourseResponse create(CourseRequest request) {
        if (courseRepository.existsByCourseCodeIgnoreCase(request.getCourseCode())) {
            throw new DuplicateResourceException("Course code already exists: " + request.getCourseCode());
        }
        Department department = findDepartmentOrThrow(request.getDepartmentId());

        Course course = courseMapper.toEntity(
                request.getCourseCode(), request.getCourseName(),
                request.getCredits(), request.getSemester(), department);

        return courseMapper.toResponse(courseRepository.save(course));
    }

    @Override
    @Transactional
    public CourseResponse update(Long id, CourseRequest request) {
        Course existing = findEntityOrThrow(id);

        if (courseRepository.existsByCourseCodeIgnoreCaseAndIdNot(request.getCourseCode(), id)) {
            throw new DuplicateResourceException("Course code already exists: " + request.getCourseCode());
        }

        Department department = findDepartmentOrThrow(request.getDepartmentId());

        existing.setCourseCode(request.getCourseCode());
        existing.setCourseName(request.getCourseName());
        existing.setCredits(request.getCredits());
        existing.setSemester(request.getSemester());
        existing.setDepartment(department);

        return courseMapper.toResponse(courseRepository.save(existing));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Course existing = findEntityOrThrow(id);
        courseRepository.delete(existing);
    }

    private PagedResponse<CourseResponse> toPagedResponse(Page<Course> page) {
        return PagedResponse.from(page.map(courseMapper::toResponse));
    }

    private Course findEntityOrThrow(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Course", id));
    }

    private Department findDepartmentOrThrow(Long departmentId) {
        return departmentRepository.findById(departmentId)
                .orElseThrow(() -> ResourceNotFoundException.of("Department", departmentId));
    }
}
