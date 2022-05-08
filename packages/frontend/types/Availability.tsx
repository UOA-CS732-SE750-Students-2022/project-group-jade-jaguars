export interface AvailabilityBlock {
  startTime: number;
  endTime: number;
  status: AvailabilityStatus;
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
  status: AvailabilityStatus;
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
