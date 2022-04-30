import type { NextPage } from 'next';
import {
  Calendar as BigCalendar,
  Views,
  momentLocalizer,
} from 'react-big-calendar';
import { events } from '../components/CustomCalendar/sampleEvents';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import Basic from '../components/CustomCalendar/CustomCalendar';
import { useMemo } from 'react';
import CustomCalendar from '../components/CustomCalendar/CustomCalendar';
import EventForm from '../components/EventForm';

const CalendarPage: NextPage = () => {
  const localizer = momentLocalizer(moment);
  const defaultDate = useMemo(() => new Date(2015, 3, 12), []);

  return (
    <div className="h-[80vh] w-[750px] m-20">
      <EventForm
        onSelectChange={(value) => {
          console.log(value);
        }}
      />
    </div>
  );
};

export default CalendarPage;
