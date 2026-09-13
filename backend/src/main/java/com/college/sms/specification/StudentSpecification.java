package com.college.sms.specification;

import com.college.sms.entity.AcademicStatus;
import com.college.sms.entity.Student;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

/**
 * Builds a combined, dynamic Specification for the GET /api/students listing endpoint,
 * so keyword search and each filter can be applied independently or together.
 */
public final class StudentSpecification {

    private StudentSpecification() {
    }

    public static Specification<Student> withFilters(String keyword,
                                                       Long departmentId,
                                                       Long courseId,
                                                       Integer semester,
                                                       AcademicStatus status) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (keyword != null && !keyword.isBlank()) {
                String likePattern = "%" + keyword.toLowerCase() + "%";
                Predicate keywordPredicate = cb.or(
                        cb.like(cb.lower(root.get("firstName")), likePattern),
                        cb.like(cb.lower(root.get("lastName")), likePattern),
                        cb.like(cb.lower(root.get("email")), likePattern),
                        cb.like(cb.lower(root.get("rollNumber")), likePattern),
                        cb.like(cb.lower(root.get("phone")), likePattern)
                );
                predicates.add(keywordPredicate);
            }

            if (departmentId != null) {
                predicates.add(cb.equal(root.get("department").get("id"), departmentId));
            }

            if (courseId != null) {
                predicates.add(cb.equal(root.get("course").get("id"), courseId));
            }

            if (semester != null) {
                predicates.add(cb.equal(root.get("semester"), semester));
            }

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
