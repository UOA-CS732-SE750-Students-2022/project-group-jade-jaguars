import { TextInput } from '@mantine/core';
import { NextPage } from 'next';
import Router, { useRouter } from 'next/router';
import React, { useState } from 'react';

const JoinPage: NextPage = () => {
  const [code, setCode] = useState('');
  const router = useRouter();
  const onClick = () => {
    console.log(code);
    router.push({
      pathname: '/availability',
      query: {
        eventId: code,
      },
    });
  };
  return (
    <>
      <h1>Enter your code</h1>
      <input value={code} onChange={(e) => setCode(e.target.value)} />
      <button onClick={onClick}>submit</button>
    </>
  );
};
export default JoinPage;
