import { Checkbox } from '@mantine/core';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import CheckBoxList from '../components/CheckBoxList';
import EventForm from '../components/EventForm';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  return (
    <>
      <CheckBoxList />
      <EventForm />
    </>
  );
};

export default Home;
