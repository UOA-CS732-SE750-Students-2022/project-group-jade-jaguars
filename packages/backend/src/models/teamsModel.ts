// TEAM
export interface Team {
  title: string;
  description?: string;

  color: Colour; //
  admin: string; // uuid
  members: string[]; // uuid
  events: string[]; // uuid
  uuid: string;
}

export enum Colour {
  RED,
  GREEN,
  BLUE,
  YELLOW,
  PURPLE,
  ORANGE,
  PINK,
  GREY,
  BROWN,
}
