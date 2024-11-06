// types/index.ts
export interface ScheduleEvent {
    id: string;
    days: number[];
    start: string;
    end: string;
    color?: string;
    customContent?: string;
    title?: string;
    body?: string;
    [key: string]: any;
}

export interface ScheduleProps {
    events: ScheduleEvent[];
    width?: number;
    height?: number;
    onEventClick?: (event: ScheduleEvent) => void;
    onAddEvent?: (event: ScheduleEvent) => void;
    onRemoveEvent?: (eventId: string) => void;
    headers?: { label: string; dayIndex: number }[];
    customPopupHandler?: (event: ScheduleEvent) => void;  // New prop for custom popup handling
    useDefaultPopup?: boolean;  // New prop to control default popup behavior
    emptyStateMessage?: string;  // New prop for custom empty state message
}


export interface EventPopupProps {
    event: ScheduleEvent;
    onClose: () => void;
}