import type { NextPage } from 'next';
import { useEffect } from 'react';
import { useAuth } from '../src/context/AuthContext';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
  const { userId, authToken, user, login, logout, signedIn, setUser } =
    useAuth();
  const router = useRouter();
  useEffect(() => {
    signedIn ? router.push('/') : router.push('/login');
  }, [signedIn]);

  function eventAvailability() {
    router.push({
      pathname: '/availability/',
      query: { eventId: 'c9200a22-a19e-43da-b03c-9e5e89bf3eda' },
    });
  }

  return (
    <>
      {signedIn && (
        <div>
          <button onClick={logout}>Logout</button>
          <button onClick={eventAvailability}>Event Availability</button>
        </div>
      )}
    </>
  );
};

export default Home;
