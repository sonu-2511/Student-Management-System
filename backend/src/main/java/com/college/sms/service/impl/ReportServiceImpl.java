package com.college.sms.service.impl;

import com.college.sms.dto.response.AttendanceReportResponse;
import com.college.sms.dto.response.CountItem;
import com.college.sms.entity.Attendance;
import com.college.sms.entity.AttendanceStatus;
import com.college.sms.entity.Marks;
import com.college.sms.repository.AttendanceRepository;
import com.college.sms.repository.MarksRepository;
import com.college.sms.repository.StudentRepository;
import com.college.sms.service.ReportService;
import com.college.sms.specification.AttendanceSpecification;
import com.college.sms.specification.MarksSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportServiceImpl implements ReportService {

    private final StudentRepository studentRepository;
    private final AttendanceRepository attendanceRepository;
    private final MarksRepository marksRepository;

    @Override
    public List<CountItem> studentsByDepartment() {
        return studentRepository.countByDepartment().stream()
                .map(row -> CountItem.builder()
                        .label(String.valueOf(row[0]))
                        .count(((Number) row[1]).longValue())
                        .build())
                .toList();
    }

    @Override
    public List<CountItem> studentsBySemester() {
        return studentRepository.countBySemester().stream()
                .map(row -> CountItem.builder()
                        .label("Semester " + row[0])
                        .count(((Number) row[1]).longValue())
                        .build())
                .toList();
    }

    @Override
    public AttendanceReportResponse attendanceReport(Long departmentId, Long courseId, Integer semester,
                                                       LocalDate fromDate, LocalDate toDate) {
        List<Attendance> records = attendanceRepository.findAll(
                AttendanceSpecification.withFilters(departmentId, courseId, semester, fromDate, toDate));

        Map<AttendanceStatus, Long> byStatus = records.stream()
                .collect(Collectors.groupingBy(Attendance::getStatus, Collectors.counting()));

        long total = records.size();
        long present = byStatus.getOrDefault(AttendanceStatus.PRESENT, 0L);
        long absent = byStatus.getOrDefault(AttendanceStatus.ABSENT, 0L);
        long leave = byStatus.getOrDefault(AttendanceStatus.LEAVE, 0L);

        BigDecimal percentage = total == 0
                ? BigDecimal.ZERO
                : BigDecimal.valueOf(present)
                    .multiply(BigDecimal.valueOf(100))
                    .divide(BigDecimal.valueOf(total), 2, RoundingMode.HALF_UP);

        return AttendanceReportResponse.builder()
                .totalRecords(total)
                .presentCount(present)
                .absentCount(absent)
                .leaveCount(leave)
                .attendancePercentage(percentage)
                .build();
    }

    @Override
    public List<CountItem> gradeDistribution(Long departmentId, Long courseId, Integer semester) {
        List<Marks> records = marksRepository.findAll(
                MarksSpecification.withFilters(departmentId, courseId, semester));

        Map<String, Long> byGrade = records.stream()
                .collect(Collectors.groupingBy(Marks::getGrade, Collectors.counting()));

        return byGrade.entrySet().stream()
                .map(entry -> CountItem.builder().label(entry.getKey()).count(entry.getValue()).build())
                .sorted((a, b) -> a.getLabel().compareTo(b.getLabel()))
                .toList();
    }
}
