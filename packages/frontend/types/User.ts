import { Team } from './Team';

export interface User {
  firstName: string;
  lastName: string;
  _id: string;
  email?: string;
  events: String[];
}

interface CreateUserDTO {
  firstName: string;
  _id: string;
  lastName: string;
  email?: string;
  events?: String[];
}

export interface UserResponseDTO {
  id: string;
  firstName: string;
  lastName: string;
  events: String[];
}

interface PatchUserDTO extends Partial<Omit<IUser, '_id'>> {}

interface GetUserTeamsResponseDTO {
  teams: Team[];
}
