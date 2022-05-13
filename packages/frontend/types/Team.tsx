export interface Team {
  _id: string; // id
  title: string;
  description?: string;
  color?: Colour;
  admin: string; // id
  members?: string[]; //ids
  events?: string[]; // ids
}

export enum Colour {
  RED = 'red',
  BLUE = 'blue',
}
export interface CreateTeamDTO {
  title: string;
  description?: string;
  color?: Colour;
  admin: string;
  members?: string[];
  events?: string[];
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

export interface PatchTeamDTO extends Partial<Omit<Team, '_id'>> {}

export interface AddMemberDTO {
  userId: string;
}

export interface GetUserTeamsResponseDTO {
  teams: Team[];
}
