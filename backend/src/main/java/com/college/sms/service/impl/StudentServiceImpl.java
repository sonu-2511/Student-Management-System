package com.college.sms.service.impl;

import com.college.sms.dto.request.StudentRequest;
import com.college.sms.dto.request.StudentProfileRequest;
import com.college.sms.dto.response.PagedResponse;
import com.college.sms.dto.response.StudentCreationResponse;
import com.college.sms.dto.response.StudentResponse;
import com.college.sms.entity.AcademicStatus;
import com.college.sms.entity.Course;
import com.college.sms.entity.Department;
import com.college.sms.entity.Role;
import com.college.sms.entity.Student;
import com.college.sms.entity.User;
import com.college.sms.exception.DuplicateResourceException;
import com.college.sms.exception.ResourceNotFoundException;
import com.college.sms.mapper.StudentMapper;
import com.college.sms.repository.CourseRepository;
import com.college.sms.repository.DepartmentRepository;
import com.college.sms.repository.StudentRepository;
import com.college.sms.repository.UserRepository;
import com.college.sms.service.StudentService;
import com.college.sms.service.AuditLogService;
import com.college.sms.specification.StudentSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final DepartmentRepository departmentRepository;
    private final CourseRepository courseRepository;
    private final StudentMapper studentMapper;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;

    @Override
    public PagedResponse<StudentResponse> getAll(Pageable pageable, Long departmentId, Long courseId,
                                                  Integer semester, AcademicStatus status) {
        Page<Student> page = studentRepository.findAll(
                StudentSpecification.withFilters(null, departmentId, courseId, semester, status),
                pageable);
        return toPagedResponse(page);
    }

    @Override
    public PagedResponse<StudentResponse> search(String keyword, Pageable pageable) {
        Page<Student> page = studentRepository.findAll(
                StudentSpecification.withFilters(keyword, null, null, null, null),
                pageable);
        return toPagedResponse(page);
    }

    @Override
    public PagedResponse<StudentResponse> getByDepartment(Long departmentId, Pageable pageable) {
        if (!departmentRepository.existsById(departmentId)) {
            throw ResourceNotFoundException.of("Department", departmentId);
        }
        return toPagedResponse(studentRepository.findByDepartmentId(departmentId, pageable));
    }

    @Override
    public StudentResponse getById(Long id) {
        return studentMapper.toResponse(findEntityOrThrow(id));
    }

    @Override
    public StudentResponse getMyProfile(String username) {
        return studentMapper.toResponse(findLinkedStudent(username));
    }

    @Override
    @Transactional
    public StudentResponse updateMyProfile(String username, StudentProfileRequest request) {
        User user = findUser(username);
        Student existing = findLinkedStudent(user);

        if (!existing.getEmail().equalsIgnoreCase(request.getEmail())
                && studentRepository.existsByEmailIgnoreCaseAndIdNot(request.getEmail(), existing.getId())) {
            throw new DuplicateResourceException("Email already registered: " + request.getEmail());
        }
        if (!user.getEmail().equalsIgnoreCase(request.getEmail())
                && userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered: " + request.getEmail());
        }

        existing.setEmail(request.getEmail());
        existing.setPhone(request.getPhone());
        existing.setAddress(request.getAddress());
        existing.setCity(request.getCity());
        existing.setState(request.getState());
        existing.setPincode(request.getPincode());
        existing.setProfileImage(request.getProfileImage());
        user.setEmail(request.getEmail());
        userRepository.save(user);
        Student saved = studentRepository.save(existing);
        auditLogService.record(username, "UPDATE", "STUDENT_PROFILE", saved.getId(),
            "Student updated contact profile");
        return studentMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public StudentCreationResponse create(StudentRequest request) {
        if (studentRepository.existsByRollNumberIgnoreCase(request.getRollNumber())) {
            throw new DuplicateResourceException("Roll number already exists: " + request.getRollNumber());
        }
        if (studentRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered: " + request.getEmail());
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("Username already exists: " + request.getUsername());
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered: " + request.getEmail());
        }

        Department department = resolveDepartment(request.getDepartmentId());
        Course course = resolveCourse(request.getCourseId());

        Student student = studentMapper.toEntity(request, department, course);
        Student savedStudent = studentRepository.save(student);

        userRepository.save(User.builder()
            .username(request.getUsername())
            .email(savedStudent.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(Role.STUDENT)
            .enabled(true)
            .studentId(savedStudent.getId())
            .build());

        return StudentCreationResponse.builder()
            .student(studentMapper.toResponse(savedStudent))
            .username(request.getUsername())
            .build();
    }

    @Override
    @Transactional
    public StudentResponse update(Long id, StudentRequest request) {
        Student existing = findEntityOrThrow(id);

        if (studentRepository.existsByRollNumberIgnoreCaseAndIdNot(request.getRollNumber(), id)) {
            throw new DuplicateResourceException("Roll number already exists: " + request.getRollNumber());
        }
        if (studentRepository.existsByEmailIgnoreCaseAndIdNot(request.getEmail(), id)) {
            throw new DuplicateResourceException("Email already registered: " + request.getEmail());
        }

        Department department = resolveDepartment(request.getDepartmentId());
        Course course = resolveCourse(request.getCourseId());

        studentMapper.updateEntity(existing, request, department, course);
        return studentMapper.toResponse(studentRepository.save(existing));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Student existing = findEntityOrThrow(id);
        studentRepository.delete(existing);
    }

    private PagedResponse<StudentResponse> toPagedResponse(Page<Student> page) {
        return PagedResponse.from(page.map(studentMapper::toResponse));
    }

    private Student findEntityOrThrow(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Student", id));
    }

    private User findUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Login account not found"));
    }

    private Student findLinkedStudent(String username) {
        return findLinkedStudent(findUser(username));
    }

    private Student findLinkedStudent(User user) {
        if (user.getStudentId() == null) {
            throw new ResourceNotFoundException("Your login is not linked to a student profile");
        }
        return findEntityOrThrow(user.getStudentId());
    }

    private Department resolveDepartment(Long departmentId) {
        if (departmentId == null) {
            return null;
        }
        return departmentRepository.findById(departmentId)
                .orElseThrow(() -> ResourceNotFoundException.of("Department", departmentId));
    }

    private Course resolveCourse(Long courseId) {
        if (courseId == null) {
            return null;
        }
        return courseRepository.findById(courseId)
                .orElseThrow(() -> ResourceNotFoundException.of("Course", courseId));
    }

}
