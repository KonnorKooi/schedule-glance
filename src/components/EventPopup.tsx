import React from "react";
import { ScheduleEvent } from "../types";

interface EventPopupProps {
    event: ScheduleEvent;
    onClose: () => void;
}

const EventPopup: React.FC<EventPopupProps> = ({ event, onClose }) => {
    return (
        <div 
            className="event-popup-overlay" 
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
            onClick={onClose}
        >
            <div 
                className="event-popup"
                style={{
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "10px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    maxWidth: "300px",
                    width: "100%",
                    position: "relative"
                }}
                onClick={e => e.stopPropagation()}
            >
                <div style={{ marginBottom: "20px" }}>
                    {event.title && (
                        <h3 style={{ 
                            margin: 0, 
                            fontSize: "16px",
                            fontWeight: "bold",
                            marginBottom: "10px"
                        }}>
                            {event.title}
                        </h3>
                    )}
                    {event.body && (
                        <p style={{ 
                            margin: "2px 0",
                            fontSize: "12px"
                        }}>
                            {event.body}
                        </p>
                    )}
                    <div style={{ 
                        fontSize: "14px",
                        color: "#666",
                        marginTop: "10px"
                    }}>
                        {event.start} - {event.end}
                    </div>
                </div>
                <button 
                    onClick={onClose}
                    style={{
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        padding: "10px 15px",
                        borderRadius: "5px",
                        cursor: "pointer",
                        transition: "background-color 0.2s ease-in-out",
                        width: "100%"
                    }}
                    onMouseOver={e => e.currentTarget.style.backgroundColor = "#0056b3"}
                    onMouseOut={e => e.currentTarget.style.backgroundColor = "#007bff"}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default EventPopup;