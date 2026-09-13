package com.college.sms.service;

import com.college.sms.dto.request.AnnouncementRequest;
import com.college.sms.dto.response.AnnouncementResponse;

import java.util.List;

public interface AnnouncementService {

    List<AnnouncementResponse> getActive(String username);

    AnnouncementResponse create(AnnouncementRequest request);
}