import { Paper, Grid, Box, Container, Group, Button } from '@mantine/core';
import axios from 'axios';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../src/context/AuthContext';
import { getEvent } from '../../helpers/apiCalls/apiCalls';
import Event from '../../types/Event';
import { formatTimeBracket, getTZDate } from '../../helpers/timeFormatter';

const FinalisedEventPage: NextPage = () => {
  const router = useRouter();
  const {
    query: { eventId },
  } = router;
  const [title, setTitle] = useState('');
  const [time, setTime] = useState<String>('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  useEffect(() => {
    const getEventMethod = async () => {
      const data: Event = await getEvent(eventId!.toString());
      setTitle(data.title);
      data.description && setDescription(data.description);
      data.location && setLocation(data.location);
      // const startDate = data.availability.finalisedTime?.startDate;
      // const endDate = data.availability.finalisedTime?.endDate;
      const startDate = getTZDate(data.availability!.finalisedTime!.startDate);
      const endDate = getTZDate(data.availability!.finalisedTime!.endDate);

      const formattedDate = formatTimeBracket(startDate, endDate);
      setTime(formattedDate);
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
export default FinalisedEventPage;
