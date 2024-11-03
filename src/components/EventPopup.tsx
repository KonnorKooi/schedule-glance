import React from "react";
import { ScheduleEvent } from "../types";

interface EventPopupProps {
    event: ScheduleEvent;
    onClose: () => void;
}

const EventPopup: React.FC<EventPopupProps> = ({ event, onClose }) => {
    return (
        <div className="event-popup">
            <div className="event-popup-content">
                <h2>{event.title}</h2>
                <p>Start: {event.start.toLocaleString()}</p>
                <p>End: {event.end.toLocaleString()}</p>
                {/* Add more event details as needed */}
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default EventPopup;
