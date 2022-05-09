export interface AvailabilityBlock {
  startDate: number;
  endDate: number;
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
  startDate: Date;
  endDate: Date;
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
