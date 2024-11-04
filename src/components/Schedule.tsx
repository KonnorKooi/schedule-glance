import React, { useState, useEffect, useRef } from "react";
import { ScheduleProps, ScheduleEvent } from "../types";
import { sortEvents, findStartEndTimes } from "../utils/scheduleHelpers";

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
        setSelectedEvent(event);
        if (onEventClick) {
            onEventClick(event);
        }
    };

    const renderEventContent = (event: ScheduleEvent) => {
        if (event.customContent) {
            return <div dangerouslySetInnerHTML={{ __html: event.customContent }} />;
        }

        // Default template when title/body are provided
        if (event.title || event.body) {
            return (
                <div className="event-content" style={{ padding: "5px" }}>
                    {event.title && (
                        <h3 style={{ 
                            margin: 0, 
                            fontSize: "14px",
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                        }}>
                            {event.title}
                        </h3>
                    )}
                    {event.body && (
                        <p style={{ 
                            margin: "2px 0",
                            fontSize: "12px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
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

        // Fallback for events with no content
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
    const formatHour = (hour: number): string => (hour < 10 ? "0" : "") + hour + ":00";
    const timeSlots = Array.from({ length: endHour - startHour }, (_, i) => formatHour(i + startHour));

    const timeToMinutes = (time: string): number => {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
    };

    const calculateEventPosition = (event: ScheduleEvent) => {
        const totalMinutes = (endHour - startHour) * 60;
        const startMinutes = timeToMinutes(event.start) - timeToMinutes(`${startHour}:00`);
        const endMinutes = timeToMinutes(event.end) - timeToMinutes(`${startHour}:00`);
        const top = (startMinutes / totalMinutes) * 100;
        const height = ((endMinutes - startMinutes) / totalMinutes) * 100;
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

    const borderSpacing = 10; // From CSS border-spacing
    const totalSpacing = (headers.length + 1) * borderSpacing; // +1 for time column
    const timeColumnWidth = 60; // From CSS .time-header width
    const availableWidth = width - totalSpacing;
    const dayColumnWidth = (availableWidth - timeColumnWidth) / headers.length;

    useEffect(() => {
        setEvents(initialEvents);
        const { startHour: newStartHour, endHour: newEndHour } = findStartEndTimes(initialEvents);
        setStartHour(newStartHour);
        setEndHour(newEndHour);
    }, [initialEvents]);
    
    const contentHeight = height - 50;
    const hourHeight = contentHeight / (endHour - startHour);

    return (
        <div className="schedule" ref={scheduleRef} style={{ 
            width: `${width}px`, 
            height: `${height}px`,
            margin: "0 auto"
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
                <div className="event-popup">
                    {renderEventContent(selectedEvent)}
                    <button onClick={() => setSelectedEvent(null)}>Close</button>
                </div>
            )}
        </div>
    );
};

export default Schedule;
