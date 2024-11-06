import { ScheduleEvent } from '../types';

// Helper function to sort the events by start time
export const sortEvents = (events: ScheduleEvent[]): ScheduleEvent[] => {
  return events.sort((a, b) => {
    // Convert time strings to comparable numbers
    const aTime = timeToMinutes(a.start);
    const bTime = timeToMinutes(b.start);
    return aTime - bTime;
  });
};

// Helper function to convert time string to minutes since midnight
export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// Helper function to convert minutes to time string
export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

// Helper function to find the earliest start time and latest end time of the schedule
export const findStartEndTimes = (events: ScheduleEvent[]): { startHour: number, endHour: number } => {
  if (!events.length) {
      return { startHour: 8, endHour: 14 }; // Default business hours if no events
  }

  let earliestStart = 24 * 60; // Initialize to end of day
  let latestEnd = 0;

  events.forEach(event => {
      const startMinutes = timeToMinutes(event.start);
      const endMinutes = timeToMinutes(event.end);

      if (startMinutes < earliestStart) {
          earliestStart = startMinutes;
      }

      if (endMinutes > latestEnd) {
          latestEnd = endMinutes;
      }
  });

  // Round down to the nearest hour for start time
  const startHour = Math.max(0, Math.floor(earliestStart / 60));
  
  // Round up to the next hour for end time and add 1 hour padding
  const endHour = Math.min(24, Math.ceil(latestEnd / 60));

  // Ensure there's always at least 3 hours shown
  if (endHour - startHour < 3) {
      return {
          startHour: Math.max(0, startHour - 1),
          endHour: Math.min(24, endHour + 1)
      };
  }

  return { startHour, endHour };
};
