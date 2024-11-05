// components/Schedule.tsx
import React, { useState, useEffect, useRef } from "react";
import { ScheduleProps, ScheduleEvent } from "../types";
import { sortEvents, findStartEndTimes } from "../utils/scheduleHelpers";
import EventPopup from './EventPopup';

const Schedule: React.FC<ScheduleProps> = ({
    events: initialEvents,
    width = 800,
    height = 600,
    onEventClick,
    headers = [
        { label: "Monday", dayIndex: 0 },
        { label: "Tuesday", dayIndex: 1 },
        { label: "Wednesday", dayIndex: 2 },
        { label: "Thursday", dayIndex: 3 },
        { label: "Friday", dayIndex: 4 },
    ],
    customPopupHandler,
    useDefaultPopup = true,
}) => {
    const [events, setEvents] = useState<ScheduleEvent[]>(initialEvents);
    const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
    const [startHour, setStartHour] = useState(8);
    const [endHour, setEndHour] = useState(18);
    const scheduleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setEvents(initialEvents);
        const { startHour: newStartHour, endHour: newEndHour } = findStartEndTimes(initialEvents);
        setStartHour(newStartHour);
        setEndHour(newEndHour);
    }, [initialEvents]);

    const handleEventClick = (event: ScheduleEvent) => {
        if (customPopupHandler) {
            customPopupHandler(event);
        } else if (useDefaultPopup) {
            setSelectedEvent(event);
        }
        
        if (onEventClick) {
            onEventClick(event);
        }
    };

    const formatHour = (hour: number): string => {
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12; // Convert 0 to 12 for 12 AM
        return `${displayHour}:00 ${period}`;
    };

    // Rest of the existing renderEventContent function
    const renderEventContent = (event: ScheduleEvent) => {
        if (event.customContent) {
            return <div dangerouslySetInnerHTML={{ __html: event.customContent }} />;
        }

        if (event.title || event.body) {
            return (
                <div className="event-content" style={{ padding: "5px", height: "100%" }}>
                    {event.title && (
                        <h3 style={{ 
                            margin: 0, 
                            fontSize: "14px",
                            fontWeight: "bold",
                            whiteSpace: "pre-wrap",
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: "2",
                            WebkitBoxOrient: "vertical",
                            lineHeight: "1.2"
                        }}>
                            {event.title}
                        </h3>
                    )}
                    {event.body && (
                        <p style={{ 
                            margin: "2px 0",
                            fontSize: "12px",
                            whiteSpace: "pre-wrap",
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: "3",
                            WebkitBoxOrient: "vertical",
                            lineHeight: "1.2"
                        }}>
                            {event.body}
                        </p>
                    )}
                    <div style={{ 
                        fontSize: "10px",
                        color: "#666",
                        marginTop: "2px"
                    }}>
                        {event.start} - {event.end}
                    </div>
                </div>
            );
        }

        return (
            <div className="event-content" style={{ padding: "5px" }}>
                <div style={{ fontSize: "12px" }}>
                    {event.start} - {event.end}
                </div>
            </div>
        );
    };

    const renderHTML = (html: string) => ({ __html: html });

    const groupEventsByDay = (events: ScheduleEvent[]) => {
        const grouped = new Map<number, ScheduleEvent[]>();
        headers.forEach((header) => {
            grouped.set(header.dayIndex, []);
        });

        events.forEach((event) => {
            if (Array.isArray(event.days)) {
                event.days.forEach((dayIndex) => {
                    if (grouped.has(dayIndex)) {
                        grouped.get(dayIndex)!.push(event);
                    }
                });
            }
        });

        return grouped;
    };

    const groupedEvents = groupEventsByDay(sortEvents(events));
    const timeSlots = Array.from({ length: endHour - startHour }, (_, i) => formatHour(i + startHour));

    const timeToMinutes = (time: string): number => {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
    };

    const calculateEventPosition = (event: ScheduleEvent) => {
        const minutesPerHour = 60;
        const dayStartMinutes = startHour * minutesPerHour;
        const totalHours = endHour - startHour;
        
        const eventStart = timeToMinutes(event.start) - dayStartMinutes;
        const eventEnd = timeToMinutes(event.end) - dayStartMinutes;
        
        const pixelsPerMinute = contentHeight / (totalHours * minutesPerHour);
        
        const topPixels = eventStart * pixelsPerMinute;
        const heightPixels = (eventEnd - eventStart) * pixelsPerMinute;
        
        const top = (topPixels / contentHeight) * 100;
        const height = (heightPixels / contentHeight) * 100;
        
        return { top, height };
    };

    const renderTimeLines = () => (
        Array.from({ length: endHour - startHour + 1 }, (_, i) => (
            <div
                key={`timeline-${i}`}
                className="time-line"
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: `${(i * hourHeight)}px`,
                    borderTop: "1px solid #e5e5e5",
                    width: "100%",
                    pointerEvents: "none",
                    zIndex: 1
                }}
            />
        ))
    );

    const borderSpacing = 10;
    const totalSpacing = (headers.length + 1) * borderSpacing;
    const timeColumnWidth = 80; // Increased from 60 to accommodate AM/PM format
    const availableWidth = width - totalSpacing;
    const dayColumnWidth = (availableWidth - timeColumnWidth) / headers.length;
    
    const contentHeight = height - 50;
    const hourHeight = contentHeight / (endHour - startHour);

    return (
        <div className="schedule" ref={scheduleRef} style={{ 
            width: `${width}px`, 
            height: `${height}px`,
            margin: "0 auto",
            position: "relative"
        }}>
            <div className="schedule-container" style={{ height: "100%" }}>
                <table className="schedule-table" style={{ 
                    height: "100%",
                    width: "100%",
                    tableLayout: "fixed",
                    borderCollapse: "separate",
                    borderSpacing: `${borderSpacing}px`,
                    backgroundColor: "#f0f0f0",
                    borderRadius: "20px",
                    overflow: "hidden"
                }}>
                    <colgroup>
                        <col style={{ width: `${timeColumnWidth}px` }} />
                        {headers.map((_, index) => (
                            <col key={index} style={{ width: `${dayColumnWidth}px` }} />
                        ))}
                    </colgroup>
                    <thead>
                        <tr style={{ height: "50px" }}>
                            <th className="time-header" style={{ 
                                width: `${timeColumnWidth}px`,
                                backgroundColor: "#ffffff",
                                borderRadius: "10px",
                                padding: "15px",
                                textAlign: "center",
                                fontWeight: "bold"
                            }}>
                                Time
                            </th>
                            {headers.map((header, index) => (
                                <th key={index} style={{ 
                                    width: `${dayColumnWidth}px`,
                                    backgroundColor: "#ffffff",
                                    borderRadius: "10px",
                                    padding: "15px",
                                    textAlign: "center",
                                    fontWeight: "bold"
                                }}>
                                    {header.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{ height: `${contentHeight}px` }}>
                            <td className="time-column" style={{ 
                                width: `${timeColumnWidth}px`,
                                backgroundColor: "#ffffff",
                                borderRadius: "10px",
                                padding: 0,
                                verticalAlign: "top"
                            }}>
                                {timeSlots.map((time, index) => (
                                    <div 
                                        key={index} 
                                        className="time-slot" 
                                        style={{ 
                                            height: `${hourHeight}px`,
                                            fontSize: "0.85em",
                                            color: "#666",
                                            display: "flex",
                                            alignItems: "flex-start",
                                            justifyContent: "center",
                                            padding: "5px",
                                            boxSizing: "border-box",
                                            borderTop: index === 0 ? "none" : "1px solid #ffffff00"
                                        }}
                                    >
                                        {time}
                                    </div>
                                ))}
                            </td>
                            {headers.map((header) => {
                                const dayEvents = groupedEvents.get(header.dayIndex) || [];
                                return (
                                    <td 
                                        key={header.dayIndex} 
                                        className="day-column" 
                                        style={{ 
                                            width: `${dayColumnWidth}px`,
                                            height: `${contentHeight}px`,
                                            backgroundColor: "#ffffff",
                                            borderRadius: "10px",
                                            padding: 0,
                                            verticalAlign: "top",
                                            position: "relative"
                                        }}
                                    >
                                        {renderTimeLines()}
                                        {dayEvents.map((event) => {
                                            const { top, height } = calculateEventPosition(event);
                                            return (
                                                <div
                                                    key={event.id}
                                                    className="schedule-event"
                                                    style={{
                                                        backgroundColor: event.color || '#e0e0e0',
                                                        top: `${top}%`,
                                                        height: `${height}%`,
                                                        minHeight: "20px",
                                                        position: "absolute",
                                                        left: "5px",
                                                        right: "5px",
                                                        zIndex: 2,
                                                        borderRadius: "5px",
                                                        cursor: "pointer",
                                                        overflow: "hidden",
                                                        transition: "transform 0.2s ease-in-out",
                                                        fontSize: "0.8em"
                                                    }}
                                                    onClick={() => handleEventClick(event)}
                                                >
                                                    {renderEventContent(event)}
                                                </div>
                                            );
                                        })}
                                    </td>
                                );
                            })}
                        </tr>
                    </tbody>
                </table>
            </div>
            {selectedEvent && (
                <EventPopup 
                    event={selectedEvent} 
                    onClose={() => setSelectedEvent(null)} 
                />
            )}
        </div>
    );
};

export default Schedule;