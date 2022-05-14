import Member from './Member';
import { EventInterface } from '../components/CustomCalendar/CustomCalendar';

export default interface Team {
  _id?: string;
  title: string;
  description?: string;

  color?: string; //
  admin: string; // uuid
  members?: string[]; // uuid
  events?: string[]; // uuid

  membersList?: Member[];
}

export interface UpdateTeamPayload {
  _id?: string;
  title?: string;
  description?: string;

  color?: string; //
  admin?: string; // uuid
  members?: string[]; // uuid
  events?: string[]; // uuid

  membersList?: Member[];
  eventsList?: EventInterface[] | undefined;
}
