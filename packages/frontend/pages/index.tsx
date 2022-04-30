import type { NextPage } from 'next';
import { SearchBar } from '../components/SearchBar';
import { useEffect, useState } from 'react';

const Home: NextPage = () => {
  const [value, setValue] = useState('');
  useEffect(() => {
    console.log(value);
  }, [value]);
  return (
    <>
      <SearchBar value={value} setValue={setValue} />
    </>
  );
};

export default Home;
