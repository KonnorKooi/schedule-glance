// components/Schedule.tsx
import React, { useState, useEffect, useRef } from "react";
import { ScheduleProps, ScheduleEvent } from "../types";
import { sortEvents, findStartEndTimes } from "../utils/scheduleHelpers";
import EventPopup from './EventPopup';

const Schedule: React.FC<ScheduleProps> = ({
    events: initialEvents,
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
        const displayHour = hour % 12 || 12;
        return `${displayHour}:00 ${period}`;
    };

    // Rest of the existing renderEventContent function remains the same
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
        const totalMinutes = (endHour - startHour) * 60;
        const eventStartMinutes = timeToMinutes(event.start) - (startHour * 60);
        const eventEndMinutes = timeToMinutes(event.end) - (startHour * 60);
        
        const top = (eventStartMinutes / totalMinutes) * 100;
        const height = ((eventEndMinutes - eventStartMinutes) / totalMinutes) * 100;
        
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
                    top: `${(i * 100) / (endHour - startHour)}%`,
                    borderTop: "1px solid #e5e5e5",
                    width: "100%",
                    pointerEvents: "none",
                    zIndex: 1
                }}
            />
        ))
    );

    const borderSpacing = '0.625rem'; // 10px equivalent
    const timeColumnWidth = '5rem'; // 80px equivalent

    return (
        <div className="schedule" ref={scheduleRef} style={{ 
            width: '100%',
            height: '100%',
            position: 'absolute',
            inset: 0,
        }}>
            <table className="schedule-table" style={{ 
                width: '100%',
                height: '100%',
                borderCollapse: "separate",
                borderSpacing: borderSpacing,
                backgroundColor: "#f0f0f0",
                borderRadius: "20px",
                tableLayout: "fixed"
            }}>
                <colgroup>
                    <col style={{ width: timeColumnWidth }} />
                    {headers.map((_, index) => (
                        <col key={index} />
                    ))}
                </colgroup>
                <thead>
                    <tr style={{ height: '3rem' }}>
                        <th className="time-header" style={{
                            backgroundColor: "#ffffff",
                            borderRadius: "10px",
                            padding: "0.9375rem",
                            textAlign: "center",
                            fontWeight: "bold"
                        }}>
                            Time
                        </th>
                        {headers.map((header, index) => (
                            <th key={index} style={{
                                backgroundColor: "#ffffff",
                                borderRadius: "10px",
                                padding: "0.9375rem",
                                textAlign: "center",
                                fontWeight: "bold"
                            }}>
                                {header.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr style={{ height: 'calc(100% - 3rem)' }}>
                        <td className="time-column" style={{ 
                            backgroundColor: "#ffffff",
                            borderRadius: "10px",
                            padding: 0,
                            verticalAlign: "top",
                            width: timeColumnWidth
                        }}>
                            {timeSlots.map((time, index) => (
                                <div 
                                    key={index} 
                                    className="time-slot" 
                                    style={{ 
                                        height: `${100 / timeSlots.length}%`,
                                        fontSize: "0.85em",
                                        color: "#666",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        padding: "0.3125rem",
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
                                        backgroundColor: "#ffffff",
                                        borderRadius: "10px",
                                        padding: 0,
                                        verticalAlign: "top",
                                        position: "relative",
                                        height: "100%"
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
                                                    minHeight: "1.25rem",
                                                    position: "absolute",
                                                    left: "0.3125rem",
                                                    right: "0.3125rem",
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