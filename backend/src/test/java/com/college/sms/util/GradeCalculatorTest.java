package com.college.sms.util;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

class GradeCalculatorTest {

    @Test
    void computesTotalFromFourComponents() {
        assertThat(GradeCalculator.computeTotal(
                BigDecimal.valueOf(75), BigDecimal.valueOf(75),
                BigDecimal.valueOf(75), BigDecimal.valueOf(75)))
                .isEqualByComparingTo("300");
    }

    @Test
    void treatsNullComponentsAsZero() {
        assertThat(GradeCalculator.computeTotal(null, BigDecimal.TEN, null, BigDecimal.TEN))
                .isEqualByComparingTo("20");
    }

    @Test
    void appliesGradeBoundaries() {
        assertThat(GradeCalculator.computeGrade(BigDecimal.valueOf(360))).isEqualTo("O");
        assertThat(GradeCalculator.computeGrade(BigDecimal.valueOf(320))).isEqualTo("A+");
        assertThat(GradeCalculator.computeGrade(BigDecimal.valueOf(280))).isEqualTo("A");
        assertThat(GradeCalculator.computeGrade(BigDecimal.valueOf(160))).isEqualTo("C");
        assertThat(GradeCalculator.computeGrade(BigDecimal.valueOf(159))).isEqualTo("F");
    }
}