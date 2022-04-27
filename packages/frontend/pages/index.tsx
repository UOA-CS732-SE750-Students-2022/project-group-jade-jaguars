import type { NextPage } from 'next';
import TeamDetailsCard from '../components/TeamDetailsCard';
import TeamDetails from '../types/TeamDetails';
import Head from 'next/head';
import Image from 'next/image';
import CheckBoxList from '../components/CheckBoxList';
import EventCard from '../components/EventCard/EventCard';
import styles from '../styles/Home.module.css';
import { ShareLinkButton } from '../components/ShareLinkButton';
import AvailabilitySelector from '../components/AvailabilitySelector';
import TimeBracket from '../types/TimeBracket';
import {
  AvailabilityBlock,
  AvailabilityStatus,
} from '../types/AvailabilityBlock';

const timeOptions: TimeBracket[] = [
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

const availability: AvailabilityBlock[] = [
  {
    startTime: 1650232800000,
    endTime: 1650250800000,
    status: AvailabilityStatus.Available,
  },
  {
    startTime: 1650250800000,
    endTime: 1650258000000,
    status: AvailabilityStatus.Unavailable,
  },
  {
    startTime: 1650315600000,
    endTime: 1650344400000,
    status: AvailabilityStatus.Unavailable,
  },
  {
    startTime: 1650402000000,
    endTime: 1650430800000,
    status: AvailabilityStatus.Tentative,
  },
  {
    startTime: 1650488400000,
    endTime: 1650517200000,
    status: AvailabilityStatus.Unavailable,
  },
  {
    startTime: 1650574800000,
    endTime: 1650603600000,
    status: AvailabilityStatus.Unavailable,
  },
];

const Home: NextPage = () => {
  return (
    <>
      <ShareLinkButton eventLink="https:sldkfjalsjdfkladf" />

      <AvailabilitySelector
        timeOptions={timeOptions}
        availability={availability}
        status={AvailabilityStatus.Available}
      />
    </>
  );
};

export default Home;
