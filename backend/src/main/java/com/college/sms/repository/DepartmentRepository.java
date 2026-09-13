package com.college.sms.repository;

import com.college.sms.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DepartmentRepository extends JpaRepository<Department, Long> {

    boolean existsByDepartmentCodeIgnoreCase(String departmentCode);

    boolean existsByDepartmentCodeIgnoreCaseAndIdNot(String departmentCode, Long id);

    Optional<Department> findByDepartmentCodeIgnoreCase(String departmentCode);
}
