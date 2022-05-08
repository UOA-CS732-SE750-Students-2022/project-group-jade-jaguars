import { Container, Grid, Group } from '@mantine/core';
import type { NextPage } from 'next';
import { useEffect } from 'react';
import { useAuth } from '../src/context/AuthContext';
import { useRouter } from 'next/router';
import { getAuth } from 'firebase/auth';
import Image from 'next/image';
const Login: NextPage = () => {
  const { user, login, logout, signedIn, setUser } = useAuth();
  const router = useRouter();
  console.log();
  useEffect(() => {
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
          </Group>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default Login;
