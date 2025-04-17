import React from 'react';
import CalendarioDias from './CalendarioDias';

const AgendaTab = ({
  selectedDay,
  setSelectedDay,
  getDaySchedule,
  renderDayInfo
}) => (
  <div className="w-100">
    <div className="mb-4"></div>
    <CalendarioDias
      onSelectDay={setSelectedDay}
      tileDisabled={({ date }) => {
        const daySchedule = getDaySchedule(date);
        return !daySchedule?.intervals?.length;
      }}
      tileClassName={({ date }) => {
        const daySchedule = getDaySchedule(date);
        return !daySchedule?.intervals?.length ? 'text-muted bg-light' : '';
      }}
      initialDate={selectedDay}
    />
    {renderDayInfo()}
  </div>
);

export default AgendaTab;
