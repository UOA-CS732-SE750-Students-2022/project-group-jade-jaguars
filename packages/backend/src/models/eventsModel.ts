import { TimeBracket } from './sharedModels';
import { AttendeeAvailability } from './availabilityModel';
// EVENT
export interface Event {
  title: string;
  availability: EventAvailability;
  eventAdmin: string[]; // uuid

  description?: string;
  location?: string;
  uuid?: string;
}

export interface EventAvailability {
  potentialTimes: TimeBracket[]; // start and end timestamps
  finalisedTime?: TimeBracket;
  attendeeAvailability: AttendeeAvailability;
}
