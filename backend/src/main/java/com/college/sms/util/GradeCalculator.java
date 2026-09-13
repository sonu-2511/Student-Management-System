package com.college.sms.util;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Computes total marks and a letter grade from the four mark components.
 *
 * Assumption (documented so it's easy to tune for a real institution's rules):
 * each component (internal, assignment, practical, exam) is entered on its own
 * 0-100 scale, so the combined maximum is 400. The percentage of that maximum
 * drives the grade boundaries below. If your institution weights components
 * differently (e.g. exam = 50%, internal = 20%...), adjust {@link #computeTotal}
 * to a weighted sum and change MAX_TOTAL accordingly — everything else keeps working.
 */
public final class GradeCalculator {

    private static final BigDecimal MAX_TOTAL = BigDecimal.valueOf(400);

    private GradeCalculator() {
    }

    public static BigDecimal computeTotal(BigDecimal internalMarks, BigDecimal assignmentMarks,
                                           BigDecimal practicalMarks, BigDecimal examMarks) {
        return safe(internalMarks)
                .add(safe(assignmentMarks))
                .add(safe(practicalMarks))
                .add(safe(examMarks));
    }

    public static String computeGrade(BigDecimal totalMarks) {
        BigDecimal percentage = totalMarks
                .multiply(BigDecimal.valueOf(100))
                .divide(MAX_TOTAL, 2, RoundingMode.HALF_UP);

        if (percentage.compareTo(BigDecimal.valueOf(90)) >= 0) return "O";
        if (percentage.compareTo(BigDecimal.valueOf(80)) >= 0) return "A+";
        if (percentage.compareTo(BigDecimal.valueOf(70)) >= 0) return "A";
        if (percentage.compareTo(BigDecimal.valueOf(60)) >= 0) return "B+";
        if (percentage.compareTo(BigDecimal.valueOf(50)) >= 0) return "B";
        if (percentage.compareTo(BigDecimal.valueOf(40)) >= 0) return "C";
        return "F";
    }

    private static BigDecimal safe(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }
}
