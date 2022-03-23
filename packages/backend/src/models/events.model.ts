export interface Event {
  title: string;
  status: EventStatus;

  startTime?: number;
  endTime?: number;
  attendees?: string[]; //uuid
  description?: string;
  location?: string;
  uuid?: string;
}

export enum EventStatus {
  Pending,
  Accepted,
  Rejected,
  Cancelled,
}
