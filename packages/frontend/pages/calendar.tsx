import type { NextPage } from 'next';
import {
  Calendar as BigCalendar,
  Views,
  momentLocalizer,
} from 'react-big-calendar';
import events from '../components/CustomCalendar/sampleEvents';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import Basic from '../components/CustomCalendar/CustomCalendar';
import { useMemo } from 'react';
import CustomCalendar from '../components/CustomCalendar/CustomCalendar';

const CalendarPage: NextPage = () => {
  const localizer = momentLocalizer(moment);
  const defaultDate = useMemo(() => new Date(2015, 3, 12), []);

  return (
    <div className="h-[80vh] w-[750px] m-20">
      {/* <CustomCalendar /> */}
      {/* <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
        /> */}
      {/* <Calendar
        defaultDate={defaultDate}
        defaultView={Views.WEEK}
        events={events}
        localizer={localizer}
        step={15}
        timeslots={8}
      /> */}
      {/* <Basic localizer={localizer} /> */}
      {/* <BigCalendar 
        selectable
        localizer={localizer}
        events={events}
        defaultView={Views.MONTH}
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        defaultDate={new Date()}
      /> */}
      <CustomCalendar />
    </div>
  );
};

export default CalendarPage;