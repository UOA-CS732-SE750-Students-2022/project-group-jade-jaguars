import { Container, Grid, Group } from '@mantine/core';
import type { NextPage } from 'next';
import { useEffect } from 'react';
import { useAuth } from '../src/context/AuthContext';
import { useRouter } from 'next/router';
import { getAuth } from 'firebase/auth';
import Image from 'next/image';
import CheckBoxList from '../components/CheckBoxList';
import EventCard from '../components/EventCard/EventCard';
import styles from '../styles/Home.module.css';
import { events } from '../components/CustomCalendar/sampleEvents';
import { ShareLinkButton } from '../components/ShareLinkButton';
import AvailabilitySelector from '../components/AvailabilitySelector';
import GroupAvailability from '../components/GroupAvailability';
import TimeBracket from '../types/TimeBracket';
import {
  AttendeeAvailability,
  AttendeeStatus,
  AvailabilityStatus,
} from '../types/Availability';
import CustomCalendar from '../components/CustomCalendar/CustomCalendar';

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

const availabilities: AttendeeAvailability[] = [
  {
    uuid: 'Brad',
    availability: [
      {
        startTime: 1650232800000,
        endTime: 1650250800000,
        status: AvailabilityStatus.Available,
      },
      {
        startTime: 1650402000000,
        endTime: 1650430800000,
        status: AvailabilityStatus.Tentative,
      },
    ],
  },
  {
    uuid: 'Chad',
    availability: [
      {
        startTime: 1650243600000,
        endTime: 1650254400000,
        status: AvailabilityStatus.Available,
      },
      {
        startTime: 1650405600000,
        endTime: 1650423600000,
        status: AvailabilityStatus.Available,
      },
      {
        startTime: 1650495600000,
        endTime: 1650517200000,
        status: AvailabilityStatus.Tentative,
      },
    ],
  },
];

const handleHover = (info: { people: AttendeeStatus[]; numPeople: number }) => {
  console.log(info);
};

const Home: NextPage = () => {
  const { login, signedIn, userId, authToken, user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    const checkUserOnMongo = async () => {
      const response = await fetch(
        `http://localhost:3000/api/v1/user/${userId}`,
        {
          headers: new Headers({
            Authorization: 'Bearer ' + authToken,
          }),
        },
      );
      console.log(await response.json());
      if (response.status == 404) {
        const nameArray = user!.displayName!.split(' ');
        const firstName = nameArray[0];
        const lastName = nameArray[1];

        const createUserResponse = await fetch(
          'http://localhost:3000/api/v1/user',
          {
            method: 'POST',
            headers: {
              Authorization: 'Bearer ' + authToken,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              firstName: firstName,
              lastName: lastName,
            }),
          },
        );
        console.log(createUserResponse);
      }
    };
    userId && checkUserOnMongo();
    signedIn ? router.push('/demo') : router.push('/');
  }, [signedIn]);

  return (
    <div className="h-[80vh] w-[50vw]">
      <CustomCalendar
        events={events}
        onParticipantClick={() => console.log('clicked')}
      />
      <ShareLinkButton eventLink={'http'} />
    </div>
  );
};

export default Home;
