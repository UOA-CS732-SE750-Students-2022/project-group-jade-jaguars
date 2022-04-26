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
