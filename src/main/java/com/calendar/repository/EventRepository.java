package com.calendar.repository;

import com.calendar.model.Calendar;
import com.calendar.model.Event;
import com.calendar.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByCalendar(Calendar calendar);
    
    List<Event> findByCalendarAndStartTimeBetween(Calendar calendar, LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT e FROM Event e WHERE e.calendar.owner = ?1 OR ?1 MEMBER OF e.calendar.sharedWith")
    List<Event> findAllAccessibleByUser(User user);
    
    @Query("SELECT e FROM Event e WHERE (e.calendar.owner = ?1 OR ?1 MEMBER OF e.calendar.sharedWith) AND e.startTime BETWEEN ?2 AND ?3")
    List<Event> findAllAccessibleByUserAndDateRange(User user, LocalDateTime start, LocalDateTime end);
} 