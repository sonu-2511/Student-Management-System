package com.college.sms.service;

import com.college.sms.dto.request.AnnouncementRequest;
import com.college.sms.entity.Announcement;
import com.college.sms.entity.Role;
import com.college.sms.entity.User;
import com.college.sms.repository.AnnouncementRepository;
import com.college.sms.repository.UserRepository;
import com.college.sms.service.impl.AnnouncementServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AnnouncementServiceImplTest {

    @Mock private AnnouncementRepository announcementRepository;
    @Mock private UserRepository userRepository;
    @InjectMocks private AnnouncementServiceImpl announcementService;

    @Test
    void activeAnnouncementsUseLoggedInUserRole() {
        when(userRepository.findByUsername("teacher1"))
                .thenReturn(Optional.of(User.builder().username("teacher1").role(Role.TEACHER).build()));
        Announcement announcement = Announcement.builder().id(3L).title("Exam").content("Tomorrow").active(true).build();
        when(announcementRepository.findActiveForRole(any(), any())).thenReturn(List.of(announcement));

        assertThat(announcementService.getActive("teacher1")).extracting("title").containsExactly("Exam");
    }

    @Test
    void createsActiveAnnouncementWithPublicationTime() {
        when(announcementRepository.save(any(Announcement.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var response = announcementService.create(new AnnouncementRequest("Notice", "Read this", null, null));

        assertThat(response.isActive()).isTrue();
        assertThat(response.getPublishedAt()).isNotNull();
    }
}