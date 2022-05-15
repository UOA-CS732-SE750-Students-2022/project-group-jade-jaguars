import { useForm } from '@mantine/hooks';
import { Container, Modal } from '@mantine/core';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import EventCard, { Sizes } from '../components/EventCard/EventCard';
import EventDetailsCard from '../components/EventDetailsCard/EventDetailsCard';
import EventForm, { FormValues } from '../components/EventForm/EventForm';
import {
  deleteEvent,
  getEventParticipants,
  getEventsByUserId,
  updateEvent,
} from '../helpers/apiCalls/apiCalls';
import { useAuth } from '../src/context/AuthContext';
import Event from '../types/Event';
import Member from '../types/Member';
import { useRouter } from 'next/router';

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

  const [loading, setLoading] = useState(true);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const router = useRouter();
  // useEffect(() => {
  //   !signedIn && router.push('/login');
  // }, [signedIn]);

  let form = useForm<FormValues>({
    initialValues: {
      title: '',
      dateRange: [new Date(), new Date()],
      timeRange: [new Date(), new Date()],
      description: '',
      location: '',
      newTeam: false,
      teamName: '',
      newTeamName: '',
      newTeamDescription: '',
      recurring: false,
    },
  });

  const getEvents = async () => {
    setLoading(true);
    const events: Event[] = await getEventsByUserId(userId);
    if (events) {
      await Promise.all(
        Object.values(events).map(async (event: Event) => {
          const eventId = event.id;
          const users: EventUser[] = await getEventParticipants(eventId);
          let participants: Member[] = [];
          Object.values(users).map((user: EventUser) => {
            participants.push({
              name: user.firstName + ' ' + user.lastName,
            });
          });
          event.participants = participants;
        }),
      );
      setEvents(events);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      getEvents();
    }
  }, [signedIn]);

  const handleCardOnClick = (event: Event) => {
    setSelectedEvent(event);
    setDisplayDetail(true);
  };

  const handleEdit = () => {
    setEditModalOpen(true);
  };

  const handleDelete = () => {
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async (selectedEvent: Event) => {
    if (selectedEvent.id) {
      await deleteEvent(selectedEvent.id);
    }
    setDeleteModalOpen(false);
    refresh();
  };

  const handleEditSubmit = async (value: any) => {
    setEditModalOpen(false);

    const eventId = value.eventId;
    const formValue = value.form;

    const payload = {
      title: formValue.title,
      description: formValue.description,
      location: formValue.location,
    };

    if (formValue.title == '') {
      delete payload.title;
    }

    if (formValue.description == '') {
      delete payload.description;
    }

    if (formValue.location == '') {
      delete payload.location;
    }

    const res = await updateEvent(eventId, payload);
    form.reset();

    refresh();
  };

  const refresh = () => {
    window.location.reload();
  };

  const handleEventCardViewAvailability = (event: Event) => {
    router.push({
      pathname: '/availability/',
      query: { eventId: event.id },
    });
  };

  return (
    <Container className="ml-[100px]">
      <div className="flex flex-row gap-[3vw] w-full h-full p-10 bg-backgroundgrey">
        <section className="w-fit">
          <h1>Events</h1>
          <div className="flex flex-col gap-8">
            {!loading && events != undefined ? (
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
                    size={Sizes.large}
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
            {!loading && displayDetail && (
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
                onEdit={() => handleEdit()}
                onDelete={() => handleDelete()}
                onParticipantClick={() => {
                  console.log('participants');
                }}
              />
            )}
          </div>
        </section>
        <section>
          <Modal
            opened={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            size={'800px'}
          >
            <EventForm
              form={form}
              onSubmit={(value) => handleEditSubmit(value)}
              eventId={selectedEvent?.id}
            />
          </Modal>
          <Modal
            opened={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            centered
            size={'sm'}
          >
            <div>
              <p className=" text-xl font-medium text-center mx-8">
                Are you sure to delete this event?
              </p>
              <div className="flex flex-row my-8 justify-center gap-5">
                <button
                  className="py-2 px-3 rounded-md bg-secondary hover:bg-secondarylight"
                  onClick={() => {
                    setDeleteModalOpen(false);
                  }}
                >
                  <span>Cancel</span>
                </button>
                <button
                  className="py-2 px-3 rounded-md bg-secondary hover:bg-secondarylight"
                  onClick={() => handleDeleteConfirm(selectedEvent!)}
                >
                  <span>Confirm</span>
                </button>
              </div>
            </div>
          </Modal>
        </section>
      </div>
    </Container>
  );
};

export default Event;
