import Link from 'next/link';
import { Paper, Grid, Box, Container, Group, Button } from '@mantine/core';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { exportCalender, getEvent } from '../../helpers/apiCalls/apiCalls';
import Event from '../../types/Event';
import { formatTimeBracket, getTZDate } from '../../helpers/timeFormatter';
import { useAuth } from '../../src/context/AuthContext';

const FinalisedEventPage: NextPage = () => {
  const router = useRouter();
  const {
    query: { eventId },
  } = router;
  const [title, setTitle] = useState('');
  const [time, setTime] = useState<String>('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const { user } = useAuth();

  // XXX:  Download the .ical file, manually create a DOM element and click it
  const onClickAddToCalendar = async () => {
    const element = document.createElement('a');
    const userId = user?.uid as string;
    const calendar = await exportCalender(userId);
    const file = new Blob([calendar], {
      type: 'ical',
    });
    element.href = URL.createObjectURL(file);
    element.download = 'Event.ical';
    document.body.appendChild(element);
    element.click();
  };

  useEffect(() => {
    const getEventMethod = async () => {
      const data: Event = await getEvent(eventId!.toString());
      setTitle(data.title);
      data.description && setDescription(data.description);
      data.location && setLocation(data.location);
      const startDate = getTZDate(
        new Date(data.availability!.finalisedTime!.startDate),
      );
      const endDate = getTZDate(
        new Date(data.availability!.finalisedTime!.endDate),
      );

      const formattedDate = formatTimeBracket(startDate, endDate);
      setTime(formattedDate);
    };
    getEventMethod();
  }, []);
  return (
    <Container>
      <div className="flex flex-col w-full justify-center py-28 items-center">
        <h1>Your event is finalised!</h1>
        <Box sx={{ maxWidth: 700 }} mx="auto">
          <Paper p="xl" radius="md" withBorder>
            <Grid className="m-[50px] text-center">
              <Grid.Col>
                <h2 className="text-[35px]">{title}</h2>
              </Grid.Col>
              <Grid.Col>
                <h3 className="text-bold text-2xl">{time}</h3>
              </Grid.Col>
              <Grid.Col>
                <h4 className="text-md">{description}</h4>
              </Grid.Col>
              <Grid.Col>
                {location != '' && (
                  <>
                    <p className="mb-[-5px]">See you at</p>
                    <h3 className="text-xl mt-2">{location}</h3>
                  </>
                )}
              </Grid.Col>
              <Grid.Col>
                <Group position="center" mt="lg">
                  <Button
                    classNames={{
                      filled: 'bg-[#FFDF74] hover:bg-[#FFDF74]',
                      label: 'text-black',
                    }}
                  >
                    <p className="font-medium text-md">Add to calendar</p>
                  </Button>
                </Group>
              </Grid.Col>
            </Grid>
          </Paper>
        </Box>
      </div>
    </Container>
  );
};
export default FinalisedEventPage;
