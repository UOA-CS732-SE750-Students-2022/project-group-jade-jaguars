import React, { useState } from 'react';
import { Modal } from '@mantine/core';
import {
  Calendar,
  Views,
  momentLocalizer,
  DateLocalizer,
} from 'react-big-calendar';
import events from './sampleEvents';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { formatTimeRange } from '../../helpers/timeFormatter';
interface EventInterface {
  id: any;
  title: string;
  allDay?: boolean;
  start: Date;
  end: Date;
}
interface CustomCalendarInterface {
  events: EventInterface[];
  localizer?: DateLocalizer;
  teamHexColour?: string;
}

const CustomCalendar = (props: CustomCalendarInterface) => {
  const { localizer, teamHexColour } = props;
  const calLocalizer = localizer ? localizer : momentLocalizer(moment);
  const defaultColour = '#99c08b';
  const [modalOpen, setModalOpen] = useState(false);
  const [eventSelected, setEventSelected] = useState<EventInterface>();

  const onSelectEvent = (event: EventInterface) => {
    setEventSelected(event);
    setModalOpen(true);
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
    <div className="flex w-full h-full">
      <Calendar
        events={events}
        eventPropGetter={eventStyleGetter}
        defaultView={Views.WEEK}
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        localizer={calLocalizer}
        defaultDate={new Date()}
        onSelectEvent={(event) => onSelectEvent(event)}
      />
      <div>
        <Modal centered opened={modalOpen} onClose={() => setModalOpen(false)} radius={'lg'}>
          <div className='flex flex-col mx-3'>
              <p className='text-xl font-medium'>{eventSelected?.title}</p>
              <p>{eventSelected?.start.toLocaleDateString()}, {formatTimeRange([eventSelected?.start, eventSelected?.end])}</p>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default CustomCalendar;
