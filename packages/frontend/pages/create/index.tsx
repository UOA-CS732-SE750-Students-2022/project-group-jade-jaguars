import { Container, Grid } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import EventForm from '../../components/EventForm';
import { useAuth } from '../../src/context/AuthContext';
import { createTeam, createEvent } from '../../helpers/apiCalls/apiCalls';
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

interface Team {
  id: string;
  label: string;
}

const URL: string =
  (process.env.NEXT_PUBLIC_HOST as string) +
  (process.env.NEXT_PUBLIC_BASE as string);

const CreateEventPage: NextPage = () => {
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
      const data = await response.json();
      const team = await data.teams.map((team: any) => {
        return { id: team._id, label: team.title };
      });
      setTeamList(team);
    };
    getTeamList();
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
  const createEventMethod = async (teamId: string) => {
    const startDate = form.values.dateRange[0];
    const endDate = form.values.dateRange[1];
    const startTime = form.values.timeRange[0];
    const endTime = form.values.timeRange[1];
    startDate?.setHours(startTime.getHours(), startTime.getMinutes());
    endDate?.setHours(endTime.getHours(), endTime.getMinutes());
    const startDateText = startDate?.toISOString();
    const endDateText = endDate?.toISOString();

    const data = {
      title: form.values.title,
      description: form.values.description,
      startDate: new Date(startDateText!),
      endDate: new Date(endDateText!),
      admin: userId,
      location: form.values.location,
      team: teamId ? teamId : undefined,
    };

    const res = await createEvent(data);
    return res;
  };
  const onCreateEvent = async () => {
    let teamId;
    // Create a new team
    if (form.values.newTeam) {
      // TODO: Move validation for form so that invalid teams do not attempt to be created (invalid team name for example)
      const data = await createNewTeam();
      console.log(data);
      teamId = data.id;
    }
    // Find a team
    else {
      teamId = teamList.find((o) => o.label == form.values.teamName)!.id;
    }

    // Create event
    const response = await createEventMethod(teamId);
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
