import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: 'count-me-in-59785.firebaseapp.com',
  projectId: 'count-me-in-59785',
  storageBucket: 'count-me-in-59785.appspot.com',
  messagingSenderId: '922325414737',
  appId: '1:922325414737:web:5f625b9ebff529b8b2d970',
  measurementId: 'G-HGDHQD3RN4',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
