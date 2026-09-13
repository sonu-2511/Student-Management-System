package com.college.sms.dto.response;

import com.college.sms.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnnouncementResponse {
    private Long id;
    private String title;
    private String content;
    private Role audience;
    private boolean active;
    private LocalDateTime publishedAt;
    private LocalDateTime expiresAt;
}