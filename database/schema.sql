-- =====================================================================
-- Student Management System - PostgreSQL Schema
-- =====================================================================

CREATE TYPE role_enum        AS ENUM ('ADMIN', 'TEACHER', 'STUDENT');
CREATE TYPE gender_enum      AS ENUM ('MALE', 'FEMALE', 'OTHER');
CREATE TYPE status_enum      AS ENUM ('ACTIVE', 'INACTIVE', 'GRADUATED', 'SUSPENDED');
CREATE TYPE attendance_enum  AS ENUM ('PRESENT', 'ABSENT', 'LEAVE');

-- ---------------------------------------------------------------------
-- DEPARTMENT
-- ---------------------------------------------------------------------
CREATE TABLE departments (
    id               BIGSERIAL PRIMARY KEY,
    department_code  VARCHAR(20)  NOT NULL UNIQUE,
    department_name  VARCHAR(150) NOT NULL,
    description      VARCHAR(500),
    created_at       TIMESTAMP NOT NULL DEFAULT now(),
    updated_at       TIMESTAMP NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- COURSE
-- ---------------------------------------------------------------------
CREATE TABLE courses (
    id             BIGSERIAL PRIMARY KEY,
    course_code    VARCHAR(20)  NOT NULL UNIQUE,
    course_name    VARCHAR(150) NOT NULL,
    credits        INTEGER NOT NULL CHECK (credits BETWEEN 1 AND 10),
    semester       INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 12),
    department_id  BIGINT NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    created_at     TIMESTAMP NOT NULL DEFAULT now(),
    updated_at     TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX idx_courses_department ON courses(department_id);

-- ---------------------------------------------------------------------
-- TEACHER
-- ---------------------------------------------------------------------
CREATE TABLE teachers (
    id             BIGSERIAL PRIMARY KEY,
    employee_id    VARCHAR(30)  NOT NULL UNIQUE,
    first_name     VARCHAR(100) NOT NULL,
    last_name      VARCHAR(100) NOT NULL,
    email          VARCHAR(150) NOT NULL UNIQUE,
    phone          VARCHAR(20)  NOT NULL,
    department_id  BIGINT REFERENCES departments(id) ON DELETE SET NULL,
    designation    VARCHAR(100),
    joining_date   DATE NOT NULL,
    status         status_enum NOT NULL DEFAULT 'ACTIVE',
    created_at     TIMESTAMP NOT NULL DEFAULT now(),
    updated_at     TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX idx_teachers_department ON teachers(department_id);

-- Many-to-many: which teachers teach which courses
CREATE TABLE course_teachers (
    course_id  BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    teacher_id BIGINT NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    PRIMARY KEY (course_id, teacher_id)
);

-- ---------------------------------------------------------------------
-- STUDENT
-- ---------------------------------------------------------------------
CREATE TABLE students (
    id               BIGSERIAL PRIMARY KEY,
    roll_number      VARCHAR(30)  NOT NULL UNIQUE,
    first_name       VARCHAR(100) NOT NULL,
    last_name        VARCHAR(100) NOT NULL,
    email            VARCHAR(150) NOT NULL UNIQUE,
    phone            VARCHAR(20)  NOT NULL,
    date_of_birth    DATE NOT NULL,
    gender           gender_enum NOT NULL,
    address          VARCHAR(255),
    city             VARCHAR(100),
    state            VARCHAR(100),
    pincode          VARCHAR(20),
    admission_date   DATE NOT NULL,
    department_id    BIGINT REFERENCES departments(id) ON DELETE SET NULL,
    course_id        BIGINT REFERENCES courses(id) ON DELETE SET NULL,
    semester         INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 12),
    status           status_enum NOT NULL DEFAULT 'ACTIVE',
    profile_image    VARCHAR(500),
    created_at       TIMESTAMP NOT NULL DEFAULT now(),
    updated_at       TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX idx_students_department ON students(department_id);
CREATE INDEX idx_students_course ON students(course_id);
CREATE INDEX idx_students_status ON students(status);

-- ---------------------------------------------------------------------
-- ATTENDANCE
-- ---------------------------------------------------------------------
CREATE TABLE attendance (
    id          BIGSERIAL PRIMARY KEY,
    student_id  BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id   BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    date        DATE NOT NULL,
    status      attendance_enum NOT NULL,
    remarks     VARCHAR(255),
    created_at  TIMESTAMP NOT NULL DEFAULT now(),
    updated_at  TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT uq_attendance_student_course_date UNIQUE (student_id, course_id, date)
);
CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_attendance_course ON attendance(course_id);
CREATE INDEX idx_attendance_date ON attendance(date);

-- ---------------------------------------------------------------------
-- MARKS
-- ---------------------------------------------------------------------
CREATE TABLE marks (
    id                BIGSERIAL PRIMARY KEY,
    student_id        BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id         BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    internal_marks    NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (internal_marks BETWEEN 0 AND 100),
    assignment_marks  NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (assignment_marks BETWEEN 0 AND 100),
    practical_marks   NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (practical_marks BETWEEN 0 AND 100),
    exam_marks        NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (exam_marks BETWEEN 0 AND 100),
    total_marks       NUMERIC(6,2) NOT NULL DEFAULT 0,
    grade             VARCHAR(5),
    remarks           VARCHAR(255),
    created_at        TIMESTAMP NOT NULL DEFAULT now(),
    updated_at        TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT uq_marks_student_course UNIQUE (student_id, course_id)
);
CREATE INDEX idx_marks_student ON marks(student_id);
CREATE INDEX idx_marks_course ON marks(course_id);

-- ---------------------------------------------------------------------
-- USERS (auth identity, separate from domain profile)
-- ---------------------------------------------------------------------
CREATE TABLE users (
    id          BIGSERIAL PRIMARY KEY,
    username    VARCHAR(50)  NOT NULL UNIQUE,
    email       VARCHAR(150) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,           -- BCrypt hash
    role        role_enum NOT NULL,
    enabled     BOOLEAN NOT NULL DEFAULT TRUE,
    student_id  BIGINT UNIQUE REFERENCES students(id) ON DELETE SET NULL,
    teacher_id  BIGINT UNIQUE REFERENCES teachers(id) ON DELETE SET NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX idx_users_role ON users(role);
