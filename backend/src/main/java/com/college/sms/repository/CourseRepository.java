package com.college.sms.repository;

import com.college.sms.entity.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {

    boolean existsByCourseCodeIgnoreCase(String courseCode);

    boolean existsByCourseCodeIgnoreCaseAndIdNot(String courseCode, Long id);

    Page<Course> findByDepartmentId(Long departmentId, Pageable pageable);

    Page<Course> findBySemester(Integer semester, Pageable pageable);
}
