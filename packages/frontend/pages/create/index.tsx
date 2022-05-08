import { Container, Grid, Group } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { NextPage } from 'next';
import React, { useEffect } from 'react';
import EventForm from '../../components/EventForm';
import { useAuth } from '../../src/context/AuthContext';
import axios from 'axios';

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
  const defaultStartTime = new Date();
  const defaultEndTime = new Date();
  defaultStartTime.setHours(9, 0, 0, 0);
  defaultEndTime.setHours(17, 0, 0, 0);
  const teamData = [
    { id: 'asdfasdf', label: '750' },
    { id: 'asdfasdf', label: '701' },
    { id: 'asdfasdf', label: '726' },
  ];
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
    },
  });
  useEffect(() => {
    console.log(form.values);
  }, [form]);
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
  const createEvent = async (teamId: string) => {
    const startDate = form.values.dateRange[0];
    const endDate = form.values.dateRange[1];
    const startTime = form.values.timeRange[0];
    const endTime = form.values.timeRange[1];
    startDate?.setHours(startTime.getHours(), startTime.getMinutes());
    endDate?.setHours(endTime.getHours(), endTime.getMinutes());
    const startDateText = startDate?.toISOString();
    const endDateText = endDate?.toISOString();
    console.log(startDateText);
    console.log(endDateText);
    // const data = {
    //   title: 'TEst',
    //   description: 'form.values.description',
    //   startDate: form.values.dateRange[0],
    //   endDate: form.values.dateRange[1],
    // };
    // const result = await axios.post(
    //   'http://localhost:3000/api/v1/event',
    //   data,
    //   {
    //     headers: {
    //       Authorization: 'Bearer ' + authToken,
    //     },
    //   },
    // );
    // const response = await fetch('http://localhost:3000/api/v1/event', {
    //   method: 'POST',
    //   headers: {
    //     Authorization: 'Bearer ' + authToken,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     // title: form.values.title,
    //     title: 'TEST',
    //     description: form.values.description,
    //     status: 'Pending',
    //     startDate: '2019-09-26T07:58:30.996+0200',
    //     endDate: 'form.values.dateRange[1]',
    //     // startDate: form.values.dateRange[0],
    //     // endDate: form.values.dateRange[1],
    //     availability: {
    //       potentialTimes: {
    //         startDate: '2019-09-26T07:58:30.996+0200',
    //         endDate: '2019-09-26T07:58:30.996+0200',
    //         // startDate: form.values.timeRange[0],
    //         // endDate: form.values.timeRange[1],
    //       },
    //       attendeeAvailability: [],
    //     },
    //     location: form.values.location,
    //     team: teamId,
    //     attendee: [],
    //   }),
    // });
  };
  const onCreateEvent = async () => {
    let teamId;
    if (form.values.newTeam) {
      const data = await createNewTeam();
      teamId = await data.id;
    } else {
      teamId = teamData.find((o) => o.label == form.values.teamName)!.id;
    }
    const response = await createEvent(teamId);
    //TODO post request to create event
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
