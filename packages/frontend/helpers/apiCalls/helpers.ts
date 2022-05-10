import axios from 'axios';
import { auth } from '../../src/config/firebase.config';

const BASE_URL = 'http://localhost:3000/api/v1';
//const BASE_URL = 'http://149.28.170.219/api/v1';

export const getToken = async () => {
  const authToken = await auth.currentUser?.getIdToken();
  return authToken;
};

export const getHeaders = async () => {
  const authToken = await getToken();
  const headers = { Authorization: `Bearer ${authToken}` };
  return headers;
};

export const getData = async (url: string, payload?: any) => {
  const data = await axios
    .get(`${BASE_URL}${url}`, {
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

export const postData = async (url: string, payload?: any) => {
  const data = await axios
    .post(`${BASE_URL}${url}`, payload, {
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

export const putData = async (url: string, payload?: any) => {
  const data = await axios
    .put(`${BASE_URL}${url}`, payload, {
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

export const patchData = async (url: string, payload?: any) => {
  const data = await axios
    .patch(`${BASE_URL}${url}`, payload, {
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

export const deleteData = async (url: string, payload?: any) => {
  const data = await axios
    .delete(`${BASE_URL}${url}`, {
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
