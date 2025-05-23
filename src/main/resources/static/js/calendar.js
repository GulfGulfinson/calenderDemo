document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let selectedDate = null;
    let events = [];
    let currentEvent = null;
    let users = [];

    // Get DOM elements
    const calendarGrid = document.getElementById('calendar-grid');
    const monthDisplay = document.getElementById('month-display');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const addEventBtn = document.getElementById('add-event-btn');
    
    // Event modal elements
    const eventModal = document.getElementById('event-modal');
    const closeEventModalBtn = document.getElementById('close-event-modal');
    const eventForm = document.getElementById('event-form');
    const eventTitleInput = document.getElementById('event-title');
    const eventDescriptionInput = document.getElementById('event-description');
    const eventDateInput = document.getElementById('event-date');
    const eventStartTimeInput = document.getElementById('event-start-time');
    const eventEndTimeInput = document.getElementById('event-end-time');
    const eventLocationInput = document.getElementById('event-location');
    const eventParticipantsSelect = document.getElementById('event-participants');
    const eventModalTitle = document.getElementById('event-modal-title');
    
    // Event details modal elements
    const eventDetailsModal = document.getElementById('event-details-modal');
    const closeDetailsModalBtn = document.getElementById('close-details-modal');
    const eventDetailsTitle = document.getElementById('event-details-title');
    const eventDetailsDate = document.getElementById('event-details-date');
    const eventDetailsTime = document.getElementById('event-details-time');
    const eventDetailsLocation = document.getElementById('event-details-location');
    const eventDetailsDescription = document.getElementById('event-details-description');
    const eventDetailsParticipants = document.getElementById('event-details-participants');
    const editEventBtn = document.getElementById('edit-event-btn');
    const deleteEventBtn = document.getElementById('delete-event-btn');

    // Initialize calendar
    Promise.all([fetchEvents(), fetchUsers()]).then(() => {
        renderCalendar();
    });

    // Event listeners
    prevMonthBtn.addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });

    addEventBtn.addEventListener('click', function() {
        showAddEventModal();
    });

    closeEventModalBtn.addEventListener('click', function() {
        eventModal.style.display = 'none';
    });

    closeDetailsModalBtn.addEventListener('click', function() {
        eventDetailsModal.style.display = 'none';
    });

    eventForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveEvent();
    });

    editEventBtn.addEventListener('click', function() {
        eventDetailsModal.style.display = 'none';
        showEditEventModal(currentEvent);
    });

    deleteEventBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete this event?')) {
            deleteEvent(currentEvent.id);
        }
    });

    // Close modal when clicking outside the modal content
    window.addEventListener('click', function(event) {
        if (event.target === eventModal) {
            eventModal.style.display = 'none';
        }
        if (event.target === eventDetailsModal) {
            eventDetailsModal.style.display = 'none';
        }
    });

    // Functions
    function renderCalendar() {
        // Update month and year display
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        monthDisplay.textContent = `${monthNames[currentMonth]} ${currentYear}`;

        // Clear calendar grid (except headers)
        const dayHeaders = calendarGrid.querySelectorAll('.calendar-day-header');
        calendarGrid.innerHTML = '';

        // Add day headers back
        dayHeaders.forEach(header => {
            calendarGrid.appendChild(header);
        });

        // Get first day of month and last day of month
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        
        // Get day of week of first day (0 = Sunday, 6 = Saturday)
        const firstDayIndex = firstDay.getDay();
        
        // Get total days in month
        const daysInMonth = lastDay.getDate();
        
        // Get days from previous month to display
        const prevMonthDays = firstDayIndex;
        
        // Get last day of previous month
        const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
        
        // Get total days to display (including prev/next month days)
        let totalDays = Math.ceil((prevMonthDays + daysInMonth) / 7) * 7;
        
        // Create calendar days
        for (let i = 1; i <= totalDays; i++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day';
            
            // Calculate date for this cell
            let date, month, year, isCurrentMonth;
            
            if (i <= prevMonthDays) {
                // Previous month
                date = prevMonthLastDay - (prevMonthDays - i);
                month = currentMonth - 1 < 0 ? 11 : currentMonth - 1;
                year = currentMonth - 1 < 0 ? currentYear - 1 : currentYear;
                isCurrentMonth = false;
                dayEl.classList.add('other-month');
            } else if (i > prevMonthDays + daysInMonth) {
                // Next month
                date = i - (prevMonthDays + daysInMonth);
                month = currentMonth + 1 > 11 ? 0 : currentMonth + 1;
                year = currentMonth + 1 > 11 ? currentYear + 1 : currentYear;
                isCurrentMonth = false;
                dayEl.classList.add('other-month');
            } else {
                // Current month
                date = i - prevMonthDays;
                month = currentMonth;
                year = currentYear;
                isCurrentMonth = true;
                
                // Check if it's today
                const today = new Date();
                if (date === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                    dayEl.classList.add('today');
                }
            }
            
            // Add date number
            const dateNumber = document.createElement('div');
            dateNumber.className = 'day-number';
            dateNumber.textContent = date;
            dayEl.appendChild(dateNumber);
            
            // Add events container
            const eventsContainer = document.createElement('div');
            eventsContainer.className = 'events-list';
            
            // Add events for this day
            const dayEvents = getEventsForDay(year, month, date);
            dayEvents.forEach(event => {
                const eventEl = document.createElement('div');
                eventEl.className = 'event-item';
                eventEl.textContent = event.title;
                eventEl.addEventListener('click', function(e) {
                    e.stopPropagation(); // Prevent day click
                    showEventDetails(event);
                });
                eventsContainer.appendChild(eventEl);
            });
            
            dayEl.appendChild(eventsContainer);
            
            // Add click event to add event for this day
            dayEl.addEventListener('click', function() {
                const dateStr = formatDateForInput(new Date(year, month, date));
                selectedDate = dateStr;
                showAddEventModal(dateStr);
            });
            
            calendarGrid.appendChild(dayEl);
        }
    }

    function getEventsForDay(year, month, day) {
        const date = new Date(year, month, day);
        const dateStr = date.toISOString().split('T')[0];
        
        return events.filter(event => {
            const eventDate = new Date(event.startTime).toISOString().split('T')[0];
            return eventDate === dateStr;
        });
    }

    function formatDateForInput(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function formatTimeForInput(time) {
        return time.substring(0, 5);
    }

    function showAddEventModal(dateStr = null) {
        eventModalTitle.textContent = 'Add Event';
        eventForm.reset();
        
        // Populate participants dropdown
        populateParticipantsDropdown();
        
        if (dateStr) {
            eventDateInput.value = dateStr;
        } else {
            eventDateInput.value = formatDateForInput(new Date());
        }
        
        // Set default times
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(Math.floor(now.getMinutes() / 15) * 15).padStart(2, '0');
        
        eventStartTimeInput.value = `${hours}:${minutes}`;
        
        // Set end time to 1 hour later
        const endHours = String((parseInt(hours) + 1) % 24).padStart(2, '0');
        eventEndTimeInput.value = `${endHours}:${minutes}`;
        
        currentEvent = null;
        eventModal.style.display = 'block';
    }

    function showEditEventModal(event) {
        eventModalTitle.textContent = 'Edit Event';
        
        eventTitleInput.value = event.title;
        eventDescriptionInput.value = event.description || '';
        eventDateInput.value = formatDateForInput(new Date(event.startTime));
        eventStartTimeInput.value = formatTimeForInput(event.startTime.substring(11));
        eventEndTimeInput.value = formatTimeForInput(event.endTime.substring(11));
        eventLocationInput.value = event.location || '';
        
        // Populate participants dropdown and select existing participants
        populateParticipantsDropdown(event.participantIds);
        
        currentEvent = event;
        eventModal.style.display = 'block';
    }

    function showEventDetails(event) {
        eventDetailsTitle.textContent = event.title;
        
        // Format date
        const eventDate = new Date(event.startTime);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        eventDetailsDate.textContent = eventDate.toLocaleDateString(undefined, options);
        
        // Format time
        const startTime = new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const endTime = new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        eventDetailsTime.textContent = `${startTime} - ${endTime}`;
        
        // Location and description
        eventDetailsLocation.textContent = event.location || 'Not specified';
        eventDetailsDescription.textContent = event.description || 'No description';
        
        // Participants
        const participantNames = event.participantIds
            .map(id => {
                const user = users.find(u => u.id === id);
                return user ? user.fullName || user.username : 'Unknown';
            })
            .join(', ');
        eventDetailsParticipants.textContent = participantNames || 'None';
        
        currentEvent = event;
        eventDetailsModal.style.display = 'block';
    }

    function populateParticipantsDropdown(selectedIds = []) {
        // Clear existing options
        eventParticipantsSelect.innerHTML = '';
        
        // Add options for each user
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = user.fullName || user.username;
            
            // Check if this user is selected
            if (selectedIds.includes(user.id)) {
                option.selected = true;
            }
            
            eventParticipantsSelect.appendChild(option);
        });
    }

    function saveEvent() {
        const title = eventTitleInput.value;
        const description = eventDescriptionInput.value;
        const date = eventDateInput.value;
        const startTime = eventStartTimeInput.value;
        const endTime = eventEndTimeInput.value;
        const location = eventLocationInput.value;
        
        // Get selected participants
        const participantIds = Array.from(eventParticipantsSelect.selectedOptions)
            .map(option => parseInt(option.value));
        
        const startDateTime = `${date}T${startTime}:00`;
        const endDateTime = `${date}T${endTime}:00`;
        
        const eventData = {
            title: title,
            description: description,
            startTime: startDateTime,
            endTime: endDateTime,
            location: location,
            calendarId: 1, // Default calendar ID
            participantIds: participantIds
        };
        
        if (currentEvent) {
            // Update existing event
            eventData.id = currentEvent.id;
            updateEvent(eventData);
        } else {
            // Create new event
            createEvent(eventData);
        }
    }

    async function fetchEvents() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/events', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch events');
            }
            
            events = await response.json();
            return events;
        } catch (error) {
            console.error('Error fetching events:', error);
            return [];
        }
    }

    async function fetchUsers() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/users', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            
            users = await response.json();
            return users;
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    }

    async function createEvent(eventData) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/events', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(eventData)
            });
            
            if (!response.ok) {
                throw new Error('Failed to create event');
            }
            
            const createdEvent = await response.json();
            events.push(createdEvent);
            
            // Close modal and refresh calendar
            eventModal.style.display = 'none';
            renderCalendar();
            
            return createdEvent;
        } catch (error) {
            console.error('Error creating event:', error);
            alert('Failed to create event. Please try again.');
        }
    }

    async function updateEvent(eventData) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/events/${eventData.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(eventData)
            });
            
            if (!response.ok) {
                throw new Error('Failed to update event');
            }
            
            const updatedEvent = await response.json();
            
            // Update events array
            const index = events.findIndex(e => e.id === updatedEvent.id);
            if (index !== -1) {
                events[index] = updatedEvent;
            }
            
            // Close modal and refresh calendar
            eventModal.style.display = 'none';
            renderCalendar();
            
            return updatedEvent;
        } catch (error) {
            console.error('Error updating event:', error);
            alert('Failed to update event. Please try again.');
        }
    }

    async function deleteEvent(eventId) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/events/${eventId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete event');
            }
            
            // Remove event from array
            events = events.filter(e => e.id !== eventId);
            
            // Close modal and refresh calendar
            eventDetailsModal.style.display = 'none';
            renderCalendar();
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('Failed to delete event. Please try again.');
        }
    }
}); 