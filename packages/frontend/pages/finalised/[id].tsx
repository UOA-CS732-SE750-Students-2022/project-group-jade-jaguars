import { Paper, Grid, Box, Container, Group, Button } from '@mantine/core';
import axios from 'axios';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../src/context/AuthContext';
import { getEvent } from '../../helpers/apiCalls/apiCalls';
import Event from '../../types/Event';
const FinalisedEventPageWithId: NextPage = () => {
  const router = useRouter();
  const { authToken } = useAuth();
  const { id } = router.query;
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  useEffect(() => {
    // const eventId = id!.toString();
    const eventId = '62e583a9-5df8-4b06-ae2f-5efd66df300d';
    const getEventMethod = async () => {
      const data: Event = await getEvent(eventId);
      setTitle(data.title);
      data.description && setDescription(data.description);
      data.location && setLocation(data.location);
      // const startDate = data.availability.finalisedTime?.startDate;
      // const endDate = data.availability.finalisedTime?.endDate;
      const startDate = new Date();
      const endDate = new Date();
      endDate.setHours(startDate.getHours() + 2);
      const date = startDate?.toLocaleDateString('en-us', { day: 'numeric' });
      const month = startDate.toLocaleDateString('en-us', { month: 'numeric' });
      const year = startDate.toLocaleDateString('en-us', { year: 'numeric' });
      const startTime = startDate.toLocaleTimeString('en-us', {
        timeStyle: 'short',
        hour12: false,
      });
      const endTime = endDate.toLocaleTimeString('en-us', {
        timeStyle: 'short',
        hour12: false,
      });
      const formattedDate = `${year}.${month}.${date} ${startTime}-${endTime} NZDT`;
      setTime(formattedDate);
      // 2022.5.4 13:30-15:30 NZDT
      //TODO convert timebracket to string
      console.log(await data);
    };
    getEventMethod();
  }, []);
  return (
    <Container>
      <h1>Your event is finalised!</h1>
      <Box sx={{ maxWidth: 700 }} mx="auto">
        <Paper p="xl" radius="md" withBorder>
          <Grid className="m-[50px] text-center">
            <Grid.Col>
              <h2 className="text-7xl">{title}</h2>
            </Grid.Col>
            <Grid.Col>
              <h3 className="text-bold text-2xl">{time}</h3>
            </Grid.Col>
            <Grid.Col>
              <h4 className="italic text-md">{description}</h4>
            </Grid.Col>
            <Grid.Col>
              {location != '' && (
                <>
                  <p className="mb-[-5px]">See you at</p>
                  <h3 className="text-xl">{location}</h3>
                </>
              )}
            </Grid.Col>
            <Grid.Col>
              <Group position="right" mt="lg">
                <Button
                  classNames={{
                    filled: 'bg-[#FFDF74] hover:bg-[#FFDF74]',
                    label: 'text-black',
                  }}
                >
                  Add to calendar
                </Button>
              </Group>
            </Grid.Col>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};
export default FinalisedEventPageWithId;
