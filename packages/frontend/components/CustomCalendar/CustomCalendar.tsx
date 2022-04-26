import React from 'react';
import {
  Calendar,
  Views,
  momentLocalizer,
  DateLocalizer,
} from 'react-big-calendar';
import events from './sampleEvents';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';

interface CustomCalendarInterface {
  events: {
    id: any;
    title: string;
    allDay?: boolean;
    start: Date;
    end: Date;
  }[];
  localizer?: DateLocalizer;
}

const CustomCalendar = (props: CustomCalendarInterface) => {
  const { localizer } = props;
  const calLocalizer = localizer ? localizer : momentLocalizer(moment);

  const onSelectEvent = (event: Object) => {
    console.log(event);
  };

  return (
    <div className="h-full w-full">
      <Calendar
        events={events}
        defaultView={Views.WEEK}
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        localizer={calLocalizer}
        defaultDate={new Date()}
        onSelectEvent={(event) => onSelectEvent(event)}
      />
    </div>
  );
};

export default CustomCalendar;
