package com.college.sms.repository;

import com.college.sms.entity.Marks;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface MarksRepository extends JpaRepository<Marks, Long>, JpaSpecificationExecutor<Marks> {

    boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);

    boolean existsByStudentIdAndCourseIdAndIdNot(Long studentId, Long courseId, Long id);

    Page<Marks> findByStudentId(Long studentId, Pageable pageable);

    Page<Marks> findByCourseId(Long courseId, Pageable pageable);

    @Query("select m.grade as grade, count(m) as total from Marks m group by m.grade")
    List<Object[]> countGradesOverall();

    @Query("select m.grade as grade, count(m) as total from Marks m where m.course.id = :courseId group by m.grade")
    List<Object[]> countGradesByCourse(@Param("courseId") Long courseId);

    @Query("select avg(m.totalMarks) from Marks m")
    BigDecimal averageTotalMarks();
}
