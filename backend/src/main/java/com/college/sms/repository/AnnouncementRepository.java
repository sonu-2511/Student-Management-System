package com.college.sms.repository;

import com.college.sms.entity.Announcement;
import com.college.sms.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {

    @Query("select a from Announcement a where a.active = true "
            + "and (a.audience is null or a.audience = :role) "
            + "and (a.expiresAt is null or a.expiresAt > :now) "
            + "order by a.publishedAt desc")
    List<Announcement> findActiveForRole(@Param("role") Role role, @Param("now") LocalDateTime now);
}