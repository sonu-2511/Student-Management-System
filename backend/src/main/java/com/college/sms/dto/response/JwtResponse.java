package com.college.sms.dto.response;

import com.college.sms.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String tokenType;
    private String username;
    private Role role;
    private long expiresInMs;
    /** Populated only when this account is linked to a Student profile. */
    private Long studentId;
    /** Populated only when this account is linked to a Teacher profile. */
    private Long teacherId;
}
