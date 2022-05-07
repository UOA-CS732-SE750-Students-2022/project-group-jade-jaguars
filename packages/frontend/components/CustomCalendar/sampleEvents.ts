import Member from '../../types/Member';
import { EventInterface } from './CustomCalendar';

const now = new Date();

const participants: Member[] = [
  {
    name: 'Alex',
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
    profilePic:
      'data:image/png;base64,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',
  },
  {
    name: 'David',
  },
  {
    name: 'Eric',
  },
  {
    name: 'Frank',
  },
  {
    name: 'George',
  },
  {
    name: 'Harry',
  },
  {
    name: 'Izzy',
  },
  {
    name: 'John',
  },
];

export const events: EventInterface[] = [
  {
    id: 0,
    title: 'All Day Event very very very long title',
    allDay: false,
    start: new Date('04/29/2022, 10:30'),
    end: new Date('04/29/2022, 13:30'),
    description: 'Pre-meeting meeting, to prepare for the meeting',
    participants: participants,
  },
  {
    id: 14,
    title: 'Today',
    start: new Date(new Date().setHours(new Date().getHours() - 3)),
    end: new Date(new Date().setHours(new Date().getHours() + 3)),
    participants: participants,
  },
  {
    id: 15,
    title: 'Point in Time Event',
    start: now,
    end: now,
    participants: participants,
  },
];