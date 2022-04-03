// TEAM
export interface Team {
  title: string;
  description?: string;

  color: Color; // ENUM
  admin: string; // uuid
  members: string[]; // uuid
  events: string[]; // uuid
  uuid: string;
}

export enum Color {
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
