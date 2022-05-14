import { Container, Grid, Group } from '@mantine/core';
import type { NextPage } from 'next';
import { useEffect } from 'react';
import { useAuth } from '../src/context/AuthContext';
import { useRouter } from 'next/router';

import Image from 'next/image';
import {
  createUser,
  getUser,
  getUserResponseStatus,
  updateUser,
} from '../helpers/apiCalls/apiCalls';
import { getHeaders } from '../helpers/apiCalls/helpers';
const Login: NextPage = () => {
  const { user, userId, authToken, login, signedIn, anonymousLogin } =
    useAuth();
  const router = useRouter();

  const BASE_URL =
    process.env.NEXT_PUBLIC_SOCKET_URL! +
    (process.env.NEXT_PUBLIC_BASE_URL ?? 'api/v1');

  useEffect(() => {
    const checkUserOnMongo = async () => {
      console.log('display name: ', user!.displayName);

      const userNameArray = user?.displayName
      ? user.displayName!.split(' ')
      : ['Anonymous', 'User'];
      const firstName = userNameArray[0];
      const lastName = userNameArray[1];

      const status = await getUserResponseStatus(userId);
      console.log(status);

      if (status != 404) {
        const dbUser = await getUser(userId);
        if (dbUser.firstName != firstName || dbUser.lastName != lastName) {
          const res = await updateUser(userId, {
            firstName: firstName,
            lastName: lastName,
          });
          console.log(res);
        }
      } else {
        const res = await createUser({
            // const nameArray = user!.displayName!.split(' ');
            // // Incase firstname or lastname isn't defined we set a default
            // // TODO: Validation rules from backend require a length of atleast
            // // ...for firstname and lastname, either backend changes these rules or frontend follow them
            // const firstName = nameArray[0] ?? 'Firstname';
            // const lastName = nameArray[1] ?? 'Lastname';
          firstName: firstName,
          lastName: lastName,
        });
        console.log(res);
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
