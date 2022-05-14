import axios from 'axios';
import { auth } from '../../src/config/firebase.config';

// URL for endpoint
const BASE_URL: string =
  (process.env.NEXT_PUBLIC_HOST as string) +
  (process.env.NEXT_PUBLIC_BASE as string);

console.log('thing');
console.log(BASE_URL);

// Fetch the authToken of the user
export const getToken = async () => {
  const authToken = await auth.currentUser?.getIdToken();
  return authToken;
};

// Set the API call headers with bearer token
export const getHeaders = async () => {
  const authToken = await getToken();
  const headers = { Authorization: `Bearer ${authToken}` };
  return headers;
};

// GET an endpoint
export const getData = async (endpoint: string, payload?: any) => {
  const data = await axios
    .get(`${BASE_URL}${endpoint}`, {
      headers: await getHeaders(),
      ...(payload && { params: payload }),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (!error?.response) {
        throw new Error(
          'The server is down at the moment, please try again later',
        );
      }
    });
  return data;
};

// POST an endpoint
export const postData = async (endpoint: string, payload?: any) => {
  const data = await axios
    .post(`${BASE_URL}${endpoint}`, payload, {
      headers: await getHeaders(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (!error?.response) {
        throw new Error(
          'The server is down at the moment, please try again later',
        );
      }
    });
  return data;
};

// PATCH an endpoint
export const patchData = async (endpoint: string, payload?: any) => {
  const data = await axios
    .patch(`${BASE_URL}${endpoint}`, payload, {
      headers: await getHeaders(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (!error?.response) {
        throw new Error(
          'The server is down at the moment, please try again later',
        );
      }
    });
  return data;
};

// DELETE an endpoint with a payload
export const deleteData = async (endpoint: string, payload?: any) => {
  const data = await axios
    .delete(`${BASE_URL}${endpoint}`, {
      headers: await getHeaders(),
      ...(payload && { params: payload }),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (!error?.response) {
        throw new Error(
          'The server is down at the moment, please try again later',
        );
      }
    });
  return data;
};

// Convert a ISO date into a local date without changing the time by applying the timezone,
// converts the date into exactly the date presented by the ISO date
export const getTZDate = (date: Date) => {
  return new Date(new Date(date).toISOString().slice(0, 19).replace('Z', ' '));
};
