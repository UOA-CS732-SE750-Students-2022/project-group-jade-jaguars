import type { NextPage } from 'next';
import GroupAvailability from '../components/GroupAvailability';
import TimeBracket from '../types/TimeBracket';
import {
  AttendeeAvailability,
  AttendeeStatus,
  AvailabilityStatus,
} from '../types/Availability';

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
  return (
    <GroupAvailability
      timeOptions={timeOptions}
      availabilities={availabilities}
      onHover={handleHover}
    />
  );
};

export default Home;
