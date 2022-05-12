import axios from 'axios';
import { NextPage } from 'next';
import Link from 'next/link';
import React from 'react';

const FinalisedEventPage: NextPage = (context) => {
  return (
    <div>
      FinalisedEventPage:NextPage
      <Link href="/finalised/abc">
        <a>you</a>
      </Link>
    </div>
  );
};
export default FinalisedEventPage;
