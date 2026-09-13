package com.college.sms.service.impl;

import com.college.sms.dto.request.AnnouncementRequest;
import com.college.sms.dto.response.AnnouncementResponse;
import com.college.sms.entity.Announcement;
import com.college.sms.entity.Role;
import com.college.sms.repository.AnnouncementRepository;
import com.college.sms.repository.UserRepository;
import com.college.sms.service.AnnouncementService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnnouncementServiceImpl implements AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final UserRepository userRepository;

    @Override
    public List<AnnouncementResponse> getActive(String username) {
        Role role = userRepository.findByUsername(username).map(user -> user.getRole()).orElse(Role.STUDENT);
        return announcementRepository.findActiveForRole(role, LocalDateTime.now()).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public AnnouncementResponse create(AnnouncementRequest request) {
        Announcement announcement = Announcement.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .audience(request.getAudience())
                .active(true)
                .publishedAt(LocalDateTime.now())
                .expiresAt(request.getExpiresAt())
                .build();
        return toResponse(announcementRepository.save(announcement));
    }

    private AnnouncementResponse toResponse(Announcement announcement) {
        return AnnouncementResponse.builder()
                .id(announcement.getId())
                .title(announcement.getTitle())
                .content(announcement.getContent())
                .audience(announcement.getAudience())
                .active(announcement.isActive())
                .publishedAt(announcement.getPublishedAt())
                .expiresAt(announcement.getExpiresAt())
                .build();
    }
}