import type { NextPage } from 'next';
import { useEffect } from 'react';
import { useAuth } from '../src/context/AuthContext';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
  const { userId, authToken, user, login, logout, signedIn, setUser } =
    useAuth();
  const router = useRouter();
  console.log(authToken);
  useEffect(() => {
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('userId', userId);
    signedIn ? router.push('/') : router.push('/login');
  }, [signedIn]);

  return (
    <>
      {signedIn && (
        <div>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </>
  );
};

export default Home;
