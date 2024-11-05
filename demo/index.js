import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { Schedule } from "../src/index";

const schedules = [
    {
        id: "work",
        name: "Work Schedule",
        events: [
            {
                id: "1",
                days: [0, 2, 4], // Mon, Wed, Fri
                start: "10:00",
                end: "11:00",
                color: "#ff9999",
                customContent: `
                    <div style="padding: 5px;">
                        <h3 style="margin: 0; font-size: 14px;">Team Meeting</h3>
                        <p style="margin: 2px 0; font-size: 12px;">Project Review</p>
                        <p style="margin: 2px 0; font-size: 10px;">Conference Room A</p>
                    </div>
                `,
            },
            {
                id: "2",
                days: [0, 1, 2, 3, 4], // Mon, Tue, Wed, Thu, Fri
                start: "12:00",
                end: "13:00",
                color: "#99ccff",
                customContent: `
                    <div style="padding: 5px;">
                        <h3 style="margin: 0; font-size: 14px;">Lunch Break</h3>
                        <p style="margin: 2px 0; font-size: 12px;">Team Building</p>
                    </div>
                `,
            },
            {
                id: "6",
                days: [1, 3],
                start: "14:00",
                end: "14:50",
                color: "#8bca84",
                title: "Team Meeting",
                body: "Project Review"
            },
        ],
    },
    {
        id: "personal",
        name: "Personal Schedule",
        events: [
            {
                id: "4",
                days: [0, 2, 4],
                start: "07:00",
                end: "08:30",
                color: "#99ff99",
                customContent: `
                    <div style="padding: 5px;">
                        <h3 style="margin: 0; font-size: 14px;">Gym</h3>
                        <p style="margin: 2px 0; font-size: 12px;">Workout</p>
                    </div>
                `,
            },
            {
                id: "5",
                days: [4],
                start: "19:00",
                end: "21:00",
                color: "#ff99ff",
                customContent: `
                    <div style="padding: 5px;">
                        <h3 style="margin: 0; font-size: 14px;">Dinner with Friends</h3>
                        <p style="margin: 2px 0; font-size: 12px;">Social</p>
                    </div>
                `,
            },
        ],
    },
];

// Custom popup component
const CustomPopup = ({ event, onClose }) => {
    if (!event) return null;
    
    return (
        <div 
            style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: '#f0f0f0',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                zIndex: 1000,
                minWidth: '200px'
            }}
        >
            <h3>{event.title || 'Event Details'}</h3>
            <p>{event.body || 'No description available'}</p>
            <p>{event.start} - {event.end}</p>
            <button 
                onClick={onClose}
                style={{
                    backgroundColor: '#333',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                Close
            </button>
        </div>
    );
};

const Demo = () => {
    const [activeScheduleId, setActiveScheduleId] = useState(schedules[0].id);
    const [events, setEvents] = useState(schedules[0].events);
    const [activeTab, setActiveTab] = useState('default');
    const [customPopupEvent, setCustomPopupEvent] = useState(null);

    const handleSwitchSchedule = (scheduleId) => {
        setActiveScheduleId(scheduleId);
        const newSchedule = schedules.find(
            (schedule) => schedule.id === scheduleId
        );
        setEvents(newSchedule.events);
    };

    const handleAddEvent = (newEvent) => {
        setEvents((prevEvents) => [...prevEvents, newEvent]);
    };

    const handleRemoveEvent = (eventId) => {
        setEvents((prevEvents) =>
            prevEvents.filter((event) => event.id !== eventId)
        );
    };

    const showCustomPopup = (event) => {
        setCustomPopupEvent(event);
    };

    const renderSchedule = () => {
        switch (activeTab) {
            case 'default':
                return (
                    <Schedule
                        events={events}
                        width={1000}
                        height={800}
                        onAddEvent={handleAddEvent}
                        onRemoveEvent={handleRemoveEvent}
                        headers={[
                            { label: "Mon", dayIndex: 0 },
                            { label: "Tue", dayIndex: 1 },
                            { label: "Wed", dayIndex: 2 },
                            { label: "Thu", dayIndex: 3 },
                            { label: "Fri", dayIndex: 4 },
                        ]}
                    />
                );
            case 'custom':
                return (
                    <>
                        <Schedule
                            events={events}
                            width={1000}
                            height={800}
                            customPopupHandler={showCustomPopup}
                            headers={[
                                { label: "Mon", dayIndex: 0 },
                                { label: "Tue", dayIndex: 1 },
                                { label: "Wed", dayIndex: 2 },
                                { label: "Thu", dayIndex: 3 },
                                { label: "Fri", dayIndex: 4 },
                            ]}
                        />
                        {customPopupEvent && (
                            <CustomPopup 
                                event={customPopupEvent} 
                                onClose={() => setCustomPopupEvent(null)} 
                            />
                        )}
                    </>
                );
            case 'none':
                return (
                    <Schedule
                        events={events}
                        width={1000}
                        height={800}
                        useDefaultPopup={false}
                        headers={[
                            { label: "Mon", dayIndex: 0 },
                            { label: "Tue", dayIndex: 1 },
                            { label: "Wed", dayIndex: 2 },
                            { label: "Thu", dayIndex: 3 },
                            { label: "Fri", dayIndex: 4 },
                        ]}
                    />
                );
            case 'callback':
                return (
                    <Schedule
                        events={events}
                        width={1000}
                        height={800}
                        useDefaultPopup={false}
                        onEventClick={(event) => {
                            alert(`Clicked event: ${event.title || 'Untitled'}\nTime: ${event.start} - ${event.end}`);
                        }}
                        headers={[
                            { label: "Mon", dayIndex: 0 },
                            { label: "Tue", dayIndex: 1 },
                            { label: "Wed", dayIndex: 2 },
                            { label: "Thu", dayIndex: 3 },
                            { label: "Fri", dayIndex: 4 },
                        ]}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div>
            <h1>Schedule Demo</h1>
            <div className="schedule-selector">
                {schedules.map((schedule) => (
                    <button
                        key={schedule.id}
                        onClick={() => handleSwitchSchedule(schedule.id)}
                        className={activeScheduleId === schedule.id ? "active" : ""}
                    >
                        {schedule.name}
                    </button>
                ))}
            </div>
            <div className="popup-selector" style={{ marginBottom: '20px', textAlign: 'center' }}>
                <button
                    onClick={() => setActiveTab('default')}
                    className={activeTab === 'default' ? 'active' : ''}
                    style={{ margin: '0 10px' }}
                >
                    Default Popup
                </button>
                <button
                    onClick={() => setActiveTab('custom')}
                    className={activeTab === 'custom' ? 'active' : ''}
                    style={{ margin: '0 10px' }}
                >
                    Custom Popup
                </button>
                <button
                    onClick={() => setActiveTab('none')}
                    className={activeTab === 'none' ? 'active' : ''}
                    style={{ margin: '0 10px' }}
                >
                    No Popup
                </button>
                <button
                    onClick={() => setActiveTab('callback')}
                    className={activeTab === 'callback' ? 'active' : ''}
                    style={{ margin: '0 10px' }}
                >
                    Click Callback
                </button>
            </div>
            {renderSchedule()}
        </div>
    );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<Demo />);