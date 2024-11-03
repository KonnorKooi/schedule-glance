import React from "react";
import { ScheduleEvent } from "../types";

interface ScheduleCellProps {
    events: ScheduleEvent[];
    onEventClick: (event: ScheduleEvent) => void;
}

// ScheduleCell component renders events within a cell of the Schedule
const ScheduleCell: React.FC<ScheduleCellProps> = ({
    events,
    onEventClick,
}) => {
    return (
        <div className="schedule-cell">
            {/* Map through the events and render each event */}
            {events.map((event) => (
                <div
                    key={event.id}
                    className="schedule-event"
                    style={{ backgroundColor: event.color }}
                    onClick={() => onEventClick(event)}>
                    <span className="event-title">{event.title}</span>
                    <span className="event-time">
                        {event.start} - {event.end}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default ScheduleCell;
