package com.calendar.model;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "calendars")
public class Calendar {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    private String description;
    
    @Column(nullable = false)
    private String color;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;
    
    @OneToMany(mappedBy = "calendar", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Event> events = new HashSet<>();
    
    @ManyToMany
    @JoinTable(
        name = "calendar_user_access",
        joinColumns = @JoinColumn(name = "calendar_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> sharedWith = new HashSet<>();
    
    public Calendar() {
    }
    
    public Calendar(Long id, String name, String description, String color, User owner, Set<Event> events, Set<User> sharedWith) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.color = color;
        this.owner = owner;
        this.events = events;
        this.sharedWith = sharedWith;
    }
    
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
    
    public User getOwner() {
        return owner;
    }
    
    public void setOwner(User owner) {
        this.owner = owner;
    }
    
    public Set<Event> getEvents() {
        return events;
    }
    
    public void setEvents(Set<Event> events) {
        this.events = events;
    }
    
    public Set<User> getSharedWith() {
        return sharedWith;
    }
    
    public void setSharedWith(Set<User> sharedWith) {
        this.sharedWith = sharedWith;
    }
} 