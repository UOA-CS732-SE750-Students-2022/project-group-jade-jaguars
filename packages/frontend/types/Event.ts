import { AvailabilityBlock } from './Availability';
import Member from './Member';

export default interface Event {
  id?: string;
  title: string;
  description?: string;
  status?: EventStatus;
  startDate: Date;
  endDate: Date;
  availability?: EventAvailability;
  attendees?: [];
  location?: string;
  team?: string; // id
  admin?: string; // id
  date?: Date;
  participants?: Member[];
}

export enum EventStatus {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Rejected = 'Rejected',
  Cancelled = 'Cancelled',
}

export interface EventAvailability {
  potentialTimes: TimeBracket[];
  finalisedTime?: TimeBracket;
  attendeeAvailability?: AttendeeAvailability[];
}

export interface TimeBracket {
  startDate: Date;
  endDate: Date;
}

export interface AttendeeAvailability {
  attendee: string;
  availability: AvailabilityBlock[];
  confirmed: Boolean;
}

export interface SearchEventPayload {
  titleSubStr: string;
}

export interface EventResponseDTO {
  id: string;
  title: string;
  description?: string;
  status: EventStatus;
  startDate: Date;
  endDate: Date;
  availability: EventAvailability;
  location?: string;
  team: string;
  admin: string;
}
export interface EventPayload {
  id?: string;
  title?: string;
  description?: string;
  status?: EventStatus;
  startDate?: Date;
  endDate?: Date;
  availability?: EventAvailability;
  attendees?: [];
  location?: string;
  team?: string; // id
  admin?: string; // id
  date?: Date;
  participants?: Member[];
}
