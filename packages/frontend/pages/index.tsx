import { Checkbox, Navbar } from '@mantine/core';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import CheckBoxList from '../components/CheckBoxList';
import { CustomNavbar } from '../components/CustomNavbar';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => (
  <>
    <CustomNavbar />
  </>
);

export default Home;
