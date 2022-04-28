import { Container, Group } from '@mantine/core';
import type { NextPage } from 'next';
import { useEffect } from 'react';
import { HeartHandshake } from 'tabler-icons-react';
import { useAuth } from '../src/context/AuthContext';
import { useRouter } from 'next/router';
import { getAuth } from 'firebase/auth';
const Home: NextPage = () => {
  const { user, login, logout, signedIn, setUser } = useAuth();
  const router = useRouter();
  useEffect(() => {
    signedIn ? router.push('/demo') : router.push('/');
  }, [signedIn]);

  useEffect(() => {
    const clearListener = getAuth().onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => {
      clearListener();
    };
  }, [setUser]);
  return (
    <Container>
      <nav className="border p-5">
        <Group direction="row">
          <HeartHandshake />
          <div className="font-semibold">Count Me In</div>
        </Group>
      </nav>

      <button onClick={login}>Login</button>
      <button onClick={logout}>Logout</button>
    </Container>
  );
};

export default Home;
