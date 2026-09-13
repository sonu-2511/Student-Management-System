package com.college.sms.service.impl;

import com.college.sms.dto.request.TeacherRequest;
import com.college.sms.dto.request.TeacherProfileRequest;
import com.college.sms.dto.response.PagedResponse;
import com.college.sms.dto.response.TeacherResponse;
import com.college.sms.entity.Course;
import com.college.sms.entity.Department;
import com.college.sms.entity.Teacher;
import com.college.sms.exception.DuplicateResourceException;
import com.college.sms.exception.ResourceNotFoundException;
import com.college.sms.mapper.TeacherMapper;
import com.college.sms.repository.CourseRepository;
import com.college.sms.repository.DepartmentRepository;
import com.college.sms.repository.TeacherRepository;
import com.college.sms.repository.UserRepository;
import com.college.sms.entity.User;
import com.college.sms.service.TeacherService;
import com.college.sms.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TeacherServiceImpl implements TeacherService {

    private final TeacherRepository teacherRepository;
    private final DepartmentRepository departmentRepository;
    private final CourseRepository courseRepository;
    private final TeacherMapper teacherMapper;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;

    @Override
    public PagedResponse<TeacherResponse> getAll(Pageable pageable) {
        return toPagedResponse(teacherRepository.findAll(pageable));
    }

    @Override
    public PagedResponse<TeacherResponse> getByDepartment(Long departmentId, Pageable pageable) {
        if (!departmentRepository.existsById(departmentId)) {
            throw ResourceNotFoundException.of("Department", departmentId);
        }
        return toPagedResponse(teacherRepository.findByDepartmentId(departmentId, pageable));
    }

    @Override
    public TeacherResponse getById(Long id) {
        return teacherMapper.toResponse(findEntityOrThrow(id));
    }

    @Override
    public TeacherResponse getMyProfile(String username) {
        return teacherMapper.toResponse(findLinkedTeacher(username));
    }

    @Override
    @Transactional
    public TeacherResponse updateMyProfile(String username, TeacherProfileRequest request) {
        User user = findUser(username);
        Teacher existing = findLinkedTeacher(user);

        if (!existing.getEmail().equalsIgnoreCase(request.getEmail())
                && teacherRepository.existsByEmailIgnoreCaseAndIdNot(request.getEmail(), existing.getId())) {
            throw new DuplicateResourceException("Email already registered: " + request.getEmail());
        }
        if (!user.getEmail().equalsIgnoreCase(request.getEmail())
                && userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered: " + request.getEmail());
        }

        existing.setEmail(request.getEmail());
        existing.setPhone(request.getPhone());
        user.setEmail(request.getEmail());
        userRepository.save(user);
        Teacher saved = teacherRepository.save(existing);
        auditLogService.record(username, "UPDATE", "TEACHER_PROFILE", saved.getId(),
            "Faculty member updated contact profile");
        return teacherMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public TeacherResponse create(TeacherRequest request) {
        if (teacherRepository.existsByEmployeeIdIgnoreCase(request.getEmployeeId())) {
            throw new DuplicateResourceException("Employee ID already exists: " + request.getEmployeeId());
        }
        if (teacherRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered: " + request.getEmail());
        }
        if (request.getUsername() == null || request.getUsername().isBlank()
                || request.getPassword() == null || request.getPassword().isBlank()) {
            throw new IllegalArgumentException("Username and password are required when creating a faculty account");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("Username already exists: " + request.getUsername());
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered: " + request.getEmail());
        }

        Department department = resolveDepartment(request.getDepartmentId());
        Set<Course> courses = resolveCourses(request.getCourseIds());

        Teacher teacher = teacherMapper.toEntity(
                request.getEmployeeId(), request.getFirstName(), request.getLastName(),
                request.getEmail(), request.getPhone(), department, request.getDesignation(),
                request.getJoiningDate(), request.getStatus(), courses);

        Teacher savedTeacher = teacherRepository.save(teacher);
        userRepository.save(User.builder()
            .username(request.getUsername())
            .email(savedTeacher.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(com.college.sms.entity.Role.TEACHER)
            .enabled(true)
            .teacherId(savedTeacher.getId())
            .build());

        return teacherMapper.toResponse(savedTeacher);
    }

    @Override
    @Transactional
    public TeacherResponse update(Long id, TeacherRequest request) {
        Teacher existing = findEntityOrThrow(id);

        if (teacherRepository.existsByEmployeeIdIgnoreCaseAndIdNot(request.getEmployeeId(), id)) {
            throw new DuplicateResourceException("Employee ID already exists: " + request.getEmployeeId());
        }
        if (teacherRepository.existsByEmailIgnoreCaseAndIdNot(request.getEmail(), id)) {
            throw new DuplicateResourceException("Email already registered: " + request.getEmail());
        }

        Department department = resolveDepartment(request.getDepartmentId());
        Set<Course> courses = resolveCourses(request.getCourseIds());

        existing.setEmployeeId(request.getEmployeeId());
        existing.setFirstName(request.getFirstName());
        existing.setLastName(request.getLastName());
        existing.setEmail(request.getEmail());
        existing.setPhone(request.getPhone());
        existing.setDepartment(department);
        existing.setDesignation(request.getDesignation());
        existing.setJoiningDate(request.getJoiningDate());
        existing.setStatus(request.getStatus());
        existing.setCourses(courses);

        return teacherMapper.toResponse(teacherRepository.save(existing));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Teacher existing = findEntityOrThrow(id);
        teacherRepository.delete(existing);
    }

    private PagedResponse<TeacherResponse> toPagedResponse(Page<Teacher> page) {
        return PagedResponse.from(page.map(teacherMapper::toResponse));
    }

    private Teacher findEntityOrThrow(Long id) {
        return teacherRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Teacher", id));
    }

    private User findUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Login account not found"));
    }

    private Teacher findLinkedTeacher(String username) {
        return findLinkedTeacher(findUser(username));
    }

    private Teacher findLinkedTeacher(User user) {
        if (user.getTeacherId() == null) {
            throw new ResourceNotFoundException("Your login is not linked to a faculty profile");
        }
        return findEntityOrThrow(user.getTeacherId());
    }

    private Department resolveDepartment(Long departmentId) {
        if (departmentId == null) {
            return null;
        }
        return departmentRepository.findById(departmentId)
                .orElseThrow(() -> ResourceNotFoundException.of("Department", departmentId));
    }

    private Set<Course> resolveCourses(Set<Long> courseIds) {
        if (courseIds == null || courseIds.isEmpty()) {
            return new HashSet<>();
        }
        Set<Course> courses = new HashSet<>(courseRepository.findAllById(courseIds));
        if (courses.size() != courseIds.size()) {
            throw new ResourceNotFoundException("One or more course ids were not found: " + courseIds);
        }
        return courses;
    }
}
