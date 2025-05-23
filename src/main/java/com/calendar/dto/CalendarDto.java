package com.calendar.dto;

import javax.validation.constraints.NotBlank;
import java.util.HashSet;
import java.util.Set;

public class CalendarDto {
    private Long id;
    
    @NotBlank
    private String name;
    
    private String description;
    
    @NotBlank
    private String color;
    
    private Long ownerId;
    
    private Set<Long> sharedWithUserIds = new HashSet<>();
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getColor() {
        return color;
    }
    
    public void setColor(String color) {
        this.color = color;
    }
    
    public Long getOwnerId() {
        return ownerId;
    }
    
    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }
    
    public Set<Long> getSharedWithUserIds() {
        return sharedWithUserIds;
    }
    
    public void setSharedWithUserIds(Set<Long> sharedWithUserIds) {
        this.sharedWithUserIds = sharedWithUserIds;
    }
} 