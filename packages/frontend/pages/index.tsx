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
      query: { eventId: '8a5654f0-d2ec-4ff6-972f-9e0357db0531' },
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
