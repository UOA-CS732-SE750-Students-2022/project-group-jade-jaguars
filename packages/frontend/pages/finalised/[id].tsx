import { Paper, Grid, Box, Container, Group, Button } from '@mantine/core';
import axios from 'axios';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useAuth } from '../../src/context/AuthContext';
const FinalisedEventPageWithId: NextPage = () => {
  const router = useRouter();
  const { authToken } = useAuth();
  const { id } = router.query;
  useEffect(() => {
    const getEvent = async () => {
      const data = await fetch(
        `http://localhost:3000/api/v1/event/4e403567-a47a-432b-bdef-5302c63d4e88`,
        {
          headers: new Headers({
            Authorization: 'Bearer ' + authToken,
          }),
        },
      );
      console.log(await data.json());
    };
    getEvent();
  }, []);
  return (
    <Container>
      <h1>Your event is finalised!</h1>
      <Box sx={{ maxWidth: 700 }} mx="auto">
        <Paper p="xl" radius="md" withBorder>
          <Grid className="m-[50px] text-center">
            <Grid.Col>
              <h2 className="text-7xl">Event Title</h2>
            </Grid.Col>
            <Grid.Col>
              <h3 className="text-bold text-2xl">2022.5.4 13:30-15:30 NZDT</h3>
            </Grid.Col>
            <Grid.Col>
              <h4 className="italic text-md">the is a short description</h4>
            </Grid.Col>
            <Grid.Col>
              <p className="mb-[-5px]">See you at</p>
              <h3 className="text-xl">OGGB 260.115</h3>
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
