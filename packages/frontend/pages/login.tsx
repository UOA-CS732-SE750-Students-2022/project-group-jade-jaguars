import { Container, Grid, Group } from '@mantine/core';
import type { NextPage } from 'next';
import { useEffect } from 'react';
import { useAuth } from '../src/context/AuthContext';
import { useRouter } from 'next/router';

import Image from 'next/image';
const Login: NextPage = () => {
  const { user, userId, authToken, login, signedIn, anonymousLogin } =
    useAuth();
  const router = useRouter();
  console.log();

  useEffect(() => {
    const checkUserOnMongo = async () => {
      const response = await fetch(
        `http://localhost:3000/api/v1/user/${userId}`,
        {
          headers: new Headers({
            Authorization: 'Bearer ' + authToken,
          }),
        },
      );

      if (response.status == 404) {
        const nameArray = user!.displayName!.split(' ');
        // Incase firstname or lastname isn't defined we set a default
        // TODO: Validation rules from backend require a length of atleast
        // ...for firstname and lastname, either backend changes these rules or frontend follow them
        const firstName = nameArray[0] ?? 'Firstname';
        const lastName = nameArray[1] ?? 'Lastname';
        const createUserResponse = await fetch(
          'http://localhost:3000/api/v1/user',
          {
            method: 'POST',
            headers: {
              Authorization: 'Bearer ' + authToken,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              firstName: firstName,
              lastName: lastName,
            }),
          },
        );
        console.log(createUserResponse);
      }
    };
    userId && checkUserOnMongo();
    signedIn ? router.push('/') : router.push('/login');
  }, [signedIn]);

  return (
    <Container>
      <nav className=" p-5">
        <Group direction="row" align="center">
          <Image src="/logo.svg" width={70} height={70} />
          <h1 className="mb-[-10px]">CountMeIn</h1>
        </Group>
      </nav>
      <Grid align="center">
        <Grid.Col md={12} lg={6}>
          <span>
            <Group direction="column" align={'center'}>
              <Image
                src="/landing-banner.svg"
                alt="banner"
                width={600}
                height={400}
              />
              <a className="text-secondary" href="https://storyset.com/">
                Illustrations by Storyset
              </a>
            </Group>
          </span>
        </Grid.Col>
        <Grid.Col md={12} lg={6}>
          <Group direction="column" align="center">
            <h1>All events in one place.</h1>
            <h1>Schedule events for teams.</h1>
            <button
              onClick={login}
              className="bg-primary px-20 py-2 rounded-md cursor-pointer text-white"
            >
              Login
            </button>

            <button
              onClick={anonymousLogin}
              className="bg-primary px-10 py-2 rounded-md cursor-pointer text-white"
            >
              Continue without Login
            </button>
          </Group>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default Login;
