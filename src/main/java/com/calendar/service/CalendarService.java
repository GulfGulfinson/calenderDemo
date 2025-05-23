package com.calendar.service;

import com.calendar.dto.CalendarDto;
import com.calendar.model.Calendar;
import com.calendar.model.User;
import com.calendar.repository.CalendarRepository;
import com.calendar.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CalendarService {

    @Autowired
    private CalendarRepository calendarRepository;

    @Autowired
    private UserRepository userRepository;

    public List<CalendarDto> getAllCalendars() {
        return calendarRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<CalendarDto> getCalendarsByUser(User user) {
        return calendarRepository.findAllAccessibleByUser(user).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<CalendarDto> getCalendarById(Long id) {
        return calendarRepository.findById(id)
                .map(this::convertToDto);
    }

    public CalendarDto createCalendar(CalendarDto calendarDto, User owner) {
        Calendar calendar = new Calendar();
        calendar.setName(calendarDto.getName());
        calendar.setDescription(calendarDto.getDescription());
        calendar.setColor(calendarDto.getColor());
        calendar.setOwner(owner);
        
        Set<User> sharedUsers = new HashSet<>();
        if (calendarDto.getSharedWithUserIds() != null) {
            for (Long userId : calendarDto.getSharedWithUserIds()) {
                userRepository.findById(userId).ifPresent(sharedUsers::add);
            }
        }
        calendar.setSharedWith(sharedUsers);
        
        Calendar savedCalendar = calendarRepository.save(calendar);
        return convertToDto(savedCalendar);
    }

    public CalendarDto updateCalendar(Long id, CalendarDto calendarDto) {
        return calendarRepository.findById(id)
                .map(calendar -> {
                    calendar.setName(calendarDto.getName());
                    calendar.setDescription(calendarDto.getDescription());
                    calendar.setColor(calendarDto.getColor());
                    
                    Set<User> sharedUsers = new HashSet<>();
                    if (calendarDto.getSharedWithUserIds() != null) {
                        for (Long userId : calendarDto.getSharedWithUserIds()) {
                            userRepository.findById(userId).ifPresent(sharedUsers::add);
                        }
                    }
                    calendar.setSharedWith(sharedUsers);
                    
                    return convertToDto(calendarRepository.save(calendar));
                })
                .orElseThrow(() -> new RuntimeException("Calendar not found with id: " + id));
    }

    public void deleteCalendar(Long id) {
        calendarRepository.deleteById(id);
    }

    private CalendarDto convertToDto(Calendar calendar) {
        CalendarDto dto = new CalendarDto();
        dto.setId(calendar.getId());
        dto.setName(calendar.getName());
        dto.setDescription(calendar.getDescription());
        dto.setColor(calendar.getColor());
        dto.setOwnerId(calendar.getOwner().getId());
        
        Set<Long> sharedWithUserIds = calendar.getSharedWith().stream()
                .map(User::getId)
                .collect(Collectors.toSet());
        dto.setSharedWithUserIds(sharedWithUserIds);
        
        return dto;
    }
} 