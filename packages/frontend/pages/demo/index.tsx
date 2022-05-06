import { NextPage } from 'next';
import router from 'next/router';
import React, { useEffect } from 'react';
import { useAuth } from '../../src/context/AuthContext';

const Demo: NextPage = () => {
  const { userId, authToken, logout, signedIn } = useAuth();

  useEffect(() => {
    !signedIn && router.push('/');
  }, [signedIn]);

  function eventAvailability() {
    router.push({
      pathname: '/availability/',
      query: { eventId: '4e403567-a47a-432b-bdef-5302c63d4e88' },
    });
  }

  return (
    <div>
      {userId}
      <hr></hr>
      {authToken}
      <button onClick={logout}>Logout</button>
      <button onClick={eventAvailability()}>Event Availability</button>
    </div>
  );
};

export default Demo;
