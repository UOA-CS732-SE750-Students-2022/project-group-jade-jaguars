import { Modal } from '@mantine/core';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import CustomButton from '../components/Buttons/CustomButton';
import CustomCalendar, {
  EventInterface,
} from '../components/CustomCalendar/CustomCalendar';
import { events } from '../components/CustomCalendar/sampleEvents';
import EventCard, { Sizes } from '../components/EventCard/EventCard';
import EventDetailsCard from '../components/EventDetailsCard/EventDetailsCard';
import { SearchBar } from '../components/SearchBar';
import { TeamCheckBox } from '../components/TeamCheckBox';
import {
  getUser,
  getUserTeams,
  searchEvent,
} from '../helpers/apiCalls/apiCalls';
import { getToken } from '../helpers/apiCalls/helpers';
import { useAuth } from '../src/context/AuthContext';
import Event, { AttendeeAvailability } from '../types/Event';
import Member from '../types/Member';
import Team from '../types/Team';

const Dashboard: NextPage = () => {
  const [eventsList, setEventsList] = useState<EventInterface[]>();

  const { userId, authToken, user, login, logout, signedIn, setUser } =
    useAuth();

  const [teamsList, setTeamsList] = useState<Team[]>();

  const [teamCalendar, setTeamCalendar] = useState<EventInterface[]>([]);

  const participants: Member[] = [
    {
      name: 'amy',
    },
    {
      name: 'sam',
    },
  ];

  const eventList = [
    {
      title: 'Event 1',
      date: new Date('01/02/2022'),
      timeRange: [new Date('01/02/2022, 13:30'), new Date('01/02/2022, 15:30')],
      description: 'this is a description',
      participants: participants,
    },
    {
      title: 'Event 2',
      date: new Date('01/02/2022'),
      timeRange: [new Date('01/02/2022, 13:30'), new Date('01/02/2022, 15:30')],
      description: 'this is a description',
      participants: participants,
    },
    {
      title: 'Event 3',
      date: new Date('01/02/2022'),
      timeRange: [new Date('01/02/2022, 13:30'), new Date('01/02/2022, 15:30')],
      description: 'this is a description',
      participants: participants,
    },
    {
      title: 'Event 4',
      date: new Date('01/02/2022'),
      timeRange: [new Date('01/02/2022, 13:30'), new Date('01/02/2022, 15:30')],
      description: 'this is a description',
      participants: participants,
    },
  ];

  const teams = [
    {
      title: 'SOFTENG750',
    },
    {
      title: 'SOFTENG701',
    },
    {
      title: 'SOFTENG754',
    },
    {
      title: 'PART4PROJECT',
    },
  ];

  const [eventSelected, setEventSelected] = useState<EventInterface>();
  const [modalOpen, setModalOpen] = useState(false);

  const [searchValue, setSearchValue] = useState<string>('');

  let eventParticipants: Member[] = [];

  const handleEventCardOnclick = (event: EventInterface) => {
    setEventSelected(event);
    setModalOpen(true);
  };

  const getEvents = async () => {
    const userEvents: EventInterface[] = await searchEvent({
      userId: userId,
    });

    userEvents &&
      Object.values(userEvents).map(async (event: any, index) => {
        event.id = index;
        event.start = new Date(event.startDate.replace('Z', ''));
        event.end = new Date(event.endDate.replace('Z', ''));
        event.date = undefined;
        event.participants = [];
        Object.values(event.availability.attendeeAvailability).map(
          async (value: any) => {
            const userId = value.attendee;
            setTimeout(async () => {
              const response = await getUser(userId).then((data) => {
                return { name: data.firstName + ' ' + data.lastName };
              });
              event.participants = [...event.participants, response];
            }, 1000);
            // eventParticipants.push(response)
          },
        );
      });

    // userEvents && Object.values(userEvents).map(async (event: any) => {
    //   if (eventParticipants) {
    //     event.participants = eventParticipants;
    //   }
    //   console.log("event participants: ", event.participants)
    // })

    setEventsList(userEvents);
  };

  const getTeams = async () => {
    const teams = await getUserTeams(userId);
    if (teams) {
      setTeamsList(teams.teams);
    }
  };

  useEffect(() => {
    getEvents();
    getTeams();
  }, [signedIn]);

  useEffect(() => {
    setTeamsCalendar();
  });

  console.log(eventsList);
  console.log('teams: ', teamsList);

  const setTeamsCalendar = () => {
    if (teamsList && eventsList && teamsList.length == 0) {
      teamsList.push({
        title: 'My Events',
        eventsList: eventsList,
        admin: userId,
      });
      setTeamCalendar(eventsList);
    }
  };

  console.log('search value: ' + searchValue);

  const handleSearch = async (value: string) => {
    const res = await searchEvent({ titleSubStr: value });
    console.log(res);
  };

  return (
    <div className="w-full h-screen overflow-hidden flex flex-row my-10">
      <section className="w-1/2 h-full flex flex-col justify-center p-10">
        <div>
          <SearchBar
            value={searchValue}
            setValue={setSearchValue}
            getValue={(value) => {
              handleSearch(value);
            }}
          />
        </div>
        <div className="h-[80vh] min-h-[500px] mt-10">
          <CustomCalendar
            events={teamCalendar ? teamCalendar : []}
            onParticipantClick={() => console.log('clicked')}
          />
        </div>
      </section>
      <section className="w-1/2 h-full pr-10 py-10">
        <div className="bg-white w-auto h-[52vh] min-w-[450px] min-h-[300px] rounded-xl p-10">
          <div className="flex flex-row items-center justify-between">
            <p className="font-medium text-[25px]">Upcomings</p>
            <CustomButton text="View All" onClick={() => {}} />
          </div>
          <div className="my-6 flex flex-col gap-2 h-4/5 overflow-scroll">
            {eventsList && eventsList.length > 0 ? (
              eventsList.map((event: EventInterface, index) => {
                console.log('event: ', event);
                console.log('participants: ', event.participants);
                return (
                  <EventCard
                    key={index}
                    size={Sizes.small}
                    title={event.title}
                    date={event.date ? event.date : undefined}
                    timeRange={[event.start, event.end]}
                    participants={event.participants}
                    description={event.description}
                    onClick={() => handleEventCardOnclick(event)}
                  />
                );
              })
            ) : (
              <div>No events found, create one now!</div>
            )}
          </div>
        </div>
        <div className="bg-white w-auto h-[30vh] mt-8 min-w-[450px] min-h-[320px] rounded-xl p-10">
          <div className="flex flex-row items-center justify-between">
            <p className="font-medium text-[25px]">Filter by teams</p>
            <CustomButton text="View All" onClick={() => {}} />
          </div>
          <div className="my-6 flex flex-col gap-2 h-3/4 overflow-scroll">
            {teamsList &&
              teamsList.map((team, index) => {
                return (
                  <TeamCheckBox
                    getCheckBoxValue={(value) => {
                      console.log(value);
                    }}
                    label={team.title}
                    order={index}
                  />
                );
              })}
          </div>
        </div>
      </section>
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
                onParticipantClick={() => {}}
              />
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
