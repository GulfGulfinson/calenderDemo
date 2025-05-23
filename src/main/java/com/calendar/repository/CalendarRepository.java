package com.calendar.repository;

import com.calendar.model.Calendar;
import com.calendar.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CalendarRepository extends JpaRepository<Calendar, Long> {
    List<Calendar> findByOwner(User owner);
    
    @Query("SELECT c FROM Calendar c WHERE c.owner = ?1 OR ?1 MEMBER OF c.sharedWith")
    List<Calendar> findAllAccessibleByUser(User user);
} 