import { Container, Group } from '@mantine/core';
import type { NextPage } from 'next';
import { HeartHandshake } from 'tabler-icons-react';
import { useAuth } from '../src/context/AuthContext';
const Home: NextPage = () => {
  const { user, login, logout } = useAuth();
  return (
    <Container>
      <nav className="border p-5">
        <Group direction="row">
          <HeartHandshake />
          <div className="font-semibold">Count Me In</div>
        </Group>
      </nav>
      {/* <div>
        <a href="https://storyset.com/">Illustrations by Storyset</a>
      </div> */}
      <button onClick={login}>Login</button>
      <button onClick={logout}>Logout</button>
    </Container>
  );
};

export default Home;
