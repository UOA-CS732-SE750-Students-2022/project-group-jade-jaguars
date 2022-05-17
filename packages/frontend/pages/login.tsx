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
const Login: NextPage = () => {
  const { user, userId, authToken, login, signedIn, anonymousLogin } =
    useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkUserOnMongo = async () => {
      const userNameArray = user?.displayName
        ? user.displayName!.split(' ')
        : ['Anonymous', 'User'];
      const firstName = userNameArray[0];
      const lastName = userNameArray[1];

      const status = await getUserResponseStatus(userId);

      if (status != 404) {
        const dbUser = await getUser(userId);
        if (
          (dbUser && dbUser.firstName != firstName) ||
          (dbUser && dbUser.lastName != lastName)
        ) {
          await updateUser(userId, {
            firstName: firstName,
            lastName: lastName,
          });
        } else {
          await createUser({
            firstName: firstName,
            lastName: lastName,
          });
        }
      } else {
        await createUser({
          firstName: firstName,
          lastName: lastName,
        });
      }
    };
    userId && checkUserOnMongo();
    // authToken && router.push('/dashboard');
    //signedIn && router.push('/dashboard');
  }, [signedIn, authToken, user]);

  return (
    <Container>
      <div className="flex flex-col mt-[12vh] justify-center items-center">
        <nav className="flex flex-row items-center h-20 mr-6 -mb-3 justify-center">
          <Image src="/logo.svg" width={70} height={70} />
          <h1 className="mt-5 font-semibold">
            Count<span className="text-primary">Me</span>In
          </h1>
        </nav>
        <div className="flex flex-col items-center">
          <Image
            src="/landing-banner.svg"
            alt="banner"
            width={600}
            height={400}
          />
          <div className="flex flex-col gap-2 items-center">
            <p className="text-[30px] tracking-wide font-medium">Welcome!</p>
            <p className="text-[20px] tracking-wide font-base">
              Schedule events efficiently with CountMeIn!
            </p>
          </div>
          <div className="mt-10 flex flex-col gap-4 items-center">
            <button
              onClick={login}
              className="bg-primary px-3 py-3 w-[250px] rounded-lg cursor-pointer text-white"
            >
              <p className="text-md tracking-wider font-medium">Login</p>
            </button>

            <button
              onClick={anonymousLogin}
              className="bg-primary px-5 py-3 w-[250px] rounded-lg cursor-pointer text-white"
            >
              <p className="text-md tracking-normal font-medium">
                Continue without Login
              </p>
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Login;
