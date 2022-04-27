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
  teamHexColour?: string;
}

const CustomCalendar = (props: CustomCalendarInterface) => {
  const { localizer, teamHexColour } = props;
  const calLocalizer = localizer ? localizer : momentLocalizer(moment);
  const defaultColour = '#99c08b';

  const onSelectEvent = (event: Object) => {
    console.log(event);
  };

  const eventStyleGetter = () => {
    let style = {
      backgroundColor: teamHexColour ? teamHexColour : defaultColour,
    }
    return {
      style: style
    }
  }

  return (
    <div className="w-full h-full">
      <Calendar
        events={events}
        eventPropGetter={eventStyleGetter}
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
