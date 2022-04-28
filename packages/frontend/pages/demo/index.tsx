import { NextPage } from 'next';
import router from 'next/router';
import React, { useEffect } from 'react';
import { useAuth } from '../../src/context/AuthContext';
import { getAuth } from 'firebase/auth';

const Demo: NextPage = () => {
  const { user, logout, signedIn, setUser } = useAuth();
  useEffect(() => {
    !signedIn && router.push('/');
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
    <div>
      index
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Demo;
