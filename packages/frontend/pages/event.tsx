import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import EventCard from '../components/EventCard/EventCard';
import EventDetailsCard from '../components/EventDetailsCard/EventDetailsCard';
import {
  getEventParticipants,
  getEventsByUserId,
  getUser,
  searchEvent,
} from '../helpers/apiCalls/apiCalls';
import { useAuth } from '../src/context/AuthContext';
import Event from '../types/Event';
import Member from '../types/Member';

export interface EventUser {
  firstName: string;
  lastName: string;
  id: string;
  events: string[];
}

const Event: NextPage = () => {
  const { userId, signedIn } = useAuth();

  const [selectedEvent, setSelectedEvent] = useState<Event>();
  const [displayDetail, setDisplayDetail] = useState<boolean>(false);

  const [events, setEvents] = useState<Event[]>();

  const getEvents = async () => {
    const events: Event[] = await getEventsByUserId(userId);
    if (events) {
      Object.values(events).map(async (event: Event) => {
        console.log(event.id);
        const eventId = event.id;
        const users: EventUser[] = await getEventParticipants(eventId);
        let participants: Member[] = [];
        Object.values(users).map((user: EventUser) => {
          participants.push({
            name: user.firstName + ' ' + user.lastName,
          });
        });
        event.participants = participants;
      });
      setEvents(events);
    }
  };

  useEffect(() => {
    getEvents();
  }, [signedIn]);

  const handleCardOnClick = (event: Event) => {
    setSelectedEvent(event);
    setDisplayDetail(true);
  };

  return (
    <div className="flex flex-row gap-20 w-full h-full p-10 bg-backgroundgrey">
      <section className="w-fit">
        <h1>Events</h1>
        <div className="flex flex-col gap-8">
          {events != undefined ? (
            events.map((event, index) => {
              return (
                <EventCard
                  key={index}
                  title={event.title}
                  date={event.date ? event.date : new Date(event.startDate)}
                  timeRange={[
                    new Date(event.startDate),
                    new Date(event.endDate),
                  ]}
                  participants={event.participants ? event.participants : []}
                  description={event.description}
                  onClick={() => {
                    handleCardOnClick(event);
                  }}
                />
              );
            })
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </section>
      <section className="flex flex-auto">
        <div className="fixed mt-16">
          {displayDetail && (
            <EventDetailsCard
              title={selectedEvent?.title}
              date={
                selectedEvent?.date
                  ? selectedEvent.date
                  : new Date(selectedEvent!.startDate)
              }
              timeRange={[
                new Date(selectedEvent!.startDate),
                new Date(selectedEvent!.endDate),
              ]}
              description={selectedEvent?.description}
              location={selectedEvent?.location}
              participants={
                selectedEvent?.participants ? selectedEvent.participants : []
              }
              onParticipantClick={() => {
                console.log('click');
              }}
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default Event;
