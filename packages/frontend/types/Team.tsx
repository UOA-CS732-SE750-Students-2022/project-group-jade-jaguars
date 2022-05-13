export default interface Team {
  title: string;
  description?: string;

  color?: string; //
  admin: string; // uuid
  members?: string[]; // uuid
  events?: string[]; // uuid
}

export enum Colour {
  RED = 'red',
  BLUE = 'blue',
}
export interface TeamResponseDTO {
  id: string;
  title: string;
  description: string;
  color: Colour;
  admin: string;
  members: string[];
  events: string[];
}
