export default interface Team {
  title: string;
  description?: string;

  color?: string; //
  admin: string; // uuid
  members?: string[]; // uuid
  events?: string[]; // uuid
}
