import { Paper, Grid, Box } from '@mantine/core';
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
    <Box>
      <Paper>
        <Grid children={undefined}></Grid>
      </Paper>
    </Box>
  );
};
export default FinalisedEventPageWithId;
