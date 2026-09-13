package com.college.sms.specification;

import com.college.sms.entity.Attendance;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public final class AttendanceSpecification {

    private AttendanceSpecification() {
    }

    public static Specification<Attendance> withFilters(Long departmentId, Long courseId,
                                                          Integer semester, LocalDate fromDate, LocalDate toDate) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (departmentId != null) {
                predicates.add(cb.equal(root.get("course").get("department").get("id"), departmentId));
            }
            if (courseId != null) {
                predicates.add(cb.equal(root.get("course").get("id"), courseId));
            }
            if (semester != null) {
                predicates.add(cb.equal(root.get("student").get("semester"), semester));
            }
            if (fromDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("date"), fromDate));
            }
            if (toDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("date"), toDate));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
