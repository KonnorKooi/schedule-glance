import './styles/Schedule.css';
console.log('Schedule CSS imported');

export { default as Schedule } from './components/Schedule';
export { default as ScheduleHeader } from './components/ScheduleHeader';
export { default as ScheduleCell } from './components/ScheduleCell';
export { default as EventPopup } from './components/EventPopup';
export * from './types';
export type { ScheduleRef } from './types';  // Add this line if not already present