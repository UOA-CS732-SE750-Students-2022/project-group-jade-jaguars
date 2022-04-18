import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import AvailabilitySelector from '../components/AvailabilitySelector';
import styles from '../styles/Home.module.css';
import TimeBracket from '../types/TimeBracket';

const potentialTimes: TimeBracket[] = [
  {
    startTime: 1650229200000,
    endTime: 1650258000000,
  },
  {
    startTime: 1650315600000,
    endTime: 1650344400000,
  },
  {
    startTime: 1650402000000,
    endTime: 1650430800000,
  },
  {
    startTime: 1650488400000,
    endTime: 1650517200000,
  },
  {
    startTime: 1650574800000,
    endTime: 1650603600000,
  },
];

const availability: TimeBracket[] = [
  {
    startTime: 1650232800000,
    endTime: 1650250800000,
  },
  {
    startTime: 1650402000000,
    endTime: 1650430800000,
  },
];

const Home: NextPage = () => {
  return (
    <AvailabilitySelector
      potentialTimes={potentialTimes}
      availability={availability}
    />
  );
};

export default Home;
