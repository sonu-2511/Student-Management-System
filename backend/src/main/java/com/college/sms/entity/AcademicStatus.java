package com.college.sms.entity;

/**
 * Shared lifecycle status, reused by both {@code Student} and {@code Teacher}
 * to match the single {@code status_enum} Postgres type defined in schema.sql.
 */
public enum AcademicStatus {
    ACTIVE,
    INACTIVE,
    GRADUATED,
    SUSPENDED
}
