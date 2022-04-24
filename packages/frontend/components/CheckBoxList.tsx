import { Checkbox, ScrollArea } from '@mantine/core';
import React from 'react';
import { TeamCheckBox } from './TeamCheckBox';

const CheckBoxList = () => {
  const teamList = [
    '701',
    '750',
    'Board Game Club',
    'Overwatch Club',
    'Board Game Club',
    'Board Game Club',
    'Board Game Club',
    'Board Game Club',
  ];

  return (
    <ScrollArea style={{ height: 100, width: 300 }}>
      {teamList.map((team, index) => {
        return <TeamCheckBox label={team} order={index} key={index} />;
      })}
    </ScrollArea>
  );
};

export default CheckBoxList;
