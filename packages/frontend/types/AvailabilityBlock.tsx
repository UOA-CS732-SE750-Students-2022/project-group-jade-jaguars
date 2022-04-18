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
