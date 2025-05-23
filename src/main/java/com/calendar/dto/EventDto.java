package com.calendar.dto;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import com.calendar.model.EventStatus;

public class EventDto {
    private Long id;
    
    @NotBlank
    private String title;
    
    private String description;
    
    @NotNull
    private LocalDateTime startTime;
    
    @NotNull
    private LocalDateTime endTime;
    
    private String location;
    
    @NotNull
    private Long calendarId;
    
    private Long createdById;
    
    private Set<Long> participantIds = new HashSet<>();
    
    private boolean isAllDay;
    
    private EventStatus status;
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public LocalDateTime getStartTime() {
        return startTime;
    }
    
    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }
    
    public LocalDateTime getEndTime() {
        return endTime;
    }
    
    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public Long getCalendarId() {
        return calendarId;
    }
    
    public void setCalendarId(Long calendarId) {
        this.calendarId = calendarId;
    }
    
    public Long getCreatedById() {
        return createdById;
    }
    
    public void setCreatedById(Long createdById) {
        this.createdById = createdById;
    }
    
    public Set<Long> getParticipantIds() {
        return participantIds;
    }
    
    public void setParticipantIds(Set<Long> participantIds) {
        this.participantIds = participantIds;
    }
    
    public boolean isAllDay() {
        return isAllDay;
    }
    
    public void setAllDay(boolean isAllDay) {
        this.isAllDay = isAllDay;
    }
    
    public EventStatus getStatus() {
        return status;
    }
    
    public void setStatus(EventStatus status) {
        this.status = status;
    }
} 