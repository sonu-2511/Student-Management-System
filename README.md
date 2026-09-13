# Student Management System — Backend (Phases 1-2)

## What's implemented so far
- Project skeleton (Maven, layered package structure)
- PostgreSQL schema (`database/schema.sql`)
- Local PostgreSQL schema (`database/schema.sql`)
- JWT authentication (login/register)
- Spring Security with role-based URL rules (ADMIN/TEACHER/STUDENT)
- Global exception handling with a consistent error JSON shape
- Swagger/OpenAPI wired with a Bearer auth scheme

## Prerequisites
- Java 17 (JDK)
- Maven 3.9+
- PostgreSQL 16

## Run PostgreSQL
```bash
psql -U postgres -c "CREATE USER sms_user WITH PASSWORD 'sms_password';"
psql -U postgres -c "CREATE DATABASE sms_db OWNER sms_user;"
psql -U sms_user -d sms_db -f database/schema.sql
```
If the user or database already exists, skip the corresponding create command.

## Configure environment
```bash
cd backend
cp .env.example .env
# edit .env if your DB credentials differ
```
Export the vars (or use a tool like `direnv`/your IDE's run config):
```bash
export $(grep -v '^#' .env | xargs)
```

## Run the backend
```bash
cd backend
mvn spring-boot:run
```
API available at: `http://localhost:8080`
Swagger UI: `http://localhost:8080/swagger-ui.html`

## Test the Auth API

**Register an admin:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin1",
    "email": "admin1@college.edu",
    "password": "AdminPass123",
    "role": "ADMIN"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin1",
    "password": "AdminPass123"
  }'
```
Response:
```json
{
  "token": "eyJhbGciOi...",
  "tokenType": "Bearer",
  "username": "admin1",
  "role": "ADMIN",
  "expiresInMs": 86400000
}
```

**Call a protected endpoint (once it exists in Phase 3+):**
```bash
curl http://localhost:8080/api/departments \
  -H "Authorization: Bearer <token>"
```

## Note on offline verification
I built and reviewed every file for correctness (imports, annotations, jjwt 0.12.x API usage) but could not run `mvn compile` in this sandbox — Maven Central isn't in the sandbox's allowed network domains. Please run `mvn clean compile` on your machine as the first step; if anything doesn't compile, paste the error back and I'll fix it before we continue to Phase 3.

## Next: Phase 3
Department + Course modules (entities, repositories, services, controllers, DTOs, validation).

## Phase 3 added
- `Department` and `Course` entities (Course → Department, LAZY, no back-collection to avoid serialization loops)
- Full CRUD for both, with unique-code validation (`departmentCode`, `courseCode`) on create/update
- Course listing supports pagination (`?page=&size=&sort=`) plus optional `?departmentId=` or `?semester=` filters
- DTOs never expose the JPA entity directly; `CourseResponse` nests a lightweight `DepartmentSummary`, not the full department

### Test it
```bash
# Get token from /api/auth/login first, then:
TOKEN="<paste JWT here>"

curl -X POST http://localhost:8080/api/departments \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"departmentCode":"CSE","departmentName":"Computer Science & Engineering","description":"CSE dept"}'

curl -X POST http://localhost:8080/api/courses \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"courseCode":"CS101","courseName":"Data Structures","credits":4,"semester":3,"departmentId":1}'

curl "http://localhost:8080/api/courses?page=0&size=10&departmentId=1" \
  -H "Authorization: Bearer $TOKEN"
```

## Next: Phase 4
Student CRUD (entity, DTOs, repository with search/filter/pagination, service, controller, validation).

## Phase 4 added
- `Student` entity (`Gender`, `AcademicStatus` enums; optional department/course links so a student can exist before being assigned)
- Full CRUD with roll-number and email uniqueness checks
- Dynamic search + filtering via a JPA `Specification` (`StudentSpecification`) — keyword search across name/email/roll number/phone, plus independent department/course/semester/status filters, all combinable
- Pagination + sorting on every list endpoint (`?page=&size=&sort=`)

### Test it
```bash
TOKEN="<paste JWT here>"

curl -X POST http://localhost:8080/api/students \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{
    "rollNumber":"CSE2024001","firstName":"Aditi","lastName":"Rao",
    "email":"aditi.rao@college.edu","phone":"+919876543210",
    "dateOfBirth":"2005-06-15","gender":"FEMALE",
    "address":"12 MG Road","city":"Chennai","state":"Tamil Nadu","pincode":"600001",
    "admissionDate":"2024-07-01","departmentId":1,"courseId":1,
    "semester":1,"status":"ACTIVE"
  }'

curl "http://localhost:8080/api/students?page=0&size=10&status=ACTIVE" \
  -H "Authorization: Bearer $TOKEN"

curl "http://localhost:8080/api/students/search?keyword=aditi" \
  -H "Authorization: Bearer $TOKEN"

curl "http://localhost:8080/api/students/department/1" \
  -H "Authorization: Bearer $TOKEN"
```

## Next: Phase 5
Teacher CRUD (entity, course-teacher assignment, DTOs, service, controller).

## Phase 5 added
- `Teacher` entity — owns the `course_teachers` join table (`@ManyToMany` to `Course`); `Course` has no inverse collection back to `Teacher`, keeping the relationship one-directional to avoid serialization loops
- Full CRUD with `employeeId` and `email` uniqueness checks
- `TeacherRequest.courseIds` lets you assign/reassign which courses a teacher teaches directly from create/update; unknown ids are rejected with a 404
- `/api/teachers/**` stays ADMIN-only end to end, per the role spec

### Test it
```bash
TOKEN="<paste JWT here>"

curl -X POST http://localhost:8080/api/teachers \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{
    "employeeId":"EMP1001","firstName":"Rahul","lastName":"Nair",
    "email":"rahul.nair@college.edu","phone":"+919812345678",
    "departmentId":1,"designation":"Assistant Professor",
    "joiningDate":"2022-06-01","status":"ACTIVE","courseIds":[1]
  }'

curl "http://localhost:8080/api/teachers?page=0&size=10" \
  -H "Authorization: Bearer $TOKEN"

curl "http://localhost:8080/api/teachers/department/1" \
  -H "Authorization: Bearer $TOKEN"
```

## Next: Phase 6
Attendance module (mark/update attendance per student per course per date, with unique-per-day constraint).

## Phase 6 added
- `Attendance` entity with a DB-level unique constraint on `(student_id, course_id, date)` — a student can't be marked twice for the same course on the same day; duplicate attempts return `409 Conflict`
- `POST /api/attendance` (ADMIN, TEACHER) — mark attendance
- `PUT /api/attendance/{id}` (ADMIN, TEACHER) — correct a record, re-checked against the same uniqueness rule
- `GET /api/attendance/student/{studentId}` and `GET /api/attendance/course/{courseId}` — paginated history, open to any authenticated role (so a STUDENT can view their own via the student endpoint once the frontend restricts it to "self" in Phase 9+)

### Test it
```bash
TOKEN="<paste JWT here>"

curl -X POST http://localhost:8080/api/attendance \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"studentId":1,"courseId":1,"date":"2026-09-01","status":"PRESENT"}'

# Same student/course/date again -> 409 Conflict
curl -X POST http://localhost:8080/api/attendance \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"studentId":1,"courseId":1,"date":"2026-09-01","status":"ABSENT"}'

curl "http://localhost:8080/api/attendance/student/1?page=0&size=20" \
  -H "Authorization: Bearer $TOKEN"
```

## Next: Phase 7
Marks + grade calculation (entity, grade computation util, service, controller).

## Phase 7 added
- `Marks` entity — one record per (student, course) pair, enforced by a unique constraint
- `GradeCalculator` util: `totalMarks` = sum of the 4 components (internal/assignment/practical/exam, each 0-100), grade derived from percentage of 400. **This weighting is a placeholder** — it's isolated in one small class specifically so you can swap in your institution's real formula (e.g. exam weighted 50%) without touching the service/controller layer.
- Total and grade are always computed server-side on create/update — the client only sends the four raw components, never the total or grade directly, so they can't be spoofed

### Test it
```bash
TOKEN="<paste JWT here>"

curl -X POST http://localhost:8080/api/marks \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{
    "studentId":1,"courseId":1,
    "internalMarks":18,"assignmentMarks":9,
    "practicalMarks":45,"examMarks":72
  }'
# -> totalMarks: 144.00, grade computed automatically (percentage of 400)

curl "http://localhost:8080/api/marks/student/1" \
  -H "Authorization: Bearer $TOKEN"
```

## Next: Phase 8
Dashboard + Reports (summary counts, students-by-department, attendance stats, grade distribution).

## Phase 8 added
- `GET /api/dashboard/summary` — total students/teachers/courses/departments, present-today count, overall attendance %, overall average marks
- `GET /api/reports/students-by-department`, `GET /api/reports/students-by-semester` — headcount breakdowns
- `GET /api/reports/attendance?departmentId=&courseId=&semester=&fromDate=&toDate=` — all filters optional and combinable
- `GET /api/reports/grade-distribution?departmentId=&courseId=&semester=` — same filter pattern
- Filtered reports reuse the same `Specification` pattern as Phase 4/6, fetched unpaginated and aggregated in Java — fine at college-scale data volumes; if this ever needs to scale to very large datasets, swap the aggregation for a native SQL `GROUP BY` query instead

### Test it
```bash
TOKEN="<paste JWT here>"

curl http://localhost:8080/api/dashboard/summary -H "Authorization: Bearer $TOKEN"
curl http://localhost:8080/api/reports/students-by-department -H "Authorization: Bearer $TOKEN"
curl "http://localhost:8080/api/reports/attendance?departmentId=1&fromDate=2026-08-01&toDate=2026-09-01" \
  -H "Authorization: Bearer $TOKEN"
curl "http://localhost:8080/api/reports/grade-distribution?courseId=1" -H "Authorization: Bearer $TOKEN"
```

## Backend complete — Next: Phase 9
React frontend scaffold (Vite, routing, layouts per role, auth context, Axios client with JWT interceptor).

## Phase 9 added — React frontend (full scaffold + working pages)

**Small backend change made in this phase:** `JwtResponse` and `AuthServiceImpl.login()` now also
return `studentId`/`teacherId` when the account is linked to one. Without this, the Student/Teacher
self-service pages ("My Profile", "My Attendance", etc.) would have no way to know which student/teacher
record belongs to the logged-in user. If you already pulled earlier zips, grab the updated
`JwtResponse.java` and `AuthServiceImpl.java` from this zip.

**Stack:** React 19, Vite, React Router 7, Axios, Bootstrap 5, Recharts (for dashboard/report charts).

**What's implemented:**
- Full Vite project (`package.json`, `vite.config.js` with a `/api` dev proxy to `localhost:8080`)
- Professional enterprise theme (`assets/theme.css`) — sidebar/topbar shell, gradient stat cards, styled tables — not default Bootstrap look
- `AuthContext` + `useAuth` — session-scoped JWT storage, decodes role/studentId/teacherId from login response
- `axiosClient` with a request interceptor (attaches `Authorization: Bearer <token>`) and a response interceptor (401 → clear session + redirect to `/login`)
- Full API service layer matching every backend endpoint from Phases 2-8
- Reusable components: `Navbar`, `Sidebar` (role-aware nav), `DashboardCard`, `DataTable`, `SearchBar`, `Pagination`, `Modal`, `ConfirmDialog`, `FormInput`, `LoadingSpinner`, `ErrorMessage`
- Layouts + `ProtectedRoute` (auth + role-based redirect) for Admin/Teacher/Student route groups
- **Admin pages:** Dashboard (charts), Student List (search/filter/pagination) + Add/Edit/Details (tabbed), Teacher List + Add/Edit, Department List, Course List, Attendance (course+date based marking), Marks (course-based entry with live grade preview), Reports (filterable), User Management (account creation)
- **Teacher pages:** Dashboard, My Students, Attendance, Marks, Courses
- **Student pages:** Dashboard, My Profile, My Courses, My Attendance, My Marks, My Grades

**Two things flagged directly in code comments, not hidden:**
1. `ForgotPassword.jsx` — UI-only; there's no `/api/auth/forgot-password` endpoint in the backend spec. Wire it up once that endpoint exists.
2. `MyStudents.jsx` (teacher) — since the JWT doesn't carry a "my assigned courses" list, teachers pick a course from the full list rather than an auto-filtered "my courses." A `GET /api/teachers/me` endpoint would let this auto-filter.
3. `UserManagement.jsx` — only account *creation* works; there's no `GET/PUT/DELETE /api/users` yet for a full list/edit/deactivate table.

### Run it
```bash
cd sms/frontend
cp .env.example .env
npm install
npm run dev
```
Open `http://localhost:5173`. Make sure the backend (Phase 1-8) is running on `:8080` first.

### Try it end-to-end
1. Register an admin via `POST /api/auth/register` (or build a tiny seed script) since there's no public sign-up UI by design
2. Log in at `/login` → lands on `/admin/dashboard`
3. Create a department → course → student → teacher
4. Go to Attendance, pick the course + today's date → mark a student present
5. Go to Marks, pick the course → enter marks for a student → see the grade compute live
6. Check Reports and the Dashboard charts update

## Next: Phase 10
Wire remaining gaps + connect React to Spring Boot end-to-end (CORS verification, error-state polish, loading-state polish across all forms).

## Phase 10 — verification pass (React ↔ Spring Boot)

Since the frontend in Phase 9 was built directly against the real endpoint contracts (not mocks), this phase was mostly a review rather than new feature code. Findings and the two small changes made:

**Changed:**
- `frontend/.env.example` now defaults `VITE_API_BASE_URL=/api` (relative) instead of a full `http://localhost:8080/api` URL. In dev, this routes through Vite's proxy (`vite.config.js` → `localhost:8080`), which means the browser sees everything as same-origin and **CORS never even comes into play during development.** For a production build, set `VITE_API_BASE_URL` to your deployed backend's full URL, and make sure `CORS_ALLOWED_ORIGINS` on the backend includes your deployed frontend's origin (comma-separated if more than one).
- Added a 15s `timeout` to `axiosClient` so a hung backend call fails visibly instead of spinning forever.

**Verified, no change needed:**
- `SecurityConfig`'s per-role URL rules line up with what the frontend actually calls (e.g. GET `/api/students/**` open to all three roles so Student/Teacher self-service pages work; mutating verbs stay ADMIN/TEACHER as appropriate)
- Every `ApiErrorResponse` (404/409/400/403/401) is caught by the frontend's `ErrorMessage` component, including field-level validation errors from `MethodArgumentNotValidException`
- Pagination contract matches exactly: backend `PagedResponse` (`content/page/size/totalElements/totalPages/last`) ↔ frontend `Pagination` component
- 401 handling: an expired/invalid JWT clears the session and redirects to `/login` automatically via the Axios response interceptor

## Next: Phase 11
Deepen validation, exception handling, and security — a systematic pass rather than new modules (most of this was already built incrementally in Phases 2-8, so this phase is a hardening review + any gaps it turns up).

## Phase 11 — hardening pass

**Method-level `@PreAuthorize` added as defense-in-depth**, on top of the existing URL-based `SecurityConfig` rules — every mutating endpoint (`POST`/`PUT`/`DELETE`) on Student, Teacher, Department, Course, Attendance, and Marks controllers now also carries `@PreAuthorize("hasRole('ADMIN')")` or `@PreAuthorize("hasAnyRole('ADMIN','TEACHER')")` directly on the method. This means the role check no longer depends solely on getting the URL pattern right in one central config class — even if a future controller method were added without updating `SecurityConfig`, the annotation alone would still block it. `@EnableMethodSecurity` was already present from Phase 2, so this was a matter of applying it consistently.

**Exception handling gaps closed** in `GlobalExceptionHandler`:
- `HttpMessageNotReadableException` — malformed/missing JSON body now returns a clean `400` instead of Spring's default whitelabel error
- `MethodArgumentTypeMismatchException` — an invalid query param (e.g. `?status=NOTAREALSTATUS`) now returns a clear `400` naming the bad parameter
- `DataIntegrityViolationException` — a DB-level unique/FK constraint violation (the genuine race-condition case where two requests slip past the app-level `existsBy...` check at the same instant) now returns `409` instead of `500`

**Password policy strengthened**: `RegisterRequest.password` now requires at least one letter and one digit in addition to the 8-character minimum, via a validation `@Pattern`.

**Reviewed, no change needed:** input validation coverage (every request DTO already had field-level Bean Validation from the phase it was introduced in), BCrypt password hashing, JWT signing/expiry, stateless session policy, and SQL injection surface (all queries go through JPA/Hibernate parameter binding — no string-concatenated SQL anywhere in the codebase).

## Next: Phase 12
Testing — JUnit 5 + Mockito unit tests for each service, plus controller tests where appropriate.

## Post-launch fix: secure first-admin setup

While debugging a login issue with the user, two things came up worth documenting clearly:

**Security fix — `/api/auth/register` was public.** Since Phase 2, `/api/auth/**` was entirely
whitelisted in `SecurityConfig`, which meant anyone could `POST /api/auth/register` with
`"role":"ADMIN"` and hand themselves administrator access — a real hole, not hypothetical.
Fixed: `register` now requires `@PreAuthorize("hasRole('ADMIN')")` and is only reachable by an
already-logged-in admin (which is how `UserManagement.jsx` was already calling it). Only `login`,
`setup-status`, and `bootstrap-admin` remain public in `SecurityConfig`.

**New: one-time bootstrap setup**, so the first admin account no longer requires a curl command:
- `GET /api/auth/setup-status` — public, returns `{ needsSetup: true|false }` based on whether any user row exists yet
- `POST /api/auth/bootstrap-admin` — public, but `AuthServiceImpl.bootstrapAdmin()` re-checks `needsBootstrap()` under a `synchronized` block right before saving, so it always creates exactly one admin and then locks itself forever (subsequent calls throw `403`, mapped through `UnauthorizedException`)
- Frontend: new public `/setup` page (`Setup.jsx`) — checks status on load; shows the create-admin form only if needed, otherwise redirects to login. Linked from the Login page ("First time here?").

**How to bootstrap now:** run the app, open `http://localhost:5173/setup` (or click "First time here?" from the login screen), fill in a username/email/password, submit. That's it — no curl required for the first account. Every account after that still goes through `UserManagement` (ADMIN-only), which is intentional.









