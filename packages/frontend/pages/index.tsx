import type { NextPage } from 'next';
import TeamDetailsCard from '../components/TeamDetailsCard';
import TeamDetails from '../types/TeamDetails';
import Head from 'next/head';
import Image from 'next/image';
import CheckBoxList from '../components/CheckBoxList';
import EventCard from '../components/EventCard/EventCard';
import styles from '../styles/Home.module.css';
import { ShareLinkButton } from '../components/ShareLinkButton';

const Home: NextPage = () => {
  return (
    <>
      <ShareLinkButton eventLink="https:sldkfjalsjdfkladf" />
    </>
  );
};

export default Home;
