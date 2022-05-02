import { NextPage } from 'next';
import router from 'next/router';
import React, { useEffect } from 'react';
import { useAuth } from '../../src/context/AuthContext';

const Demo: NextPage = () => {
  const { userId, authToken, logout, signedIn } = useAuth();

  useEffect(() => {
    !signedIn && router.push('/');
  }, [signedIn]);

  return (
    <div>
      {userId}
      <hr></hr>
      {authToken}
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Demo;
