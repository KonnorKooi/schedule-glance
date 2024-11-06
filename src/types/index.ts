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
    customPopupHandler?: (event: ScheduleEvent) => void;
    useDefaultPopup?: boolean;
    emptyStateMessage?: string;
}

export interface ScheduleRef {
    exportToPng: (filename?: string) => Promise<void>;
}

export interface EventPopupProps {
    event: ScheduleEvent;
    onClose: () => void;
}