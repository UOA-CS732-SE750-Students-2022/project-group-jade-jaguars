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
      query: { eventId: '4e403567-a47a-432b-bdef-5302c63d4e88' },
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
