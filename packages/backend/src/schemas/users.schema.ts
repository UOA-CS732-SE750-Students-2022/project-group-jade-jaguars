export interface User {
  uuid?: string;
  firstName: string;
  lastName: string;
  events: Event[];
  // teams: [objectid]
}
