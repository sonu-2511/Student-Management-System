package com.college.sms.repository;

import com.college.sms.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Long>, JpaSpecificationExecutor<Student> {

    boolean existsByRollNumberIgnoreCase(String rollNumber);

    boolean existsByRollNumberIgnoreCaseAndIdNot(String rollNumber, Long id);

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCaseAndIdNot(String email, Long id);

    Page<Student> findByDepartmentId(Long departmentId, Pageable pageable);

    @Query("select d.departmentName, count(s) from Student s join s.department d group by d.departmentName")
    List<Object[]> countByDepartment();

    @Query("select s.semester, count(s) from Student s group by s.semester order by s.semester")
    List<Object[]> countBySemester();
}
