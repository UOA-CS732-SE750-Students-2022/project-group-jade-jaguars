import Member from '../types/Member';

export default interface TeamDetails {
  title: string;
  description?: string;

  color: string; //
  admin: string; // uuid
  members: Member[];
  events: string[]; // uuid
}
