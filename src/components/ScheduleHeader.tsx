import React from "react";

interface ScheduleHeaderProps {
    headers: string[];
}

// ScheduleHeader component renders the header row of the schedule
const ScheduleHeader: React.FC<ScheduleHeaderProps> = ({ headers }) => {
    return (
        <div className="schedule-header">
            {/* Map through the headers array and render each header */}
            {headers.map((header, index) => (
                <div key={index} className="header-cell">
                    {header}
                </div>
            ))}
        </div>
    );
};

export default ScheduleHeader;
