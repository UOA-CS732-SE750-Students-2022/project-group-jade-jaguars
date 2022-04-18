import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import AvailabilitySelector from '../components/AvailabilitySelector';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  return <AvailabilitySelector numRows={16} numCols={5} />;
};

export default Home;
