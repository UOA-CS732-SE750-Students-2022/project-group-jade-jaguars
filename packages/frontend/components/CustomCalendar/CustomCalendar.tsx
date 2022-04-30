import React, { useState } from 'react';
import { Modal } from '@mantine/core';
import {
  Calendar,
  Views,
  momentLocalizer,
  DateLocalizer,
} from 'react-big-calendar';
import { events } from './sampleEvents';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import Member from '../../types/Member';
import EventDetailsCard from '../EventDetailsCard/EventDetailsCard';
export interface EventInterface {
  id: any;
  title: string;
  allDay?: boolean;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
  reminder?: string;
  participants: Member[];
}
interface CustomCalendarInterface {
  events: EventInterface[];
  localizer?: DateLocalizer;
  teamHexColour?: string;
  onParticipantClick: (props?: any) => void;
}

/**
 * This is the custom calendar component for displaying scheduled events
 * @param events A list of events with all required information with type EventInterface
 * @param localizer A localizer required by the react-big-calendar component
 * @param teamHexColour Hex code of the custom team colour
 * @param onParticipantClick Function required for the EventDetailsCard component
 *
 * @author Raina Song (rainasong)
 */
const CustomCalendar = (props: CustomCalendarInterface) => {
  const { localizer, teamHexColour, onParticipantClick } = props;
  const calLocalizer = localizer ? localizer : momentLocalizer(moment);
  const defaultColour = '#99c08b';
  const [modalOpen, setModalOpen] = useState(false);
  const [eventSelected, setEventSelected] = useState<EventInterface>();

  const onSelectEvent = (event: EventInterface) => {
    console.log(event);
    setEventSelected(event);
    setModalOpen(true);
  };

  const eventStyleGetter = () => {
    let style = {
      backgroundColor: teamHexColour ? teamHexColour : defaultColour,
    };
    return {
      style: style,
    };
  };

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
        {eventSelected && (
          <Modal
            centered
            opened={modalOpen}
            onClose={() => setModalOpen(false)}
            radius={'lg'}
            size={'10'}
          >
            <div>
              <EventDetailsCard
                isModal={true}
                title={eventSelected.title}
                date={eventSelected.start}
                timeRange={[eventSelected.start, eventSelected.end]}
                description={
                  eventSelected.description
                    ? eventSelected.description
                    : 'No description'
                }
                location={
                  eventSelected.location
                    ? eventSelected.location
                    : 'No location'
                }
                participants={eventSelected.participants}
                onParticipantClick={() => onParticipantClick()}
              />
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default CustomCalendar;
