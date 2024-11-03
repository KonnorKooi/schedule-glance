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
                id: "3",
                days: [3],
                start: "16:00",
                end: "17:30",
                color: "#ff9999",
            },
            {
                id: "6",
                days: [1, 3],
                start: "14:00",
                end: "15:00",
                color: "#99ccff",
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
                days: [0, 2, 4], // mon, wed, Ffri
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
                days: [4], //fri
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

const Demo = () => {
    const [activeScheduleId, setActiveScheduleId] = useState(schedules[0].id);
    const [events, setEvents] = useState(schedules[0].events);

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

    return (
        <div>
            <h1>Schedule Demo</h1>
            <div className="schedule-selector">
                {schedules.map((schedule) => (
                    <button
                        key={schedule.id}
                        onClick={() => handleSwitchSchedule(schedule.id)}
                        className={
                            activeScheduleId === schedule.id ? "active" : ""
                        }>
                        {schedule.name}
                    </button>
                ))}
            </div>
            <Schedule
                events={events}
                width={1000}              // Optional: Set width in pixels
                height={800}              // Optional: Set height in pixels
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
        </div>
    );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<Demo />);
