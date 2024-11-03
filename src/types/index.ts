export interface ScheduleEvent {
    id: string;
    days: number[];
    start: string;
    end: string;
    color?: string;
    customContent?: string;
    title?: string;    // New optional title field
    body?: string;     // New optional body field
    [key: string]: any;
}

export interface ScheduleProps {
    events: ScheduleEvent[];
    width?: number;        // New: Optional width in pixels
    height?: number;       // New: Optional height in pixels
    onEventClick?: (event: ScheduleEvent) => void;
    onAddEvent?: (event: ScheduleEvent) => void;
    onRemoveEvent?: (eventId: string) => void;
    headers?: { label: string; dayIndex: number }[];
}
