import { Container, Modal } from '@mantine/core';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import CustomButton from '../components/Buttons/CustomButton';
import CustomCalendar, {
  EventInterface,
} from '../components/CustomCalendar/CustomCalendar';
import EventCard, { Sizes } from '../components/EventCard/EventCard';
import EventDetailsCard from '../components/EventDetailsCard/EventDetailsCard';
import { SearchBar } from '../components/SearchBar';
import { TeamCheckBox } from '../components/TeamCheckBox';
import {
  getEvent,
  getEventParticipants,
  getUserTeams,
  searchEvent,
} from '../helpers/apiCalls/apiCalls';
import { useAuth } from '../src/context/AuthContext';
import Event from '../types/Event';
import Member from '../types/Member';
import Team from '../types/Team';
import { EventUser } from './event';

interface TeamMap {
  [teamId: string]: {
    title: string;
    events: EventInterface[];
    checked?: boolean;
  };
}

const Dashboard: NextPage = () => {
  const router = useRouter();
  const { userId, signedIn } = useAuth();

  const [teamMap, setTeamMap] = useState<TeamMap>({});
  const [eventsList, setEventsList] = useState<EventInterface[]>([]);
  const [initialChecked, setInitialChecked] = useState(true);
  const [loading, setLoading] = useState(true);

  const [searchPopUp, setSearchPopUp] = useState(false);
  const [searchEvents, setSearchEvents] = useState<EventInterface[]>();
  const [searchValue, setSearchValue] = useState<string>('');

  const [modalOpen, setModalOpen] = useState(false);

  const [eventSelected, setEventSelected] = useState<EventInterface>();

  useEffect(() => {
    if (userId) {
      getTeams();
    }
  }, [signedIn]);

  const handleEventCardOnclick = (event: EventInterface) => {
    setEventSelected(event);
    setModalOpen(true);
  };

  const getTeams = async () => {
    const teams = await getUserTeams(userId);
    if (teams) {
      const teamsList: Team = teams.teams;
      const eventList: any[] = [];
      await Promise.all(
        Object.values(teamsList).map(async (team) => {
          const events = await getTeamEvents(team.events);
          eventList.push(...events);
          teamMap[team._id] = {
            title: team.title,
            events: events,
            checked: true,
          };
        }),
      );
      setEventsList(eventList);
      setTeamMap(teamMap);
      setLoading(false);
    }
  };

  const getTeamEvents = async (teamEvents: string[]) => {
    const teamEventIds = teamEvents;
    let calendarEvents: EventInterface[] = [];
    if (teamEventIds && teamEventIds?.length > 0) {
      await Promise.all(
        Object.values(teamEventIds).map(async (eventId, index) => {
          const event = await getEvent(eventId);
          if (event != undefined) {
            const eventId = event.id;
            const users: EventUser[] = await getEventParticipants(eventId);
            let participants: Member[] = [];
            Object.values(users).map((user: EventUser) => {
              participants.push({
                name: user.firstName + ' ' + user.lastName,
              });
            });
            event.participants = participants;
            event.id = index;
            event.start = new Date(event.startDate.replace('Z', ''));
            event.end = new Date(event.endDate.replace('Z', ''));
            event.date = event.date;
            event.team = event.team;
            event.description = event.description ? event.description : '';
            event.location = event.location ? event.location : '';
            calendarEvents.push(event);
          }
        }),
      );
    }
    return calendarEvents;
  };

  const getCalendarFormatEvents = async (event: any) => {
    const eventId = event.id;
    const users: EventUser[] = await getEventParticipants(eventId);
    let participants: Member[] = [];
    Object.values(users).map((user: EventUser) => {
      participants.push({
        name: user.firstName + ' ' + user.lastName,
      });
    });
    event.participants = participants;
    event.start = new Date(event.startDate.replace('Z', ''));
    event.end = new Date(event.endDate.replace('Z', ''));
    event.date = event.date;
    event.team = event.team;
    event.description = event.description ? event.description : '';
    event.location = event.location ? event.location : '';

    return event;
  };

  const getCalendarEvents = (teamMap: any) => {
    const eventList: any[] = [];
    Object.keys(teamMap).map((teamId) => {
      const team = teamMap[teamId];
      if (team.checked) {
        eventList.push(...team.events);
      }
    });
    return eventList;
  };

  const handleTeamEvent = (checked: boolean, label: string, teamId: string) => {
    if (checked) {
      teamMap[teamId].checked = true;
    } else {
      teamMap[teamId].checked = false;
    }
    const updatedList = getCalendarEvents(teamMap);
    setEventsList(updatedList);
  };

  const handleSearch = async (value: string) => {
    if (value) {
      const events = await searchEvent({ titleSubStr: value });
      const processedEvents: EventInterface[] = [];
      await Promise.all(
        Object.values(events).map(async (event) => {
          const res = await getCalendarFormatEvents(event);
          processedEvents.push(res);
        }),
      );
      setSearchPopUp(true);
      setSearchEvents(processedEvents);
    }
  };

  return (
    <Container className="ml-[100px] w-screen">
      <div className="w-[90vw] flex flex-row justify-start my-5">
        <section className="w-[50vw] min-w-[500px] h-full flex flex-col justify-start p-10">
          <div>
            <SearchBar
              value={searchValue}
              setValue={setSearchValue}
              getValue={(value) => {
                handleSearch(value);
              }}
            />
          </div>
          <div className="h-[79vh] min-h-[500px] w-full mt-10">
            <CustomCalendar
              events={eventsList ? eventsList : []}
              onParticipantClick={() => {}}
            />
          </div>
        </section>
        <section className="w-[40vw] h-full pr-10 py-10">
          <div className="bg-white w-auto h-[52vh] min-w-[450px] min-h-[300px] rounded-xl p-10">
            <div className="flex flex-row items-center justify-between">
              <p className="font-medium text-[25px]">Upcomings</p>
              <CustomButton
                text="View All"
                onClick={() => {
                  router.push('/event');
                }}
              />
            </div>
            <div className="my-6 flex flex-col gap-2 h-4/5 overflow-scroll">
              {!loading ? (
                eventsList && eventsList.length > 0 ? (
                  eventsList
                    .slice(0, 10)
                    .map((event: EventInterface, index) => {
                      return (
                        <EventCard
                          key={index}
                          size={Sizes.small}
                          title={event.title}
                          date={event.date ? event.date : event.start}
                          timeRange={[event.start, event.end]}
                          participants={event.participants}
                          description={event.description}
                          onClick={() => handleEventCardOnclick(event)}
                        />
                      );
                    })
                ) : (
                  <div>No events found, create one now!</div>
                )
              ) : (
                <div>Loading ...</div>
              )}
            </div>
          </div>
          <div className="bg-white w-auto h-[30vh] mt-8 min-w-[450px] min-h-[320px] rounded-xl p-10">
            <div className="flex flex-row items-center justify-between">
              <p className="font-medium text-[25px]">Filter by teams</p>
              <CustomButton
                text="View All"
                onClick={() => {
                  router.push('/team');
                }}
              />
            </div>
            <div className="my-6 flex flex-col gap-2 h-3/4 overflow-scroll">
              {!loading ? (
                teamMap &&
                Object.keys(teamMap).map((teamId, index) => {
                  return (
                    <TeamCheckBox
                      key={index}
                      initialChecked={initialChecked}
                      handleClick={(checked, label, teamId) => {
                        handleTeamEvent(checked, label, teamId);
                        console.log(checked, label);
                        setInitialChecked(false);
                      }}
                      label={teamMap[teamId].title}
                      order={index}
                      teamId={teamId}
                    />
                  );
                })
              ) : (
                <div>Loading ...</div>
              )}
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
                  date={
                    eventSelected.date
                      ? eventSelected.date
                      : eventSelected.start
                  }
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
        <Modal
          centered
          opened={searchPopUp}
          onClose={() => setSearchPopUp(false)}
          size={'800px'}
          radius={'lg'}
        >
          <div className="flex flex-col gap-2 h-[80%] overflow-scroll">
            <span className="text-xl font-medium mb-3 ml-2">
              Search Results:{' '}
            </span>
            {searchEvents &&
              searchEvents.map((event, index) => {
                return (
                  <EventCard
                    key={index}
                    size={Sizes.small}
                    title={event.title}
                    date={event.date ? event.date : event.start}
                    timeRange={[event.start, event.end]}
                    participants={event.participants}
                    description={event.description}
                    onClick={() => {
                      setModalOpen(true);
                      setEventSelected(event);
                    }}
                  />
                );
              })}
          </div>
        </Modal>
      </div>
    </Container>
  );
};

export default Dashboard;
