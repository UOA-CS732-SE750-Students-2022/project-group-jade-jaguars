import { Container, Grid, Group } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { NextPage } from 'next';
import React, { useEffect } from 'react';
import EventForm from '../../components/EventForm';
import { useAuth } from '../../src/context/AuthContext';

interface FormValues {
  title: string;
  dateRange: [Date | null, Date | null];
  timeRange: [Date, Date];
  description?: string;
  location?: string;
  newTeam: boolean;
  newTeamName?: string;
  teamName?: string;
}

const CreateEventPage: NextPage = () => {
  const { userId, authToken } = useAuth();
  const teamData = [
    { id: 'asdfasdf', label: '750' },
    { id: 'asdfasdf', label: '701' },
    { id: 'asdfasdf', label: '726' },
  ];
  const form = useForm<FormValues>({
    initialValues: {
      title: '',
      dateRange: [new Date(), new Date()],
      timeRange: [new Date(), new Date()],
      description: '',
      location: '',
      newTeam: false,
      teamName: '',
      newTeamName: '',
    },
  });
  //   useEffect(() => {
  //     console.log(form.values);
  //   }, [form]);
  const createNewTeam = async () => {
    //console.log(form.values);
    const response = await fetch('http://localhost:3000/api/v1/team', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + authToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: form.values.newTeamName,
        admin: userId,
        description: 'a new team',
      }),
    });
    const data = await response.json();
    return await data;
  };
  const onCreateEvent = async () => {
    let teamId;
    if (form.values.newTeam) {
      const data = await createNewTeam();
      teamId = data.id;
    } else {
      teamId = teamData.find((o) => o.label == form.values.teamName)!.id;
    }
    //TODO post request to create event
    console.log(teamId);
  };
  return (
    <Container>
      <h1>Create Event</h1>
      <Grid>
        <Grid.Col>
          <EventForm
            teamData={teamData}
            form={form}
            onCreateEvent={onCreateEvent}
          />
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default CreateEventPage;
