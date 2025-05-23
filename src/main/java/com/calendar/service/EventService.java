package com.calendar.service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.calendar.dto.EventDto;
import com.calendar.model.Calendar;
import com.calendar.model.Event;
import com.calendar.model.User;
import com.calendar.repository.CalendarRepository;
import com.calendar.repository.EventRepository;
import com.calendar.repository.UserRepository;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private CalendarRepository calendarRepository;
    
    @Autowired
    private UserRepository userRepository;

    public List<EventDto> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<EventDto> getEventsByUser(User user) {
        return eventRepository.findAllAccessibleByUser(user).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<EventDto> getEventsByUserAndDateRange(User user, LocalDateTime start, LocalDateTime end) {
        return eventRepository.findAllAccessibleByUserAndDateRange(user, start, end).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<EventDto> getEventsByCalendar(Calendar calendar) {
        return eventRepository.findByCalendar(calendar).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<EventDto> getEventById(Long id) {
        return eventRepository.findById(id)
                .map(this::convertToDto);
    }

    public EventDto createEvent(EventDto eventDto, User createdBy) {
        Optional<Calendar> calendarOpt = calendarRepository.findById(eventDto.getCalendarId());
        if (calendarOpt.isEmpty()) {
            throw new RuntimeException("Calendar not found with id: " + eventDto.getCalendarId());
        }
        
        Event event = new Event();
        event.setTitle(eventDto.getTitle());
        event.setDescription(eventDto.getDescription());
        event.setStartTime(eventDto.getStartTime());
        event.setEndTime(eventDto.getEndTime());
        event.setLocation(eventDto.getLocation());
        event.setCalendar(calendarOpt.get());
        event.setCreatedBy(createdBy);
        event.setAllDay(eventDto.isAllDay());
        event.setStatus(eventDto.getStatus());
        
        // Add participants
        Set<User> participants = new HashSet<>();
        if (eventDto.getParticipantIds() != null && !eventDto.getParticipantIds().isEmpty()) {
            for (Long userId : eventDto.getParticipantIds()) {
                userRepository.findById(userId).ifPresent(participants::add);
            }
        }
        // Always add the creator as a participant
        participants.add(createdBy);
        event.setParticipants(participants);
        
        Event savedEvent = eventRepository.save(event);
        return convertToDto(savedEvent);
    }

    public EventDto updateEvent(Long id, EventDto eventDto) {
        return eventRepository.findById(id)
                .map(event -> {
                    event.setTitle(eventDto.getTitle());
                    event.setDescription(eventDto.getDescription());
                    event.setStartTime(eventDto.getStartTime());
                    event.setEndTime(eventDto.getEndTime());
                    event.setLocation(eventDto.getLocation());
                    event.setAllDay(eventDto.isAllDay());
                    event.setStatus(eventDto.getStatus());
                    
                    if (eventDto.getCalendarId() != null) {
                        calendarRepository.findById(eventDto.getCalendarId())
                                .ifPresent(calendar -> event.setCalendar(calendar));
                    }
                    
                    // Update participants
                    if (eventDto.getParticipantIds() != null) {
                        Set<User> participants = new HashSet<>();
                        for (Long userId : eventDto.getParticipantIds()) {
                            userRepository.findById(userId).ifPresent(participants::add);
                        }
                        // Always keep the creator as a participant
                        participants.add(event.getCreatedBy());
                        event.setParticipants(participants);
                    }
                    
                    return convertToDto(eventRepository.save(event));
                })
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
    }

    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }

    private EventDto convertToDto(Event event) {
        EventDto dto = new EventDto();
        dto.setId(event.getId());
        dto.setTitle(event.getTitle());
        dto.setDescription(event.getDescription());
        dto.setStartTime(event.getStartTime());
        dto.setEndTime(event.getEndTime());
        dto.setLocation(event.getLocation());
        dto.setCalendarId(event.getCalendar().getId());
        dto.setCreatedById(event.getCreatedBy().getId());
        dto.setAllDay(event.isAllDay());
        dto.setStatus(event.getStatus());
        
        // Convert participants to IDs
        Set<Long> participantIds = event.getParticipants().stream()
                .map(User::getId)
                .collect(Collectors.toSet());
        dto.setParticipantIds(participantIds);
        
        return dto;
    }
} 