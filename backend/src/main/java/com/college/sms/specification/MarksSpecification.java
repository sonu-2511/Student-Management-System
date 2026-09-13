package com.college.sms.specification;

import com.college.sms.entity.Marks;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public final class MarksSpecification {

    private MarksSpecification() {
    }

    public static Specification<Marks> withFilters(Long departmentId, Long courseId, Integer semester) {
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

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
