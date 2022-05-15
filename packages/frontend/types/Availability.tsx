export interface AvailabilityBlock {
  startDate: Date | string;
  endDate: Date | string;
  status: AvailabilityStatusStrings;
}

export enum AvailabilityStatus {
  Available,
  Unavailable,
  Tentative,
}

export interface AttendeeAvailability {
  uuid: string; // uuid of the attendee
  availability: AvailabilityBlock[];
}

export interface AttendeeStatus {
  uuid: string;
  status: AvailabilityStatusStrings;
}

export interface AvailabilityPayload {
  startDate: Date | String;
  endDate: Date | String;
  status?: AvailabilityStatusStrings;
  userId: string;
}

export interface AvailabilityConfirmation {
  userId: string;
  confirmed: boolean;
}

export enum AvailabilityStatusStrings {
  Available = 'Available',
  Unavailable = 'Unavailable',
  Tentative = 'Tentative',
}
