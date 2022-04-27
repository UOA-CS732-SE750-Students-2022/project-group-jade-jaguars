import type { NextPage } from 'next';
import AvailabilitySelector from '../components/AvailabilitySelector';
import TimeBracket from '../types/TimeBracket';
import {
  AvailabilityBlock,
  AvailabilityStatus,
} from '../types/AvailabilityBlock';
import { TimeOptionsList } from '../components/TimeOptionsList';

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
  const participants = [
    {
      name: 'Amy',
      profilePic:
        'https://media-exp1.licdn.com/dms/image/C4E0BAQHUo_h0JGtwYw/company-logo_200_200/0/1606490589727?e=2147483647&v=beta&t=TO869IrmjUEr7VSFzSHaqcEN4_-TTctFucuyBv8cqDA',
    },
    {
      name: 'Bob',
      profilePic:
        'https://img.pixers.pics/pho_wat(s3:700/FO/23/80/66/66/700_FO23806666_a4cd1ba91572617e8833dcbd1d17a44c.jpg,700,700,cms:2018/10/5bd1b6b8d04b8_220x50-watermark.png,over,480,650,jpg)/wall-murals-the-letter-b.jpg.jpg',
    },
    {
      name: 'Carlie',
      // profilePic: '',
    },
    {
      name: 'David',
      // profilePic: '',
    },
    {
      name: 'Eric',
      // profilePic: '',
    },
  ];
  return (
    <>
      <AvailabilitySelector
        timeOptions={timeOptions}
        availability={availability}
        status={AvailabilityStatus.Available}
      />
      <TimeOptionsList />
    </>
  );
};

export default Home;
