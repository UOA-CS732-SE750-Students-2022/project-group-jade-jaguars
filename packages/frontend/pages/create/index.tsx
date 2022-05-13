import { Container, Grid } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import EventForm from '../../components/EventForm';
import { useAuth } from '../../src/context/AuthContext';
import { createTeam, createEvent } from '../../helpers/apiCalls/apiCalls';
import { CreateEventDTO, EventResponseDTO } from '../../types/Event';
import { GetUserTeamsResponseDTO } from '../../types/Team';
import { useRouter } from 'next/router';

// Create event form
interface FormValues {
  title: string;
  dateRange: [Date | null, Date | null];
  timeRange: [Date, Date];
  description?: string;
  location?: string;
  newTeam: boolean;
  newTeamName: string;
  teamName?: string;
  recurring: boolean;
}

// Proxy team type
interface Team {
  id: string;
  label: string;
}

const URL: string =
  (process.env.NEXT_PUBLIC_HOST as string) +
  (process.env.NEXT_PUBLIC_BASE as string);

const CreateEventPage: NextPage = () => {
  const router = useRouter();
  const { userId, authToken } = useAuth();
  const [teamList, setTeamList] = useState<Team[]>([]);
  const defaultStartTime = new Date();
  const defaultEndTime = new Date();
  defaultStartTime.setHours(9, 0, 0, 0);
  defaultEndTime.setHours(17, 0, 0, 0);

  const form = useForm<FormValues>({
    initialValues: {
      title: '',
      dateRange: [new Date(), new Date()],
      timeRange: [defaultStartTime, defaultEndTime],
      description: '',
      location: '',
      newTeam: false,
      teamName: '',
      newTeamName: '',
      recurring: false,
    },
  });

  useEffect(() => {
    // Fetch a list of existing teams in the database and display each of the names as an option
    const getTeamList = async () => {
      const response = await fetch(`${URL}/user/${userId}/team`, {
        headers: new Headers({
          Authorization: 'Bearer ' + authToken,
        }),
      });
      const data: GetUserTeamsResponseDTO = await response.json();
      const team = await data.teams.map((team) => {
        return { id: team._id, label: team.title };
      });
      setTeamList(team);
    };

    getTeamList();
    console.log(teamList);
  }, []);

  // Helper, create and event from using form data
  const createNewTeam = async () => {
    const data = await createTeam({
      title: form.values.newTeamName,
      admin: userId,
    });
    return data;
  };

  // Helper, create and event from using form data
  const createEventMethod = async (teamId?: string): EventResponseDTO => {
    const startDate = form.values.dateRange[0];
    const endDate = form.values.dateRange[1];
    const startTime = form.values.timeRange[0];
    const endTime = form.values.timeRange[1];
    startDate?.setHours(startTime.getHours(), startTime.getMinutes());
    endDate?.setHours(endTime.getHours(), endTime.getMinutes());
    const startDateText = startDate?.toISOString();
    const endDateText = endDate?.toISOString();

    const data: CreateEventDTO = {
      title: form.values.title,
      description: form.values.description,
      startDate: new Date(startDateText!),
      endDate: new Date(endDateText!),
      admin: userId,
      location: form.values.location,
      team: teamId,
    };

    const res = await createEvent(data);
    return res;
  };
  const onCreateEvent = async () => {
    let teamId = undefined;
    // Create a new team
    if (form.values.newTeam) {
      // TODO: Move validation for form so that invalid teams do not attempt to be created (invalid team name for example)
      const data = await createNewTeam();
      console.log(data);
      teamId = data.id;
    }
    // Find a team
    else {
      // If teamName exists, find it, otherwise create event without a team associated
      if (form.values.teamName) {
        teamId = teamList.find((o) => o.label == form.values.teamName)!.id;
      }
    }

    // Create event
    const response = await createEventMethod(teamId);

    // Forward router to event selection page
    router.push('/availability', {
      query: { eventId: `${response.id}` },
    });
  };
  return (
    <Container>
      <h1>Create Event</h1>
      <Grid>
        <Grid.Col>
          <EventForm
            teamData={teamList}
            form={form}
            onCreateEvent={onCreateEvent}
          />
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default CreateEventPage;
