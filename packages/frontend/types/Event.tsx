export enum EventStatus {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Rejected = 'Rejected',
  Cancelled = 'Cancelled',
}

export interface TimeBracket {
  startDate: Date;
  endDate: Date;
}

export enum AvailabilityStatus {
  Available = 'Available',
  Unavailable = 'Unavailable',
  Tentative = 'Tentative',
}

export interface AvailabilityBlock extends TimeBracket {
  status: AvailabilityStatus;
}

export interface AttendeeAvailability {
  attendee: string;
  availability: AvailabilityBlock[];
  confirmed: Boolean;
}

export interface EventAvailability {
  _id: string;
  potentialTimes: TimeBracket[]; // Virtual field
  finalisedTime?: TimeBracket;
  attendeeAvailability: AttendeeAvailability[];
}

export interface Event {
  _id: string;
  title: string;
  description?: string;
  status: EventStatus;
  startDate: Date;
  endDate: Date;
  availability: EventAvailability;
  location?: string;
  identifier: string;
  team?: string;
}
