import { AvailabilityBlock } from './Availability';

export default interface Event {
  title: string;
  description?: string;
  status?: EventStatus;
  startDate: Date;
  endDate: Date;
  availability?: EventAvailability;
  attendees?: [];
  location?: string;
  identifier?: string;
  team?: string; // id
  admin?: string; // id
}

export enum EventStatus {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Rejected = 'Rejected',
  Cancelled = 'Cancelled',
}

export interface EventAvailability {
  potentialTimes: TimeBracket;
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
