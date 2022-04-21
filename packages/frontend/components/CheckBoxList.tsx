import { Checkbox, ScrollArea } from '@mantine/core';
import { useHover } from '@mantine/hooks';
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
        return <TeamCheckBox label={team} order={index} />;
      })}
    </ScrollArea>
  );
};

export default CheckBoxList;
