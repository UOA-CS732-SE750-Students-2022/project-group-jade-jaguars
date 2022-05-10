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

  // stage event: e2c8cbac-760f-410a-98b8-3b47a2aa8055
  // prod event: a78d55d9-278b-4512-a1f8-5ea9faafd110

  function eventAvailability() {
    router.push({
      pathname: '/availability/',
      query: { eventId: 'ce282192-a323-49c9-8260-28a842dea19c' },
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
