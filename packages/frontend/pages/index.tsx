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

  // stage event: ce282192-a323-49c9-8260-28a842dea19c
  // prod event: a78d55d9-278b-4512-a1f8-5ea9faafd110

  function eventAvailability() {
    router.push({
      pathname: '/availability/',
      query: { eventId: '11b1f35f-5c83-487f-98f4-f073a50f8156' },
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
