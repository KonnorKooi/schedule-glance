import React from 'react';
import { EventPopupProps } from '../types';

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
                margin: 0,
                padding: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "auto"
            }}
            onClick={onClose}
        >
            <div 
                className="event-popup"
                style={{
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "10px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
                    maxWidth: "400px",
                    width: "90%",
                    position: "relative",
                    maxHeight: "90vh",
                    overflow: "auto",
                    animation: "popupFadeIn 0.3s ease-out",
                    transform: "none",  // Remove any transform that might affect positioning
                    margin: 0,  // Remove any margin that might affect positioning
                    left: "auto",  // Remove any left positioning
                    right: "auto",  // Remove any right positioning
                    top: "auto",  // Remove any top positioning
                    bottom: "auto"  // Remove any bottom positioning
                }}
                onClick={e => e.stopPropagation()}
            >
                <div style={{ marginBottom: "20px" }}>
                    {event.title && (
                        <h3 style={{ 
                            margin: 0, 
                            fontSize: "18px",
                            fontWeight: "bold",
                            marginBottom: "10px",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                            color: "#333"
                        }}>
                            {event.title}
                        </h3>
                    )}
                    {event.body && (
                        <p style={{ 
                            margin: "2px 0",
                            fontSize: "14px",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                            color: "#666",
                            lineHeight: "1.5"
                        }}>
                            {event.body}
                        </p>
                    )}
                    <div style={{ 
                        fontSize: "14px",
                        color: "#666",
                        marginTop: "10px",
                        padding: "8px",
                        backgroundColor: "#f5f5f5",
                        borderRadius: "5px",
                        display: "inline-block"
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
                        padding: "10px 20px",
                        borderRadius: "5px",
                        cursor: "pointer",
                        transition: "all 0.2s ease-in-out",
                        width: "100%",
                        fontSize: "14px",
                        fontWeight: "500"
                    }}
                    onMouseOver={e => e.currentTarget.style.backgroundColor = "#0056b3"}
                    onMouseOut={e => e.currentTarget.style.backgroundColor = "#007bff"}
                >
                    Close
                </button>
            </div>
            <style>
                {`
                @keyframes popupFadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .event-popup-overlay {
                    position: fixed !important;
                    left: 0 !important;
                    top: 0 !important;
                    width: 100vw !important;
                    height: 100vh !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                }
                `}
            </style>
        </div>
    );
};

export default EventPopup;