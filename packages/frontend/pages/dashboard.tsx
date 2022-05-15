import { Modal } from '@mantine/core';
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
  getEventsByUserId,
  getTeam,
  getUserTeams,
  searchEvent,
} from '../helpers/apiCalls/apiCalls';
import { useAuth } from '../src/context/AuthContext';
import Event from '../types/Event';
import Member from '../types/Member';
import Team from '../types/Team';
import { EventUser } from './event';

interface TeamCheckedItem {
  checked: boolean;
  teamId: string;
}
interface TeamCheckedList {
  [name: string]: TeamCheckedItem;
}

const Dashboard: NextPage = () => {
  const router = useRouter();

  const [eventsList, setEventsList] = useState<EventInterface[]>();

  const { userId, signedIn } = useAuth();

  const [teamsList, setTeamsList] = useState<Team[]>();

  const [teamCalendar, setTeamCalendar] = useState<EventInterface[]>([]);

  const [loading, setLoading] = useState(true);

  const [searchPopUp, setSearchPopUp] = useState(false);

  const [eventSelected, setEventSelected] = useState<EventInterface>();
  const [modalOpen, setModalOpen] = useState(false);

  const [searchValue, setSearchValue] = useState<string>('');

  const [teamCheckedList, setTeamCheckedList] = useState<TeamCheckedList>({});

  const [initialChecked, setInitialChecked] = useState(true);

  const [searchEvents, setSearchEvents] = useState<EventInterface[]>();

  const handleEventCardOnclick = (event: EventInterface) => {
    setEventSelected(event);
    setModalOpen(true);
  };

  const getEvents = async () => {
    setLoading(true);
    const events: Event[] = await getEventsByUserId(userId);
    if (events) {
      const eventList = await getCalendarFormatEvents(events);
      setEventsList(eventList);
      setLoading(false);
    }
  };

  const getCalendarFormatEvents = async (events: Event[]) => {
    await Promise.all(
      Object.values(events).map(async (event: Event) => {
        if (event && event.id != undefined) {
          const eventId = event.id;
          const users: EventUser[] = await getEventParticipants(eventId);
          let participants: Member[] = [];
          Object.values(users).map((user: EventUser) => {
            participants.push({
              name: user.firstName + ' ' + user.lastName,
            });
          });
          event.participants = participants;
        }
      }),
    );
    Object.values(events).map(async (event: any, index) => {
      if (event != undefined) {
        event.id = index;
        event.start = new Date(event.startDate.replace('Z', ''));
        event.end = new Date(event.endDate.replace('Z', ''));
        event.date = undefined;
        event.team = event.team;
      }
    });
    const eventList: EventInterface[] = events.map((event: any) => {
      return {
        id: event.id,
        title: event.title,
        start: new Date(event.startDate.replace('Z', '')),
        end: new Date(event.endDate.replace('Z', '')),
        date: event.date ? event.date : undefined,
        description: event.description ? event.description : '',
        location: event.location ? event.location : '',
        participants: event.participants,
        team: event.team,
      };
    });
    return eventList;
  };

  const getTeams = async () => {
    const teams = await getUserTeams(userId);
    if (teams) {
      setTeamsList(teams.teams);
      const teamCheckedList: TeamCheckedList = {};

      teams.teams.map((team: Team) => {
        teamCheckedList[team.title] = {
          checked: true,
          teamId: team._id!,
        };
      });
      setTeamCheckedList(teamCheckedList);
      getTeamCalendars(teamCheckedList);
    }
  };

  const getTeamEvents = async (teamId: string) => {
    const team: Team = await getTeam(teamId);
    const teamEventIds = team.events;
    let calendarEvents: Event[] = [];
    if (teamEventIds && teamEventIds?.length > 0) {
      const teamEvents = await Promise.all(
        Object.values(teamEventIds).map(async (eventId) => {
          const res = await getEvent(eventId);
          if (res != undefined) {
            calendarEvents.push(res);
          }
        }),
      );
    }
    return calendarEvents;
  };

  const getTeamCalendars = async (teamCheckedList: TeamCheckedList) => {
    setLoading(true);
    await Promise.all(
      Object.values(teamCheckedList).map(async (team) => {
        if (team.checked) {
          const events: Event[] = await getTeamEvents(team.teamId);
          const calendarEvents = await getCalendarFormatEvents(events);
          setEventsList(
            eventsList ? eventsList.concat(calendarEvents) : calendarEvents,
          );
        }
      }),
    );
    setLoading(false);
  };

  useEffect(() => {
    if (userId) {
      getEvents();
      getTeams();
    }
  }, [signedIn]);

  useEffect(() => {
    setTeamsCalendar();
  });

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

  const handleSearch = async (value: string) => {
    const res = await searchEvent({ titleSubStr: value });
    const events = await getCalendarFormatEvents(res);
    setSearchPopUp(true);
    setSearchEvents(events);
  };

  const handleTeamEvent = async (
    checked: boolean,
    label: string,
    teamId: string,
  ) => {
    if (checked) {
      teamCheckedList[label] = {
        checked: true,
        teamId: teamId,
      };
      setTeamCheckedList(teamCheckedList);
      await getTeamCalendars(teamCheckedList);
    } else {
      teamCheckedList[label] = {
        checked: false,
        teamId: teamId,
      };
      let events = eventsList;
      setEventsList(
        events!.filter(function (event: EventInterface) {
          return event.team != teamId;
        }),
      );
      setTeamCheckedList(teamCheckedList);
    }
  };

  const handleEventCardViewAvailability = (event: EventInterface) => {
    router.push({
      pathname: '/availability/',
      query: { eventId: event.id },
    });
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
            events={eventsList ? eventsList : []}
            onParticipantClick={() => console.log('clicked')}
          />
        </div>
      </section>
      <section className="w-1/2 h-full pr-10 py-10">
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
                eventsList.slice(0, 10).map((event: EventInterface, index) => {
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
                      onViewAvailability={() =>
                        handleEventCardViewAvailability(event)
                      }
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
            {teamsList &&
              teamsList.map((team, index) => {
                return (
                  <TeamCheckBox
                    key={index}
                    initialChecked={initialChecked}
                    handleClick={(checked, label, teamId) => {
                      handleTeamEvent(checked, label, teamId);
                      setInitialChecked(false);
                    }}
                    label={team.title}
                    order={index}
                    teamId={team._id!}
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
                date={
                  eventSelected.date ? eventSelected.date : eventSelected.start
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
      >
        <div className="flex flex-col gap-2 h-[80%] overflow-scroll">
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
                  onClick={() => {}}
                />
              );
            })}
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
