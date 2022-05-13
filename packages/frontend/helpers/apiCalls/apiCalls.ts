import { deleteData, getData, patchData, postData } from './helpers';
import User from '../../types/User';
import Team, { TeamResponseDTO } from '../../types/Team';
import Event from '../../types/Event';
import {
  AvailabilityConfirmation,
  AvailabilityPayload,
} from '../../types/Availability';

// user api calls
export const getUser = async (userId: string) => {
  const data = await getData(`/user/${userId}`);
  return data;
};

export const createUser = async (payload: User) => {
  const data = await postData(`/user`, payload);
  return data;
};

export const updateUser = async (userId: string, payload: User) => {
  const data = await patchData(`/user/${userId}`, payload);
  return data;
};

export const deleteUser = async (userId: string) => {
  const data = await deleteData(`/user/${userId}`);
  return data;
};

// event api calls
export const getEvent = async (eventId: string) => {
  const data = await getData(`/event/${eventId}`);
  return data;
};

export const createEvent = async (payload: Event) => {
  const data = await postData(`/event`, payload);
  return data;
};

export const updateEvent = async (eventId: string, payload: Event) => {
  const data = await patchData(`/event/${eventId}`, payload);
  return data;
};

export const deleteEvent = async (eventId: string) => {
  const data = await deleteData(`/event/${eventId}`);
  return data;
};

export const searchEvent = async (payload: string) => {
  const dataPayload = {
    titleSubStr: payload,
  };
  const data = await postData(`/event/search`, dataPayload);
  return data;
};

// availability api calls
export const createAvailability = async (
  eventId: string,
  payload: AvailabilityPayload,
) => {
  const data = await postData(`/event/${eventId}/availability`, payload);
  return data;
};

export const deleteAvailability = async (
  eventId: string,
  payload: AvailabilityPayload,
) => {
  const { userId, startDate, endDate } = payload;
  const data = await deleteData(
    `/event/${eventId}/availability?userId=${userId}&startDate=${startDate}&endDate=${endDate}`,
  );
  return data;
};

export const getAvailabilityConfirmation = async (eventId: string) => {
  const data = await getData(`/event/${eventId}/availability/confirm`);
  return data;
};

export const updateAvailabilityConfirmation = async (
  eventId: string,
  payload: AvailabilityConfirmation,
) => {
  const data = await patchData(
    `/event/${eventId}/availability/confirm`,
    payload,
  );
  return data;
};

// team api calls
export const getTeam = async (teamId: string): Promise<TeamResponseDTO> => {
  const data = await getData(`/team/${teamId}`);
  return data;
};

export const createTeam = async (payload: Team): Promise<TeamResponseDTO> => {
  const data = await postData(`/team`, payload);
  return data;
};

export const updateTeam = async (
  teamId: string,
  payload: Team,
): Promise<TeamResponseDTO> => {
  const data = await patchData(`/team/${teamId}`, payload);
  return data;
};

export const deleteTeam = async (teamId: string) => {
  const data = await deleteData(`/team/${teamId}`);
  return data;
};
