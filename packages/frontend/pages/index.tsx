import type { NextPage } from 'next';
import MemberCard from '../components/MemberCard';

const Home: NextPage = () => {
  return (
    <>
      <MemberCard {...'member'} />
    </>
  );
};

export default Home;
