// PROFILE
export interface User {
  Name: string;
  uuid?: string; // firebase UUID

  teams: string[]; // uuid
  events: string[]; // uuid

  // TODO stretch goal fields eg dietary restrictions, etc.
}
