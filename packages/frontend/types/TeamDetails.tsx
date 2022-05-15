import Member from '../types/Member';

export default interface TeamDetails {
  title: string;
  description?: string;

  color?: string; //
  admin?: string; // uuid
  members: Member[] | undefined;
  events?: string[]; // uuid

  onClick?: (param?: any) => void;
}
