import type { NextPage } from 'next';
import { useEffect } from 'react';
import { useAuth } from '../src/context/AuthContext';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
  const { logout, signedIn } = useAuth();
  const router = useRouter();
  useEffect(() => {
    signedIn ? router.push('/dashboard') : router.push('/login');
  }, [signedIn]);

  return <></>;
};

export default Home;
